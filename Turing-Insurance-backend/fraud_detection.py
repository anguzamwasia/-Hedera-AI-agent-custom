import os
import cv2
import numpy as np
from io import BytesIO
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Union
from dotenv import load_dotenv
from PIL import Image
import imagehash

# Hedera and AI imports
from hedera import (
    Client, PrivateKey, AccountId,
    FileCreateTransaction, TopicMessageSubmitTransaction, 
    Hbar, FileContentsQuery
)
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

class MultiMediaFraudDetector:
    def __init__(self):
        load_dotenv()
        self._init_hedera()
        self._init_ai_models()
        self.media_db = {}  # Tracks processed media hashes

    def _init_hedera(self):
        """Initialize Hedera client and services"""
        try:
            self.client = Client.forTestnet()
            self.client.setOperator(
                AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID")),
                PrivateKey.fromString(os.getenv("HEDERA_PRIVATE_KEY"))
            )
            self.claims_topic_id = os.getenv("HEDERA_TOPIC_ID")
        except Exception as e:
            print(f"⚠️ Hedera init failed: {str(e)}")
            self.client = None

    def _init_ai_models(self):
        """Initialize both image and video analysis models"""
        # Image analysis
        self.img_llm = ChatOpenAI(
            model="gpt-4-vision-preview",
            temperature=0.2,
            max_tokens=1000
        )
        
        # Video analysis (using OpenCV + custom models)
        self.accident_model = cv2.dnn.readNet(
            "models/accident_detection.pb", 
            "models/accident_detection.pbtxt"
        )
        self.tamper_model = cv2.dnn.readNet("models/forensics.pb")

    def process_media(
        self, 
        media_data: bytes, 
        media_type: str, 
        claim_details: str
    ) -> Dict:
        """Main processing pipeline for both images and videos"""
        try:
            # Store original media on Hedera
            file_id = self._store_on_hedera(media_data, media_type)
            
            if media_type.startswith("image"):
                analysis = self._analyze_image(media_data)
            elif media_type.startswith("video"):
                analysis = self._analyze_video(media_data)
            else:
                return {"error": "Unsupported media type"}
            
            # Generate fraud risk assessment
            risk_score = self._assess_risk(analysis, claim_details)
            
            # Log to HCS
            hcs_receipt = self._log_claim(
                file_id=file_id,
                media_type=media_type,
                risk_score=risk_score,
                analysis=analysis
            )
            
            return {
                "file_id": file_id,
                "hcs_receipt": hcs_receipt,
                "risk_score": risk_score,
                "analysis": analysis,
                "recommendation": "Approve" if risk_score < 0.5 else "Investigate"
            }
            
        except Exception as e:
            return {"error": str(e)}

    def _analyze_image(self, image_data: bytes) -> Dict:
        """Comprehensive image analysis"""
        img = Image.open(BytesIO(image_data))
        
        # Multi-hash approach
        hashes = {
            "ahash": str(imagehash.average_hash(img)),
            "phash": str(imagehash.phash(img)),
            "dhash": str(imagehash.dhash(img))
        }
        
        # AI analysis
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Analyze this insurance claim image for fraud indicators"),
            ("human", "Image hash: {hashes}\nMetadata: {metadata}")
        ])
        
        chain = prompt | self.img_llm
        response = chain.invoke({
            "hashes": str(hashes),
            "metadata": str(img.info)
        })
        
        return {
            "hashes": hashes,
            "metadata": img.info,
            "ai_analysis": response.content,
            "tamper_signals": self._check_image_tampering(img)
        }

    def _analyze_video(self, video_data: bytes) -> Dict:
        """Frame-by-frame video analysis"""
        # Save temp video
        temp_path = f"temp_{datetime.now().timestamp()}.mp4"
        with open(temp_path, "wb") as f:
            f.write(video_data)
            
        cap = cv2.VideoCapture(temp_path)
        frame_analyses = []
        accident_frames = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_analysis = {
                "accident_detected": self._detect_accident(frame),
                "tamper_signals": self._detect_video_tampering(frame),
                "frame_hash": self._frame_to_hash(frame)
            }
            
            if frame_analysis["accident_detected"]:
                accident_frames.append(frame_analysis)
                
            frame_analyses.append(frame_analysis)
        
        os.remove(temp_path)  # Clean up
        
        return {
            "total_frames": len(frame_analyses),
            "accident_frames": accident_frames,
            "tamper_warnings": sum(f["tamper_signals"] for f in frame_analyses),
            "key_frame_hashes": [f["frame_hash"] for f in accident_frames]
        }

    # ... [Additional helper methods] ...

    def _store_on_hedera(self, data: bytes, file_type: str) -> str:
        """Store media evidence on Hedera File Service"""
        tx = (FileCreateTransaction()
             .setContents(data)
             .setMaxTransactionFee(Hbar(2))
             .execute(self.client))
        return tx.getReceipt(self.client).fileId.toString()

    def _log_claim(self, **kwargs) -> str:
        """Log claim details to HCS"""
        message = f"CLAIM|{kwargs['file_id']}|RISK:{kwargs['risk_score']}"
        tx = (TopicMessageSubmitTransaction()
             .setTopicId(self.claims_topic_id)
             .setMessage(message)
             .execute(self.client))
        return tx.getReceipt(self.client).toString()

# Example usage:
if __name__ == "__main__":
    detector = MultiMediaFraudDetector()
    
    # Process image claim
    with open("claim_photo.jpg", "rb") as f:
        img_result = detector.process_media(
            f.read(), "image/jpeg", "Rear-end collision"
        )
    
    # Process video claim
    with open("dashcam.mp4", "rb") as f:
        video_result = detector.process_media(
            f.read(), "video/mp4", "Intersection accident"
        )
    
    print("Image Claim Result:", img_result)
    print("Video Claim Result:", video_result)
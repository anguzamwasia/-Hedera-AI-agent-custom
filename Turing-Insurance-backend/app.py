import os
from dotenv import load_dotenv
from typing import Optional, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from hedera import (
    Client,
    PrivateKey,
    AccountId,
    AccountBalanceQuery,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TransferTransaction,
    Hbar
)

class HederaInsuranceAgent:
    def __init__(self):
        # 1. Initialize environment and configurations
        load_dotenv()
        self._configure_openrouter()
        self.llm = self._initialize_llm()
        self.hedera_prompt = self._create_prompt_template()
        self.client = self._initialize_hedera_client()  # type: Optional[Any]
        self.insurance_topic_id = None  # type: Optional[str]

    def _configure_openrouter(self) -> None:
        """Configure OpenRouter settings"""
        os.environ["OPENROUTER_REFERRER"] = "https://github.com/anguzamwasia/hedera-ai-agent-workshop-langgraph"

    def _initialize_llm(self) -> ChatOpenAI:
        """Initialize the language model"""
        return ChatOpenAI(
            model=os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo"),
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            openai_api_base=os.getenv("OPENROUTER_BASE_URL"),
            temperature=0.7
        )

    def _create_prompt_template(self) -> ChatPromptTemplate:
        """Create the Hedera-specific prompt template"""
        return ChatPromptTemplate.from_messages([
            ("system", """You are a Hedera blockchain expert specializing in insurance applications.
             Key terms:
             - HCS = Hedera Consensus Service (secure messaging)
             - HBAR = Native cryptocurrency
             - Smart Contracts = Automated insurance policies
             - HIP = Hedera Improvement Proposal"""),
            ("human", "{question}")
        ])

    def _initialize_hedera_client(self) -> Optional[Any]:
        """Initialize and return Hedera client"""
        try:
            client = Client.forName(os.getenv("HEDERA_ACCOUNT_NETWORK", "testnet"))
            client.setOperator(
                AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID")),
                PrivateKey.fromString(os.getenv("HEDERA_ACCOUNT_PRIVATE_KEY"))
            )
            print("✅ Hedera client initialized successfully")
            return client
        except Exception as e:
            print(f"⚠️ Hedera initialization error: {str(e)}")
            return None

    def get_account_balance(self) -> Optional[str]:
        """Get current account balance as string"""
        if not self.client:
            return None
            
        try:
            account_id = AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID"))
            balance = AccountBalanceQuery().setAccountId(account_id).execute(self.client)
            return balance.hbars.toString()
        except Exception as e:
            print(f"⚠️ Balance check error: {str(e)}")
            return None

    def create_insurance_topic(self) -> Optional[str]:
        """Create a new HCS topic for insurance claims"""
        if not self.client:
            return None
            
        try:
            tx = TopicCreateTransaction().execute(self.client)
            receipt = tx.getReceipt(self.client)
            self.insurance_topic_id = receipt.topicId.toString()
            print(f"📌 Created HCS Topic for claims: {self.insurance_topic_id}")
            return self.insurance_topic_id
        except Exception as e:
            print(f"⚠️ Topic creation error: {str(e)}")
            return None

    def submit_claim_message(self, message: str) -> Optional[str]:
        """Submit a claim message to HCS topic"""
        if not self.client or not self.insurance_topic_id:
            return None
            
        try:
            tx = (TopicMessageSubmitTransaction()
                 .setTopicId(self.insurance_topic_id)
                 .setMessage(message)
                 .execute(self.client))
            receipt = tx.getReceipt(self.client)
            return str(receipt.topicSequenceNumber)
        except Exception as e:
            print(f"⚠️ Message submission error: {str(e)}")
            return None

    def process_insurance_claim(self, claim_details: str) -> str:
        """Full claim processing workflow"""
        try:
            # Step 1: AI analysis
            chain = self.hedera_prompt | self.llm
            response = chain.invoke({
                "question": f"Process this insurance claim: {claim_details}"
            })
            result = response.content
            
            # Step 2: Log to HCS
            if self.client:
                sequence_num = self.submit_claim_message(claim_details)
                if sequence_num:
                    result += f"\n\n📝 Claim logged to HCS (Sequence: {sequence_num})"
            
            # Step 3: Show balance
            balance = self.get_account_balance()
            if balance:
                result += f"\n💰 Current Balance: {balance} HBAR"
            
            return result
            
        except Exception as e:
            return f"❌ Claim processing failed: {str(e)}"

    def interactive_chat(self) -> None:
        """Run interactive chat interface"""
        print("\n" + "="*50)
        print("Hedera Insurance Agent - Interactive Mode")
        print("Type 'quit' to exit\n")
        
        while True:
            question = input("Ask about Hedera insurance (or 'quit'): ").strip()
            
            if not question:
                continue
                
            if question.lower() == 'quit':
                break
                
            response = self.process_insurance_claim(question)
            print(f"\n🔗 Response:\n{response}\n")

if __name__ == "__main__":
    agent = HederaInsuranceAgent()
    
    # Initialize HCS topic if needed
    if agent.client and not agent.insurance_topic_id:
        agent.create_insurance_topic()
    
    agent.interactive_chat()
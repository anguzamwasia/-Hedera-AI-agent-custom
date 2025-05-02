import { 
    Client, 
    AccountId, 
    PrivateKey, 
    TopicMessageSubmitTransaction, 
    TopicMessageQuery,
    TopicInfoQuery,
    TransactionReceiptQuery,
    TopicCreateTransaction,
    Hbar
  } from "@hashgraph/sdk";
  
  let client;
  
  try {
    client = Client.forName(import.meta.env.VITE_HEDERA_NETWORK || "testnet")
      .setOperator(
        AccountId.fromString(import.meta.env.VITE_OPERATOR_ID),
        PrivateKey.fromString(import.meta.env.VITE_OPERATOR_KEY)
      )
      .setDefaultMaxTransactionFee(new Hbar(2));
  } catch (err) {
    console.error("Hedera client initialization failed:", err);
    client = null;
  }
  
  export async function submitClaim(claimData) {
    if (!client) throw new Error("Hedera client not initialized");
  
    try {
      const tx = await new TopicMessageSubmitTransaction()
        .setTopicId(import.meta.env.VITE_HCS_TOPIC_ID)
        .setMessage(JSON.stringify({
          ...claimData,
          type: "INSURANCE_CLAIM",
          timestamp: new Date().toISOString(),
          status: "PENDING"
        }))
        .execute(client);
  
      const receipt = await tx.getReceipt(client);
      return {
        txId: tx.transactionId.toString(),
        status: receipt.status.toString()
      };
    } catch (error) {
      console.error("Claim submission failed:", error);
      throw new Error("Failed to submit claim to Hedera network");
    }
  }
  
  export function listenForClaims(callback) {
    if (!client) {
      console.error("Hedera client not initialized");
      return () => {};
    }
  
    try {
      const subscription = new TopicMessageQuery()
        .setTopicId(import.meta.env.VITE_HCS_TOPIC_ID)
        .subscribe(client, (message) => {
          try {
            const claimData = JSON.parse(message.contents.toString());
            if (claimData.type === "INSURANCE_CLAIM") {
              callback({
                ...claimData,
                txId: message.transactionId.toString(),
                consensusTimestamp: message.consensusTimestamp
              });
            }
          } catch (parseError) {
            console.error("Failed to parse HCS message:", parseError);
          }
        });
  
      return () => {
        try {
          subscription.unsubscribe();
        } catch (err) {
          console.error("Failed to unsubscribe:", err);
        }
      };
    } catch (err) {
      console.error("Failed to setup listener:", err);
      return () => {};
    }
  }
  
  export async function getClaimHistory() {
    if (!client) {
      console.error("Hedera client not initialized");
      return [];
    }
  
    try {
      const topicInfo = await new TopicInfoQuery()
        .setTopicId(import.meta.env.VITE_HCS_TOPIC_ID)
        .execute(client);
  
      const endSeq = topicInfo.sequenceNumber;
      const startSeq = Math.max(1, endSeq - 100);
  
      const messages = [];
      for (let seq = startSeq; seq <= endSeq; seq++) {
        try {
          const message = await new TopicMessageQuery()
            .setTopicId(import.meta.env.VITE_HCS_TOPIC_ID)
            .setSequenceNumber(seq)
            .execute(client);
  
          const parsed = JSON.parse(message.contents.toString());
          if (parsed.type === "INSURANCE_CLAIM") {
            messages.push({
              ...parsed,
              txId: message.transactionId.toString(),
              consensusTimestamp: message.consensusTimestamp
            });
          }
        } catch (e) {
          console.warn(`Failed to fetch message ${seq}:`, e);
        }
      }
  
      return messages.sort((a, b) => 
        new Date(b.consensusTimestamp) - new Date(a.consensusTimestamp)
      );
    } catch (error) {
      console.error("Failed to fetch claim history:", error);
      return [];
    }
  }
  
  export async function getClaimStatus(txId) {
    if (!client) throw new Error("Hedera client not initialized");
  
    try {
      const receipt = await new TransactionReceiptQuery()
        .setTransactionId(txId)
        .execute(client);
        
      return {
        status: receipt.status.toString(),
        consensusTimestamp: receipt.consensusTimestamp
      };
    } catch (error) {
      console.error("Failed to get claim status:", error);
      throw error;
    }
  }
  
  export async function initializeTopic() {
    if (!client) return null;
  
    try {
      await new TopicInfoQuery()
        .setTopicId(import.meta.env.VITE_HCS_TOPIC_ID)
        .execute(client);
      return import.meta.env.VITE_HCS_TOPIC_ID;
    } catch {
      try {
        const tx = await new TopicCreateTransaction()
          .setSubmitKey(PrivateKey.fromString(import.meta.env.VITE_OPERATOR_KEY))
          .execute(client);
          
        const receipt = await tx.getReceipt(client);
        return receipt.topicId.toString();
      } catch (err) {
        console.error("Failed to create topic:", err);
        return null;
      }
    }
  }
  
  // Initialize on load
  initializeTopic().catch(err => console.error("Topic init failed:", err));
import os
from hedera import (
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar
)

class ClaimProcessor:
    def __init__(self, client):
        self.client = client
        self.contract_id = os.getenv("CLAIM_PROCESSOR_CONTRACT_ID")

    def evaluate_claim(self, claim_id: str, risk_score: float) -> str:
        """Execute smart contract to process claim based on risk"""
        try:
            # Prepare contract parameters
            params = (ContractFunctionParameters()
                    .addString(claim_id)
                    .addFloat(risk_score))

            # Execute contract
            tx = (ContractExecuteTransaction()
                 .setContractId(self.contract_id)
                 .setGas(500_000)
                 .setFunction("processClaim", params)
                 .setMaxTransactionFee(Hbar(5))
                 .execute(self.client))

            # Get result
            receipt = tx.getReceipt(self.client)
            return receipt.contractExecuteResult.hex()
            
        except Exception as e:
            print(f"⚠️ Contract execution failed: {str(e)}")
            return None
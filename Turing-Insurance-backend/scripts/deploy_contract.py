import os
import json
from pathlib import Path
from dotenv import load_dotenv
from solcx import install_solc, compile_source
from hedera import (
    Client,
    PrivateKey,
    AccountId,
    ContractCreateTransaction,
    FileCreateTransaction,
    ContractFunctionParameters,
    Hbar,
    ReceiptStatusException
)

# Constants
CONTRACT_NAME = "ClaimProcessor"
SOLIDITY_VERSION = "0.8.0"
GAS_LIMIT = 2_000_000  # Increased gas limit for safety

def compile_contract() -> tuple:
    """Compile Solidity contract and return (bytecode, abi)"""
    try:
        install_solc(SOLIDITY_VERSION)
        contracts_dir = Path("contracts")
        contract_path = contracts_dir / f"{CONTRACT_NAME}.sol"
        
        with open(contract_path, "r") as f:
            source = f.read()
        
        compiled = compile_source(
            source,
            output_values=["abi", "bin"],
            solc_version=SOLIDITY_VERSION
        )
        
        contract_data = compiled[f"<stdin>:{CONTRACT_NAME}"]
        
        # Save compilation artifacts
        artifacts_dir = contracts_dir / "artifacts"
        artifacts_dir.mkdir(exist_ok=True)
        
        with open(artifacts_dir / f"{CONTRACT_NAME}.json", "w") as f:
            json.dump(contract_data, f)
        
        return (contract_data['bin'], contract_data['abi'])
    
    except Exception as e:
        print(f"🔴 Compilation failed: {str(e)}")
        raise

def deploy_contract() -> str:
    """Deploy contract to Hedera network"""
    try:
        load_dotenv()
        
        # Initialize client with explicit testnet mirror
        client = Client.forTestnet()
        client.setMirrorNetwork("testnet.mirrornode.hedera.com:5600")
        client.setOperator(
            AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID")),
            PrivateKey.fromString(os.getenv("HEDERA_PRIVATE_KEY"))
        )

        print("🔄 Compiling contract...")
        bytecode, abi = compile_contract()
        
        print("📤 Uploading bytecode...")
        file_tx = (FileCreateTransaction()
                  .setContents(bytes.fromhex(bytecode))
                  .setMaxTransactionFee(Hbar(5))  # Increased fee for reliability
                  .execute(client))
        
        file_id = file_tx.getReceipt(client).fileId
        print(f"📦 Bytecode stored (File ID: {file_id})")

        print("🚀 Deploying contract...")
        contract_tx = (ContractCreateTransaction()
                      .setBytecodeFile(file_id)
                      .setGas(GAS_LIMIT)
                      .setConstructorParameters(
                          ContractFunctionParameters()
                          # Add parameters here if your constructor requires them
                          # .addString("param1")
                      )
                      .setMaxTransactionFee(Hbar(10))
                      .execute(client))
        
        contract_id = contract_tx.getReceipt(client).contractId
        print(f"✅ Contract deployed (Contract ID: {contract_id})")
        
        # Save deployment artifacts
        deployment_info = {
            "contract_id": str(contract_id),
            "file_id": str(file_id),
            "abi": abi,
            "solidity_version": SOLIDITY_VERSION
        }
        
        artifacts_dir = Path("contracts") / "artifacts"
        with open(artifacts_dir / "deployment.json", "w") as f:
            json.dump(deployment_info, f, indent=2)
        
        return str(contract_id)
    
    except ReceiptStatusException as rse:
        print(f"🔴 Transaction failed with status: {rse.receipt.status}")
        raise
    except Exception as e:
        print(f"🔴 Deployment failed: {str(e)}")
        raise

def update_env(contract_id: str) -> None:
    """Update .env file with contract ID"""
    env_path = Path(".env")
    env_lines = []
    
    if env_path.exists():
        with open(env_path, "r") as f:
            env_lines = f.readlines()
    
    # Remove old contract ID if exists
    env_lines = [line for line in env_lines 
                if not line.startswith("CLAIM_PROCESSOR_CONTRACT_ID=")]
    
    # Add new contract ID
    env_lines.append(f"\nCLAIM_PROCESSOR_CONTRACT_ID={contract_id}\n")
    
    with open(env_path, "w") as f:
        f.writelines(env_lines)
    print(f"🔄 Updated .env with new contract ID")

if __name__ == "__main__":
    try:
        print("🏗 Starting contract deployment...")
        contract_id = deploy_contract()
        update_env(contract_id)
        print("🎉 Deployment completed successfully!")
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        exit(1)
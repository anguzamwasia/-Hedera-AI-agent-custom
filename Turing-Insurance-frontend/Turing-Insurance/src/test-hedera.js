import { Client, AccountId } from "@hashgraph/sdk";

const client = Client.forTestnet();
console.log("Hedera SDK working! Latest mirror:", client.mirrorNetwork[0]);
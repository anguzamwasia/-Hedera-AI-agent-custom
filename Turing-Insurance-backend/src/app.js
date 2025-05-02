// src/app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createInstance } from '../api/hedera-client.js';
import { AccountBalanceQuery } from '@hashgraph/sdk';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Hedera Client Endpoint
app.get('/api/hedera/client', (req, res) => {
  try {
    const client = createInstance();
    res.json({
      network: process.env.HEDERA_ACCOUNT_NETWORK,
      accountId: process.env.HEDERA_ACCOUNT_ID,
      keyType: process.env.HEDERA_ACCOUNT_PRIVATE_KEY_TYPE
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
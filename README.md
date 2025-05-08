# 💼 Turing Insurance – AI-Powered Decentralized Insurance System

**Turing Insurance** is a decentralized insurance claim processing system built on the **Hedera Hashgraph** network. It combines **Hedera Consensus Service (HCS)** for tamper-proof messaging and **AI Agents powered by LangGraph** and **Hedera AgentKit** for intelligent claim evaluation and interaction.

> 🔗 Frontend page: [https://turing-insurance.vercel.app](https://turing-insurance.vercel.app)
---
> YouTube Video
(https://youtu.be/hVV4W_6pjJA)
---

## 🚀 Features

- 🧠 **AI-driven claim evaluation** using OpenAI LLMs via LangGraph
- 🔗 **Immutable claim messaging** via Hedera Consensus Service (HCS)
- 📤 Submit, track, and manage insurance claims in real-time
- 🛡️ Trustless verification of claims through Hedera network
- 🔒 Transparent, auditable communication logs
- ⚡ Fast backend powered by Flask + WebSockets
- 🌐 Modern, responsive frontend

---

## 🧠 Hedera AI Agent & HCS Integration

### 🤖 **Hedera AI Agent (LangGraph + AgentKit)**

- Built using [LangGraph](https://github.com/langchain-ai/langgraph) to define the flow of AI-based decision-making.
- Uses [Hedera AgentKit](https://github.com/hashgraph/agentkit-js) to securely interact with Hedera network services.
- Evaluates claim type, validity, and response logic using LLMs (e.g., GPT-4).

### 🟣 **Hedera Consensus Service (HCS)**

- Logs every submitted claim message immutably using `TopicMessageSubmitTransaction()`.
- Enables real-time, tamper-proof broadcasting and tracking of claim activity.
- Ensures compliance and traceability in insurance workflows.

---

## 📁 Project Structure

```
hedera-ai-agent-workshop-langgraph/
├── frontend/                    # React + Tailwind frontend
│   ├── public/                  # Static assets
│   └── src/                     # Components & logic
├── backend/                     # Flask backend
│   ├── app.py                   # Core API routes & agent
│   ├── agent/                   # LangGraph agent logic
│   └── hedera/                  # HCS + Hedera client setup
├── .env                         # Environment variables
├── requirements.txt             # Python dependencies
├── README.md
```

---

## 🛠️ Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Frontend     | React.js, Tailwind CSS                       |
| Backend      | Python Flask, Flask-Sock, LangGraph          |
| AI Logic     | LangGraph, OpenAI (GPT-4), AgentKit (JS)     |
| Blockchain   | Hedera Hashgraph, Hedera Consensus Service   |
| Messaging    | HCS (`TopicMessageSubmitTransaction`)        |
| WebSockets   | Flask-Sock                                   |
| Hosting      | Vercel (frontend), local server (backend)    |

---

## ⚙️ Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Hedera Testnet Account
- `.env` file with the following:

```env
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...
HEDERA_TOPIC_ID=0.0.xxxxx
OPENAI_API_KEY=sk-...
```

---

## 🧪 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/anguzamwasia/-Hedera-AI-agent-custom.git
cd hedera-ai-agent-workshop-langgraph
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Visit the frontend at `http://localhost:3000`

---

### 3️⃣ Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
python app.py
```

> Backend runs at `http://localhost:5000` with WebSocket connection enabled.

---

## 🔗 Hedera Smart Messaging (HCS)

We use **Hedera Consensus Service** to broadcast all insurance claim messages for transparency.

```python
TopicMessageSubmitTransaction()  
    .setTopicId(TOPIC_ID)  
    .setMessage(json.dumps(claim_data))  
    .execute(client)
```

- Each claim is logged immutably.
- HCS provides proof of submission and claim timestamping.

---

## 🤖 AI Agent Workflow (LangGraph + AgentKit)

- The agent is defined as a LangGraph workflow.
- It processes user-submitted claims through a logic chain: parsing → classification → evaluation → HCS submission.
- Responses are handled via WebSocket and shown in the UI.

Example agent node:

```python
def classify_claim(input):
    if "flood" in input.lower():
        return "FloodDamage"
    return "General"
```

---

## 🧵 WebSocket Real-Time Flow

- Frontend sends messages via WebSocket to Flask-Sock backend.
- Backend uses the LangGraph agent to interpret and respond.
- Responses are pushed back to the frontend and logged on HCS.

---

## 📡 API Overview

| Method | Endpoint      | Description                   |
|--------|---------------|-------------------------------|
| POST   | `/ws` (socket)| WebSocket channel for messages|
| POST   | `/claim`      | Fallback REST claim submission|

---

## 🧪 Testing

- Use `frontend/src/components/Chat.jsx` to simulate real-time agent conversation.
- Test HCS output using [Hedera Explorer](https://hashscan.io/testnet)
- Simulate different claim types (fire, flood, theft) to trigger AI logic.

---

## 📜 License

MIT License 

---

## 👥 Authors

- **Cynthia Anguza** – [GitHub](https://github.com/anguzamwasia) | [LinkedIn](https://www.linkedin.com/in/cynthia-anguza-0631a4272)
- **Deon Orina** – [GitHub](https://github.com/Deon62)

---

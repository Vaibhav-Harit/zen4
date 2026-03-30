# ⚡ snap.it - The Neural Memory Debugger

> **The AI-Powered Debugger for Elite Developers.**

---

## 🚨 The Problem
**Debugging is fragmented.** Developers lose hours tracing errors across multiple repos and sessions. Digging through disconnected log files and recreating exact execution states is a slow, painful loop that kills productivity.

## 🧠 The RAG Solution
**Snap.it uses Retrieval-Augmented Generation (RAG)** to index your code history and provide instant, neural-powered fixes. It understands the full context of your codebase to replace endless searching with highly targeted, directly actionable code patches derived from your project's DNA.

---

## ✨ Key Features

- **👁️ Gemini 1.5 Pro OCR:** Snap an error screenshot and instantly extract perfectly structured contextual logs via advanced Vision AI.
- **🌲 Pinecone Vector Namespaces:** High-performance, low-latency semantic indexing separated powerfully by distinct user/project boundaries to ensure precise and private resolutions.
- **💻 Real-time Terminal Output:** A bespoke, cinematic VS-Code styled terminal that visually streams fixes block-by-block with full syntax highlighting.
- **🚀 Automated GitHub PRs:** Fix a bug? Push it live instantly. Open automated Pull Requests straight to your linked repository with zero friction.

---

## 🛠️ How to Run Locally

Start your entire stack (Frontend Vite Server, Django Backend API, and Postgres Database) smoothly via Docker:

```bash
# Spin up and build the containers
docker-compose up --build -d

# Apply database migrations to the backend Django API
docker-compose exec backend python manage.py migrate
```

***

*Built with ❤️ for developers who hate bugs.*
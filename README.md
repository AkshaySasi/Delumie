# Delumie

<div align="center">
  <img src="public/logo.png" alt="Delumie Logo" width="120" height="auto" />
  <h1>Delumie</h1>
  <p><strong>Your personal healthcare companion. Private. Local. Offline.</strong></p>
  
  <a href="https://www.rust-lang.org/">
    <img src="https://img.shields.io/badge/Made%20with-Rust-orange?style=flat-square&logo=rust" alt="Rust" />
  </a>
  <a href="https://tauri.app/">
    <img src="https://img.shields.io/badge/Built%20on-Tauri-blue?style=flat-square&logo=tauri" alt="Tauri" />
  </a>
  <a href="https://ollama.com/">
    <img src="https://img.shields.io/badge/AI%20Engine-Ollama-white?style=flat-square&logo=ollama" alt="Ollama" />
  </a>
</div>

<br />

## 🌟 Overview

Delumie is a **local-first AI healthcare companion** designed to give you personalized health insights without compromises. Unlike cloud-based AIs that harvest your data, Delumie runs entirely on your device, ensuring your sensitive medical records and health metrics remain 100% private.

This repository hosts the web presence for the Delumie project.

## 🏗️ Under the Hood

Delumie is engineered for privacy, performance, and security using a modern native stack:

### ⚡ Core Architecture
- **Rust Backend**: The heart of Delumie is built with **Rust**, providing memory safety, blazing-fast performance, and secure system access.
- **Tauri Framework**: We use **Tauri v2** to deliver a tiny application footprint (setup <15MB) while maintaining native system capabilities.

### 🧠 Local Intelligence
- **Ollama Integration**: Delumie orchestrates local Large Language Models (LLMs) like `Llama 3` and `Phi-3` via **Ollama**, allowing for powerful inference without an internet connection.
- **RAG Engine**: A custom **Retrieval-Augmented Generation (RAG)** system built in Rust indexes your health data locally.
- **Vector Database**: High-performance local vector storage enables the AI to "remember" and recall your specific health context instantly.

### � Privacy by Design
- **Offline-First**: No internet required for core functionality.
- **Local Storage**: All chats, documents, and embeddings live on your SSD, encrypted and under your control.
- **No Telemetry**: We don't track your queries or health data.

## ✨ Key Capabilities

- **Medical Record Analysis**: Upload PDFs/images of lab reports; Delumie parses and indexes them locally.
- **Personalized Advice**: Recommendations based on *your* specific biology and history, not generic web searches.
- **Diet & Allergy Checks**: Instant feedback on foods based on your stored allergy profile.
- **Health Trending**: Visualizes trends in your vitals over time to detect anomalies.

## � Getting Started

Delumie is currently in **Beta (v0.1.0)** for Windows.

1.  **Download**: Get the latest installer from our [website](https://delumie.com/download).
2.  **Install**: Run the setup (requires minimal RAM/Disk).
3.  **Chat**: Start asking questions about your health immediately.

## 🤝 Contributing

Delumie is open source and community-driven. We believe healthcare tools should be transparent.

- **Core App**: Built in Rust & Tauri.
- **Frontend**: Built in Next.js & Tailwind (this repository).

We welcome contributions to both the core application and the web platform!

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  <p><strong>Your Health. Your Data. Your Delumie.</strong></p>
</div>

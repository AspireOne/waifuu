## Waifuu

https://github.com/user-attachments/assets/3a8ec4f3-533c-4d39-9996-3736504f3f2b


## Introduction

This project is a web and mobile application allowing users to chat with AI-powered fictional characters. Users can create their own characters, browse and interact with characters created by others, add friends, and participate in a public chat.

Built with modern web technologies, the application aims to provide an engaging and interactive experience with AI, encouraging creativity and social connection within a community.

## Features

Explore the key functionalities offered by the application:

*   **AI Character Chat:** Interact with diverse AI characters powered by large language models (LLMs).
*   **Character Creation:** Design and create your own AI characters with custom personalities and backgrounds.
*   **Community Characters Discovery:** Browse a public feed of characters created by other users. Filter characters by text, tags (like "anime", "books"), and NSFW status. Supports pagination for lazy loading.
*   **Roleplay Roulette (Random 1-to-1 Chat):** Get matched with another user for a spontaneous, themed private chat session. Easily view profiles and add friends from within the chat.
*   **Friend Management:** Build your network by adding and managing friends within the application.
*   **Public Group Chat:** Join a real-time public chat room to communicate with other users.
*   **Public User Profiles:** Share and view public profiles, showcasing user information and their public characters.
*   **Character Statistics:** View basic stats for public characters including views, likes, and dislikes.
*   **Chat Message Sharing:** Select and share specific chat messages from your conversations with characters.

## Technology Stack

The application is built using a robust and modern technology stack:

*   **Frontend:**
    *   React & Next.js
    *   NextUI (UI Components)
    *   Zustand (State Management)
    *   React-hook-form & Zod (Forms & Validation)
    *   React-Query (Data Fetching)
    *   Tailwind CSS (Styling)
    *   Lingui & Crowdin (Internationalization)
*   **Backend & API:**
    *   Next.js (Node.js)
    *   tRPC (Typesafe APIs)
    *   Soketi (Self-hosted WebSocket server)
*   **Databases:**
    *   PostgreSQL
    *   Prisma ORM
    *   Milvus (Vector Database for RAG/LLM Context)
*   **AI / LLM:** Integration with Large Language Models, using techniques like Retrieval Augmented Generation (RAG) via a Vector DB to enhance context handling.
*   **Infrastructure & Deployment:**
    *   Contabo / Coolify (Self-hosting & Deployment)
    *   Capacitor (Web-to-Native Mobile Packaging)
    *   Minio (S3-compatible Object Storage)
    *   CI/CD (Pre-commit hooks, Coolify)
*   **Services:**
    *   Firebase Authentication
    *   Stripe (Payments/Subscriptions)
    *   MXRoute (Email)
    *   Langfuse (LLM Logging/Monitoring)
    *   Sentry (Application Monitoring)

## Technical Architecture

The application follows a standard client-server architecture. The Next.js frontend interacts with the Next.js/Node.js backend via tRPC for most data operations. Real-time features leverage a self-hosted Soketi WebSocket server.

Data is primarily stored in PostgreSQL using Prisma ORM. A Milvus vector database is integrated specifically to manage conversation context for the AI models, enabling RAG to improve response quality by providing relevant historical data.

Authentication is handled by Firebase, payments by Stripe, and file storage by Minio. Monitoring tools provide insights into application performance and LLM interactions. The Capacitor framework is used to wrap the web application into native iOS and Android apps.

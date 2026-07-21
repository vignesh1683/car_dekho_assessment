# AutoMatch AI Car Advisor

An AI-native car recommendation platform built as a private personal project. It takes natural language queries like "I need a family SUV under 15 lakhs with good safety" and returns a curated shortlist.

## 🚀 Quick Start (Docker)

The easiest way to run the full stack:

```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs (Swagger UI)

*Note: You must have `GROQ_API_KEY` set in your environment or in a `.env` file in the `backend` directory.*

## 💻 Manual Setup

### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Set your GROQ_API_KEY environment variable
uvicorn main:app --reload
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 🌟 Features

- **AI Intent Extraction**: Uses Groq (Llama 3) to convert natural language queries into structured search filters.
- **Conversational Discovery**: Enables users to search for cars using intuitive phrases (e.g., "a safe SUV for bad roads") without needing to specify technical parameters.
- **Modern UI/UX**: Built with a clean, responsive dark-mode glassmorphism aesthetic for an engaging user experience.
- **High-Performance Backend**: Asynchronous API powered by FastAPI for rapid AI inference and filtering.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, React
- **Backend**: FastAPI (Python), Uvicorn
- **AI/LLM**: Groq API (`llama-3.3-70b-versatile`) for ultra-fast inference and reliable JSON extraction
- **Data**: Flat-file JSON database for lightweight, rapid prototyping

## 📂 Project Structure

```text
.
├── backend/
│   ├── main.py        # FastAPI application entry point
│   ├── routers/       # API route definitions (chat, cars)
│   ├── services/      # Business logic (Groq AI integration, filtering)
│   └── data/          # JSON data files (cars.json)
├── frontend/
│   ├── app/           # Next.js 14 App Router (pages, layout)
│   ├── components/    # Reusable React components
│   └── public/        # Static assets
└── docker-compose.yml # Docker configuration for full-stack deployment
```

## 🔑 Environment Variables

To run the backend, you need to set up the following environment variable in the `backend/` directory (e.g. in a `.env` file):

- `GROQ_API_KEY`: Your API key for Groq (Llama 3 inference). Get it for free at [groq.com](https://groq.com/).

## 📡 Key API Endpoints

- `POST /api/chat`: Takes a user's natural language query, extracts filters via LLM, and returns matched cars.
- `POST /api/compare`: Takes a list of car IDs and a user query, generating an AI-driven comparison summary.
- `GET /api/cars`: Retrieves a list of cars based on structured filter parameters.
- `GET /api/cars/{car_id}`: Retrieves details for a specific car.

## 🗺️ Roadmap

- **Follow-up Chat**: Enable iterative refinement of filters by allowing users to reply to the AI.
- **Database Migration**: Transition from a static JSON file to PostgreSQL with pgvector for semantic search on car descriptions.
- **User Accounts**: Integrate authentication for saved shortlists and search history.

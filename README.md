# CarDekho AI Car Advisor

An AI-native car recommendation platform built for the CarDekho take-home assignment. It takes natural language queries like "I need a family SUV under 15 lakhs with good safety" and returns a curated shortlist.

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

## 📝 Assignment Deliverables

### What did you build and why? What did you deliberately cut?
I built a conversational car discovery tool. Buyers don't know the exact filters they need (e.g. "ground clearance > 200mm"), they just know they want "a safe SUV for bad roads". 
- **Built**: AI intent extraction using Groq (Llama 3), structured filtering, and a clean, responsive UI with a dark-mode glassmorphism aesthetic. A flat-file `cars.json` acts as the DB.
- **Cut**: User authentication, real-time price APIs, deep car comparison drawers, and complex state management, as they don't directly prove the core "AI filtering" thesis and would bloat the 2-3 hr time limit.

### What's your tech stack and why did you pick it?
- **Frontend**: Next.js 14 + Tailwind CSS. Fast to build, server-components ready, and Tailwind is perfect for rapid prototyping beautiful UIs.
- **Backend**: FastAPI (Python). It is asynchronous, highly performant, auto-generates Swagger docs, and Python is the best ecosystem for AI/LLM SDKs.
- **AI**: Groq (`llama-3.3-70b-versatile`). Picked for its completely free tier, incredibly fast inference speed, and native JSON-mode support for reliable filter extraction.

### What did you delegate to AI tools vs. do manually? 
- **Delegated**: Boilerplate scaffolding, Pydantic schema generation, dummy data creation for `cars.json`, and Tailwind layout styling.
- **Manual**: Designing the system architecture, tuning the Groq system prompt for reliable JSON extraction, and deciding on the product scope cuts. AI tools struggled slightly with context window limits when building the entire project at once, so I had to break it down.

### If you had another 4 hours, what would you add?
1. **Follow-up Chat**: Allow the user to reply to the AI ("Actually, make it an automatic") to iteratively refine the filters.
2. **Real Postgres DB**: Move away from `cars.json` to Prisma + Postgres with pgvector for semantic search on car descriptions, rather than just hard-filtering on extracted JSON.
3. **User Auth & Saved Shortlists**: Integrate NextAuth to allow users to create accounts, save their favorite car recommendations, and view their past search history.

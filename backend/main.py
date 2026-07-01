from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cars, chat

app = FastAPI(title="CarDekho AI Advisor API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://car-dekho-assessment-4ftx.vercel.app", "https://car-dekho-assessment-ten.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cars.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "Welcome to the CarDekho AI Advisor API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

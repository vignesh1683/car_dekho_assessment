import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "dummy_key"))

SYSTEM_PROMPT = """
You are an expert car buying assistant for the Indian market.
Your goal is to understand the user's requirements and extract structured filters to find matching cars.
Always respond with a JSON object containing two keys:
1. "reply": A friendly, helpful, and concise message in plain language addressing the user.
2. "filters": A JSON object with the extracted filters. Possible keys include:
   - max_price_lakh (number)
   - min_price_lakh (number)
   - fuel_type (string, e.g., "Petrol", "Diesel", "Electric", "CNG")
   - body_type (string, e.g., "Hatchback", "Sedan", "SUV", "MUV")
   - transmission (string, e.g., "Manual", "Automatic")
   - seating_capacity_min (number)
   - use_case (string, e.g., "Family", "City", "Highway", "Off-road")
   - make (string, e.g., "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Kia", "Toyota", "Honda", "Volkswagen", "Skoda", "MG")

If a filter is not mentioned, omit it from the "filters" object. Use Indian Rupee (₹) in your reply.
"""

def extract_intent_and_reply(user_message: str, history: list = None) -> dict:
    if history is None:
        history = []
        
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return {
            "reply": "I'm having trouble connecting right now. Let me show you some popular options instead.",
            "filters": {}
        }

def generate_compare_summary(selected_cars: list, user_query: str = None) -> dict:
    if not selected_cars:
        return {"overall_summary": "", "individual_summaries": {}, "ranked_car_ids": []}
        
    cars_data = [{"id": car.id, "make": car.make, "model": car.model, "price_lakh": car.price_lakh, "pros": car.pros, "cons": car.cons} for car in selected_cars]
    
    query_context = f"The user originally asked for: '{user_query}'. Tailor your comparison to address their specific needs." if user_query else "Tailor your comparison to address practical difficulties, running costs, maintenance, and which user profile fits which car best."
    
    prompt = f"""
You are an expert car reviewer for the Indian market.
The user wants to compare these {len(selected_cars)} cars:
{json.dumps(cars_data, indent=2)}

{query_context}

Please provide a JSON object with three keys:
1. "overall_summary": A detailed paragraph comparing these cars against each other based on the context above.
2. "individual_summaries": A dictionary where keys are the car IDs, and values are short, 1-2 sentence summaries explaining EXACTLY WHY this car is ranked where it is, based on the user's query.
3. "ranked_car_ids": A list of the car IDs ordered from most favorable (best match for the user) to least favorable.

Always respond with valid JSON.
"""
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        print(f"Error generating compare summary: {e}")
        return {"overall_summary": "", "individual_summaries": {}, "ranked_car_ids": [car.id for car in selected_cars]}

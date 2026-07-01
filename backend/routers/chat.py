from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse, FilterParams, CompareRequest, CompareResponse
from services import ai_service, car_service

router = APIRouter(prefix="/api", tags=["api"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest):
    # Call Groq to extract intent
    ai_result = ai_service.extract_intent_and_reply(request.message, request.conversation_history)
    
    # Parse filters
    filters_dict = ai_result.get("filters", {})
    filters = FilterParams(**filters_dict)
    
    # Get matched cars based on extracted filters
    matched_cars = car_service.filter_cars(filters)
    
    return ChatResponse(
        reply=ai_result.get("reply", "Here are some cars that match your request."),
        filters=filters,
        matched_cars=matched_cars,
        car_summaries=None,
        top_3_comparison=None
    )

@router.post("/compare", response_model=CompareResponse)
def compare_cars(request: CompareRequest):
    # Fetch cars by IDs
    all_cars = car_service.get_all_cars()
    selected_cars = [car for car in all_cars if car.id in request.car_ids]
    
    # Generate compare summary
    compare_data = ai_service.generate_compare_summary(selected_cars, request.user_query)
    
    return CompareResponse(
        overall_summary=compare_data.get("overall_summary", ""),
        individual_summaries=compare_data.get("individual_summaries", {}),
        ranked_car_ids=compare_data.get("ranked_car_ids", [car.id for car in selected_cars])
    )

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.schemas import Car, FilterParams, CompareRequest
from services import car_service

router = APIRouter(prefix="/api/cars", tags=["cars"])

@router.get("", response_model=List[Car])
def get_cars(
    max_price_lakh: Optional[float] = None,
    min_price_lakh: Optional[float] = None,
    fuel_type: Optional[str] = None,
    body_type: Optional[str] = None,
    transmission: Optional[str] = None,
    seating_capacity_min: Optional[int] = None,
    use_case: Optional[str] = None
):
    filters = FilterParams(
        max_price_lakh=max_price_lakh,
        min_price_lakh=min_price_lakh,
        fuel_type=fuel_type,
        body_type=body_type,
        transmission=transmission,
        seating_capacity_min=seating_capacity_min,
        use_case=use_case
    )
    return car_service.filter_cars(filters)

@router.get("/{car_id}", response_model=Car)
def get_car(car_id: str):
    car = car_service.get_car_by_id(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post("/compare", response_model=List[Car])
def compare_cars(request: CompareRequest):
    cars = []
    for car_id in request.car_ids:
        car = car_service.get_car_by_id(car_id)
        if car:
            cars.append(car)
    return cars

from fastapi import APIRouter
from app.services.lp_delta import calculate_delta

router = APIRouter()


@router.post("/update_delta")
async def run_tasks():
    calculate_delta()
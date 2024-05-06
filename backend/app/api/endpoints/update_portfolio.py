from fastapi import APIRouter
from app.services.portfolio_history import update_portfolio_history

router = APIRouter()


@router.post("/update_portfolio")
async def run_tasks():
    update_portfolio_history()

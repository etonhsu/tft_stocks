from fastapi import APIRouter

from app.services.lp_delta import calculate_delta
from app.services.portfolio_history import update_portfolio_history
from app.services.rank_update import rank_update
from app.services.riot_api import riot_api

router = APIRouter()


@router.post("/run_tasks")
async def run_tasks():
    calculate_delta()
    update_portfolio_history()
    rank_update()
    riot_api()
    return {"message": "Tasks completed successfully"}
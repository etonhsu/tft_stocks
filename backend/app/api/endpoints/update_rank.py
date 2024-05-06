from fastapi import APIRouter
from app.services.rank_update import rank_update

router = APIRouter()


@router.post("/update_rank")
async def run_tasks():
    rank_update()
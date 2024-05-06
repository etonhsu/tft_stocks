from fastapi import APIRouter
from app.services.riot_api import riot_api

router = APIRouter()


@router.post("/update_riot_api")
async def run_tasks():
    riot_api()
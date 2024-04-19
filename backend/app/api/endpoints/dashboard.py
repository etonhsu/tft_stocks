from fastapi import APIRouter, Depends, HTTPException, Request
from app.models.models import DashboardData, LeaderboardEntry, Transaction, DashboardUserSummary
import app.core.session_backend
from app.core.logic import fetch_leaderboard_entries, fetch_recent_transactions

router = APIRouter()



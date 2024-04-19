from pydantic import BaseModel, SecretStr
from typing import List, Optional, Dict
from datetime import datetime


class TokenData(BaseModel):
    username: Optional[str] = None


class BasePlayer(BaseModel):
    name: str
    price: int


class Player(BasePlayer):
    shares: int

    def total(self) -> int:
        return self.shares * self.price


class Portfolio(BaseModel):
    players: dict[str, Player] = {}

    def total(self) -> int:
        return sum(p.total() for p in self.players.values())


class Transaction(BaseModel):
    type: str # buy or sell
    gameName: str
    shares: int
    price: int
    transaction_date: datetime


class TransactionRequest(BaseModel):
    shares: int


class UserPublic(BaseModel):
    username: str
    portfolio: Portfolio = Portfolio()
    transactions: List[Transaction] = []


class UserProfile(UserPublic):
    balance: float = 100_000.0


class UserSelf(UserProfile):
    password: Optional[SecretStr] = None


class LeaderboardEntry(BaseModel):
    gameName: str
    value: float  # This could be LP, delta, or total portfolio value
    rank: int


class LeaderboardResponse(BaseModel):
    leaderboard_type: str  # LP, delta, portfolio
    entries: list[LeaderboardEntry]


class DashboardUserSummary(BaseModel):
    username: str
    balance: float


class DashboardData(BaseModel):
    user_summary: DashboardUserSummary
    top_leaderboard_entries: List[LeaderboardEntry]
    recent_transactions: List[Transaction]


class SessionData(BaseModel):
    username: str














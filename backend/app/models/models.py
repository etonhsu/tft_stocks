from pydantic import BaseModel, SecretStr
from typing import List, Optional
from datetime import datetime


class TokenData(BaseModel):
    username: Optional[str] = None


class BasePlayer(BaseModel):
    name: str
    current_price: float


class Player(BasePlayer):
    purchase_price: float
    shares: int

    def total(self) -> int:
        return self.shares * self.price


class Portfolio(BaseModel):
    players: dict[str, Player] = {}


class PortfolioHistory(BaseModel):
    value: float
    date: datetime


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
    one_day_change: float = 0.0
    three_day_change: float = 0.0


class UserProfile(UserPublic):
    balance: float = 100_000.0
    portfolio_history: List[PortfolioHistory]


class UserSelf(UserProfile):
    password: Optional[SecretStr] = None


class LeaderboardEntry(BaseModel):
    gameName: str
    lp: float  # League points
    delta_8h: float  # Change in 8 hours
    delta_24h: float  # Change in 24 hours
    delta_72h: float  # Change in 72 hours
    rank: int


class LeaderboardResponse(BaseModel):
    leaderboard_type: str  # LP, delta, portfolio
    entries: list[LeaderboardEntry]


class TopLeaderboardEntry(BaseModel):
    name: str
    value: float


class TopLeaderboard(BaseModel):
    price: TopLeaderboardEntry
    delta_8h: TopLeaderboardEntry
    delta_24h: TopLeaderboardEntry
    delta_72h: TopLeaderboardEntry
    portfolio_value: TopLeaderboardEntry


class SessionData(BaseModel):
    username: str














from pydantic import BaseModel, SecretStr, Field
from typing import List, Optional
from datetime import datetime


class TokenData(BaseModel):
    username: Optional[str]


class BasePlayer(BaseModel):
    name: str
    tagLine: Optional[str] = None
    current_price: float


class Player(BasePlayer):
    purchase_price: float
    shares: int

    def total(self) -> int:
        return self.shares * self.price


class Holds(BaseModel):
    gameName: str
    shares: int
    hold_deadline: datetime


class Portfolio(BaseModel):
    players: dict[str, Player] = {}
    holds: List[Holds] = []


class PortfolioHistory(BaseModel):
    value: float
    date: datetime


class Transaction(BaseModel):
    type: str  # 'buy' or 'sell'
    gameName: str
    shares: int
    price: float
    transaction_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



class TransactionRequest(BaseModel):
    shares: int


class FavoritesEntry(BaseModel):
    name: str
    current_price: float
    eight_hour_change: float = 0.0
    one_day_change: float = 0.0
    three_day_change: float = 0.0


class FavoritesResponse(BaseModel):
    favorites: List[FavoritesEntry]


class UserPublic(BaseModel):
    username: str
    portfolio: Portfolio = Portfolio()
    transactions: List[Transaction] = []
    one_day_change: float = 0.0
    three_day_change: float = 0.0
    rank: int = None
    portfolio_history: List[PortfolioHistory]


class UserProfile(UserPublic):
    balance: float = 100_000.0
    favorites: List[FavoritesEntry] = []
    date_registered: datetime


class UserSelf(UserProfile):
    password: Optional[SecretStr] = None


class ToggleFavoriteRequest(BaseModel):
    gameName: str  # Ensuring the request model matches the expected input


class LeaderboardEntry(BaseModel):
    gameName: str
    lp: float  # League points
    delta_8h: float  # Change in 8 hours
    delta_24h: float  # Change in 24 hours
    delta_72h: float  # Change in 72 hours
    rank: int


class PortfolioLeaderboardEntry(BaseModel):
    username: str
    value: float
    rank: int


class LeaderboardResponse(BaseModel):
    leaderboard_type: str  # LP, delta, portfolio
    entries: List[LeaderboardEntry]


class PortfolioLeaderboardResponse(BaseModel):
    leaderboard_type: str
    entries: List[PortfolioLeaderboardEntry]


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


class UsernameChangeRequest(BaseModel):
    newUsername: str


class PasswordUpdateModel(BaseModel):
    oldPassword: str
    newPassword: str














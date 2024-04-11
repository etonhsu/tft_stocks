from pydantic import BaseModel, SecretStr
from typing import List, Optional, Dict
from datetime import datetime


class BasePlayer(BaseModel):
    name: str
    price: int


class Player(BasePlayer):
    shares: int

    def total(self) -> int:
        return self.shares * self.price


class Portfolio(BaseModel):
    players: Dict[str, Player] = {}

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


class UserSelf(UserPublic):
    password: Optional[SecretStr] = None
    balance: float = 0.0







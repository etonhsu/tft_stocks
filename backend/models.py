from pydantic import BaseModel


class PlayerListing(BaseModel):
    name: str
    price: int


class Player(BaseModel):
    name: str
    price: int
    shares: int


class Portfolio(BaseModel):
    username: str
    player: Player
    total: int




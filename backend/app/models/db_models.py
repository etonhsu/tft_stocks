from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class SummonerConversion(Base):
    __tablename__ = "summoner_conversion"
    id = Column(Integer, primary_key=True, index=True)
    game_name = Column(String, index=True)
    puuid = Column(String, index=True)
    summoner_id = Column(String, index=True)

class PlayerData(Base):
    __tablename__ = "player_data"
    id = Column(Integer, primary_key=True, index=True)
    summoner_id = Column(String, index=True)
    game_name = Column(String, index=True)
    game_name_lower = Column(String)
    delta_24h = Column(Float)
    delta_72h = Column(Float)
    delta_8h = Column(Float)

class LeaguePoints(Base):
    __tablename__ = "league_points"
    id = Column(Integer, primary_key=True, index=True)
    player_data_id = Column(Integer, ForeignKey("player_data.id"))
    points = Column(Integer)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    balance = Column(Float)
    password = Column(String)
    username_lower = Column(String, index=True)
    rank = Column(Integer)
    date_registered = Column(DateTime)

class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    player_name = Column(String)
    current_price = Column(Float)
    purchase_price = Column(Float)
    shares = Column(Integer)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    game_name = Column(String)
    shares = Column(Integer)
    price = Column(Float)
    transaction_date = Column(DateTime)

class PortfolioHistory(Base):
    __tablename__ = "portfolio_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    value = Column(Float)
    date = Column(DateTime)

class Hold(Base):
    __tablename__ = "holds"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    game_name = Column(String)
    shares = Column(Integer)
    hold_deadline = Column(DateTime)

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    current_price = Column(Float)
    eight_hour_change = Column(Float)
    one_day_change = Column(Float)
    three_day_change = Column(Float)

class TransactionHold(Base):
    __tablename__ = "transaction_holds"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    game_name = Column(String)
    shares = Column(Integer)
    hold_deadline = Column(DateTime)

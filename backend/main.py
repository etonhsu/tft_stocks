from fastapi import FastAPI
from app.api.endpoints import user, leaderboard, transaction, player, dashboard, login

app = FastAPI(title='TFT Stocks API', version='1.0', description='API for a TFT stock market simulation')

# Include routers
app.include_router(user.router)
app.include_router(player.router)
app.include_router(transaction.router)
app.include_router(leaderboard.router)
app.include_router(dashboard.router)
app.include_router(login.router)


# Optional: Add any global middleware, event handlers, or exception handlers
@app.on_event('startup')
async def startup_event():
    print('Starting up...')


@app.on_event('shutdown')
async def shutdown_event():
    print('Shutting down...')

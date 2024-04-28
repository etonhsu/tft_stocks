from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.endpoints import user, leaderboard, transaction, player, dashboard, login, search, register, portfolio, \
    transaction_history

app = FastAPI(title='TFT Stocks API', version='1.0', description='API for a TFT stock market simulation')

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=[
        "http://localhost:5173"  # Allow your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allowing all methods
    allow_headers=["*"],  # Allowing all headers
)

# Include routers
app.include_router(user.router)
app.include_router(player.router)
app.include_router(transaction.router)
app.include_router(leaderboard.router)
app.include_router(dashboard.router)
app.include_router(login.router)
app.include_router(search.router)
app.include_router(register.router)
app.include_router(portfolio.router)
app.include_router(transaction_history.router)


# Optional: Add any global middleware, event handlers, or exception handlers
@app.on_event('startup')
async def startup_event():
    print('Starting up...')


@app.on_event('shutdown')
async def shutdown_event():
    print('Shutting down...')


# Run the app with Uvicorn if this file is executed directly
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

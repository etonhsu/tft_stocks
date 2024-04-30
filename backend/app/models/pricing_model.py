A = 1.35
B = 0.11282


def price_model(lp: int) -> float:
    return (lp ** A) * B

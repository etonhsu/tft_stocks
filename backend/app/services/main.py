from time import sleep

from lp_delta import calculate_delta
from portfolio_history import update_portfolio_history
from rank_update import rank_update
from riot_api import riot_api


def main():
    calculate_delta()
    update_portfolio_history()
    rank_update()
    riot_api()


if __name__ == '__main__':
    main()
    sleep(300)
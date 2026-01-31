from flask import Blueprint, jsonify, request
from app.services.stock_service import StockService

stocks_bp = Blueprint('stocks', __name__)
stock_service = StockService()


@stocks_bp.route('/', methods=['GET'])
def get_sp500_stocks():
    """Get list of all S&P 500 stocks with current prices."""
    try:
        stocks = stock_service.get_sp500_list()
        return jsonify({
            'success': True,
            'data': stocks,
            'count': len(stocks)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@stocks_bp.route('/<symbol>', methods=['GET'])
def get_stock_details(symbol: str):
    """Get detailed information for a specific stock."""
    try:
        stock = stock_service.get_stock_details(symbol.upper())
        if stock:
            return jsonify({
                'success': True,
                'data': stock
            })
        return jsonify({
            'success': False,
            'error': f'Stock {symbol} not found'
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@stocks_bp.route('/<symbol>/history', methods=['GET'])
def get_stock_history(symbol: str):
    """Get price history for a stock."""
    period = request.args.get('period', '1mo')  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    interval = request.args.get('interval', '1d')  # 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

    try:
        history = stock_service.get_stock_history(symbol.upper(), period, interval)
        return jsonify({
            'success': True,
            'data': history
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@stocks_bp.route('/gainers', methods=['GET'])
def get_top_gainers():
    """Get top gaining stocks today."""
    limit = request.args.get('limit', 10, type=int)
    try:
        gainers = stock_service.get_top_movers('gainers', limit)
        return jsonify({
            'success': True,
            'data': gainers
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@stocks_bp.route('/losers', methods=['GET'])
def get_top_losers():
    """Get top losing stocks today."""
    limit = request.args.get('limit', 10, type=int)
    try:
        losers = stock_service.get_top_movers('losers', limit)
        return jsonify({
            'success': True,
            'data': losers
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

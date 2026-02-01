from flask import Blueprint, jsonify, request
from app.services.crypto_service import CryptoService

crypto_bp = Blueprint('crypto', __name__)
crypto_service = CryptoService()


@crypto_bp.route('/', methods=['GET'])
def get_crypto_list():
    """Get list of top cryptocurrencies with current market data."""
    try:
        cryptos = crypto_service.get_crypto_list()
        return jsonify({
            'success': True,
            'data': cryptos,
            'count': len(cryptos)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/market', methods=['GET'])
def get_market_overview():
    """Get overall crypto market statistics."""
    try:
        overview = crypto_service.get_market_overview()
        return jsonify({
            'success': True,
            'data': overview
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/<crypto_id>', methods=['GET'])
def get_crypto_details(crypto_id: str):
    """Get detailed information for a specific cryptocurrency."""
    try:
        crypto = crypto_service.get_crypto_details(crypto_id.lower())
        if crypto:
            return jsonify({
                'success': True,
                'data': crypto
            })
        return jsonify({
            'success': False,
            'error': f'Cryptocurrency {crypto_id} not found'
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/<crypto_id>/history', methods=['GET'])
def get_crypto_history(crypto_id: str):
    """Get price history for a cryptocurrency."""
    days = request.args.get('days', '30')  # 1, 7, 14, 30, 90, 180, 365, max

    try:
        history = crypto_service.get_crypto_history(crypto_id.lower(), days)
        return jsonify({
            'success': True,
            'data': history
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/gainers', methods=['GET'])
def get_top_gainers():
    """Get top gaining cryptocurrencies today."""
    limit = request.args.get('limit', 10, type=int)
    try:
        gainers = crypto_service.get_top_gainers(limit)
        return jsonify({
            'success': True,
            'data': gainers
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@crypto_bp.route('/losers', methods=['GET'])
def get_top_losers():
    """Get top losing cryptocurrencies today."""
    limit = request.args.get('limit', 10, type=int)
    try:
        losers = crypto_service.get_top_losers(limit)
        return jsonify({
            'success': True,
            'data': losers
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

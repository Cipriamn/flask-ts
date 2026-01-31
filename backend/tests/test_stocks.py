import pytest
from app import create_app


@pytest.fixture
def client():
    """Create test client."""
    app = create_app('development')
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client


def test_health_check(client):
    """Test health endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_get_stocks_endpoint(client):
    """Test stocks list endpoint."""
    response = client.get('/api/stocks/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'success' in data
    assert 'data' in data

import pytest

@pytest.mark.asyncio
async def test_register(async_client):
    response = await async_client.post("/api/auth/register", json={
        "email": "new@example.com",
        "username": "newuser",
        "password": "password"
    })
    assert response.status_code == 201
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login(async_client, auth_headers):
    response = await async_client.post("/api/auth/login", data={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_get_me(async_client, auth_headers):
    response = await async_client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

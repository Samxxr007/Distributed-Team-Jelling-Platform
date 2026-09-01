import pytest

@pytest.mark.asyncio
async def test_create_team(async_client, auth_headers):
    response = await async_client.post("/api/teams", json={
        "name": "Dev Team",
        "description": "Awesome team"
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Dev Team"
    assert "invite_code" in response.json()

@pytest.mark.asyncio
async def test_list_teams(async_client, auth_headers):
    await async_client.post("/api/teams", json={"name": "Team 1"}, headers=auth_headers)
    response = await async_client.get("/api/teams", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) > 0

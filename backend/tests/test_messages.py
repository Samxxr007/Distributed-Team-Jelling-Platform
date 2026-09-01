import pytest

@pytest.mark.asyncio
async def test_send_message(async_client, auth_headers):
    # Create team first
    team_res = await async_client.post("/api/teams", json={"name": "T1"}, headers=auth_headers)
    team_id = team_res.json()["id"]

    res = await async_client.post("/api/messages", json={
        "content": "Hello team!",
        "team_id": team_id,
        "message_type": "team"
    }, headers=auth_headers)
    
    assert res.status_code == 201
    assert res.json()["content"] == "Hello team!"

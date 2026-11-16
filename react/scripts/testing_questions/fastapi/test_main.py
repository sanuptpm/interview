# test_main.py   (main.py has get_db and GET /employees)
from fastapi.testclient import TestClient
from main import app, get_db

class FakeDB:
    def get_employees(self):
        return [{"id": 1, "name": "Asha", "salary": 50000}]

def test_list_employees():
    app.dependency_overrides[get_db] = lambda: FakeDB()
    client = TestClient(app)
    response = client.get("/employees")
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "name": "Asha", "salary": 50000}]
    app.dependency_overrides.clear()

from fastapi import Depends, FastAPI

app = FastAPI()

def get_db():
    raise RuntimeError("real database is not available in tests")

@app.get("/employees")
def list_employees(db=Depends(get_db)):
    return db.get_employees()

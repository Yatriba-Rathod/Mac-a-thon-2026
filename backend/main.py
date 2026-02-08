from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import router 
from database.database import check_db_connection
# Initialize FastAPI app
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["POST, PUT, DELETE, GET"],  # Allows POST, PUT, DELETE, GET
    allow_headers=["*"],
)

# Register Routes
app.include_router(router)

check_db_connection()
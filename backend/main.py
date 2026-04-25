from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib
import datetime

app = FastAPI(title="VS FATE Game API")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 内存存储（生产环境应使用数据库）
users_db = {}

class User(BaseModel):
    username: str
    password: str

class UserData(BaseModel):
    playerHp: int = 50
    playerNp: int = 30
    wins: int = 0
    losses: int = 0

class GameData(BaseModel):
    playerHp: int
    playerNp: int

# 密码加密
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@app.post("/api/register")
async def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="用户名已存在")
    
    users_db[user.username] = {
        "password": hash_password(user.password),
        "created_at": datetime.datetime.now().isoformat(),
        "game_data": {
            "playerHp": 50,
            "playerNp": 30,
            "wins": 0,
            "losses": 0
        }
    }
    return {"success": True, "message": "注册成功"}

@app.post("/api/login")
async def login(user: User):
    if user.username not in users_db:
        raise HTTPException(status_code=400, detail="用户名不存在")
    
    if users_db[user.username]["password"] != hash_password(user.password):
        raise HTTPException(status_code=400, detail="密码错误")
    
    return {
        "success": True,
        "message": "登录成功",
        "data": users_db[user.username]["game_data"]
    }

@app.get("/api/user/{username}")
async def get_user_data(username: str):
    if username not in users_db:
        raise HTTPException(status_code=404, detail="用户不存在")
    return {"success": True, "data": users_db[username]["game_data"]}

@app.post("/api/user/{username}/save")
async def save_game_data(username: str, data: GameData):
    if username not in users_db:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    users_db[username]["game_data"]["playerHp"] = data.playerHp
    users_db[username]["game_data"]["playerNp"] = data.playerNp
    return {"success": True, "message": "保存成功"}

@app.post("/api/user/{username}/result")
async def save_result(username: str, victory: bool):
    if username not in users_db:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    if victory:
        users_db[username]["game_data"]["wins"] += 1
    else:
        users_db[username]["game_data"]["losses"] += 1
    
    return {"success": True, "message": "记录成功"}

@app.get("/api/leaderboard")
async def get_leaderboard():
    sorted_users = sorted(
        users_db.items(),
        key=lambda x: x[1]["game_data"]["wins"],
        reverse=True
    )[:10]
    
    return {
        "success": True,
        "data": [
            {
                "username": username,
                "wins": data["game_data"]["wins"],
                "losses": data["game_data"]["losses"]
            }
            for username, data in sorted_users
        ]
    }

@app.get("/")
async def root():
    return {"message": "VS FATE Game API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

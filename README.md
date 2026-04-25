# VS FATE 回合制对战游戏

## 项目结构

```
黑客松/
├── vs-fate/                 # React + Vite 前端
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── context/        # React Context
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/             # 静态资源
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/                 # FastAPI 后端
│   ├── main.py
│   └── requirements.txt
├── 封面.png                # 游戏封面
├── 界面一.png            # 游戏界面背景
└── README.md
```

## 技术栈

- **前端**: React 18 + Vite + React Router
- **后端**: FastAPI (Python)
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel (前端) + Vercel/VPS (后端)

## 本地开发

### 1. 安装依赖

```bash
# 前端
cd vs-fate
npm install

# 后端
cd backend
pip install -r requirements.txt
```

### 2. 启动开发服务器

```bash
# 前端 (端口3000)
npm run dev

# 后端 (端口8000)
cd backend
python main.py
```

### 3. 访问游戏

- 封面/登录页: http://localhost:3000
- 游戏页面: http://localhost:3000/game
- API文档: http://localhost:8000/docs

## 部署到 Vercel + Supabase

### 前端部署 (Vercel)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 设置环境变量（如有需要）
4. 自动部署

### 后端部署

**选项1: Vercel Serverless Functions**

创建 `api/index.py` 并配置 `vercel.json`

**选项2: VPS/云服务器**

```bash
# 使用 Docker 部署
docker build -t vs-fate-backend .
docker run -d -p 8000:8000 vs-fate-backend
```

### Supabase 数据库配置

1. 创建 Supabase 项目
2. 创建表:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    player_hp INTEGER DEFAULT 50,
    player_np INTEGER DEFAULT 30,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0
);
```

3. 获取连接字符串并配置到后端

## 游戏特性

- ✅ 回合制对战
- ✅ 技能系统（决进、潜龙、酒诗）
- ✅ NP 资源管理
- ✅ 用户登录/注册
- ✅ 存档系统
- ✅ 胜负统计
- ✅ 响应式设计

## API 接口


| 接口 | 方法 | 说明 |
|------|------|------|
| /api/register | POST | 用户注册 |
| /api/login | POST | 用户登录 |
| /api/user/{username} | GET | 获取用户数据 |
| /api/user/{username}/save | POST | 保存游戏 |
| /api/user/{username}/result | POST | 记录胜负 |
| /api/leaderboard | GET | 排行榜 |

## 许可证

MIT

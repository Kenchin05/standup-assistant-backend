# AI Standup Assistant – Backend (Node.js + Express + TypeScript)

This is the backend service for the **AI Standup Assistant**, a collaborative team tool that  automates daily standups, performs AI analysis on updates, generates team summaries,and provides insights into productivity patterns.

The backend provides:
- REST APIs for authentication, teams, standups, and insights  
- MongoDB storage  
- AI integration via LangChain + Groq(llama-3.1-8b-instant)  
- Daily standup analysis  
- Team-wide AI summaries  
- Insights & analytics endpoints  

---

## Features

### User & Team Management
- Signup, login (JWT auth)
- Create / join teams by code
- View team members

### Standups
- Submit daily standup (Yesterday / Today / Blockers)
- Edit today’s standup
- Delete standup entries
- View standup history

### AI System (LangChain + Groq)
- Extract key tasks
- Identify vague updates
- Detect emotional tone
- Suggest improvements
- Generate team summary, blockers, risks, and collaboration suggestions

### Insights
- Vagueness trend line
- Tone distribution
- Avg clarity score
- Basic streak calculation
- AI-generated insights narrative

---

# Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Kenchin05/standup-assistant-backend.git
cd standup-assistant-backend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` file

Refer to the template below:

### 📄 **env.example**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-standup
JWT_SECRET=your_jwt_secret

# Groq API Key
GROQ_API_KEY=your_groq_key

```

---

## 4️⃣ Run in Development

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---
# Seed Script (Sample Users + Teams + Standups)
The project includes a database seeding script that generates:

- 5 sample users
- 2 teams (Alpha, Beta)
- Automatic team-member linking
- 3–5 standups per user
- AI feedback placeholders (so Insights works immediately)

## File Location
```bash
src/seed.ts
```

## Run Seeder
```bash
npm run seed
```
This will:
- Connect to MongoDB
- Clear existing users, teams, standups
- Insert all sample data
- Print test login credentials

## Output
```bash
Login Accounts:
rishav@test.com | Password123
aditi@test.com | Password123
kirat@test.com | Password123
rahul@test.com | Password123
khyati@test.com | Password123
```
---

# API Documentation

Below is a concise list of core routes.

---

##  Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create user |
| POST | `/login` | Login & return JWT |

---

## Team Routes (`/api/team`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new team |
| POST | `/join` | Join team by code |
| GET | `/members` | List team members |
| GET | `/summary` | AI team-wide summary |

---

## Standup Routes (`/api/standup`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Submit standup |
| GET | `/me` | Get own standup history |
| PUT | `/:id` | Edit specific standup |
| DELETE | `/:id` | Delete standup |

---

## Insights Routes (`/api/insights`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | User insights (trend + tone + summary) |

---

# AI Prompting Strategy (LangChain)

### 1. **Individual Standup Analysis**
Prompt extracts:
- Key tasks from yesterday/today
- Emotional tone
- Vagueness score (0–10)
- Improvement suggestions

### 2. **Team Summary Analysis**
Given all team members’ standups, the AI:
- Summarizes team progress (1 paragraph)
- Extracts common blockers
- Finds collaboration opportunities
- Detects risks

### 3. **Insights Generation**
- Sentiment trend over time  
- Clarity trend  
- Weekly insight paragraph  

---



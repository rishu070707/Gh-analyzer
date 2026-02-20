# GitHub Repository Analyzer

A full-stack web application to analyze GitHub repositories with a modern, glassmorphism UI.

## Features
- Repository statistics (commits, contributors, stars, etc.)
- Visual charts: Language usage, Commit activity, Top contributors
- Repo health metrics: Bus factor, Issue closure rate
- Dark mode + Glassmorphism design

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express, GitHub API

## Getting Started

### Prerequisites
- Node.js installed

### 1. Backend Setup
Navigate to the `server` directory:
```bash
cd server
npm install
```
Create a `.env` file in `server/` with your GitHub Token (optional but recommended for higher rate limits):
```
PORT=5000
GITHUB_TOKEN=your_github_personal_access_token
```
Start the server:
```bash
npm start
# or for development
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
Navigate to the `client` directory:
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` (or the URL shown in terminal) to view the app.

## Project Structure
- `client/`: React frontend
- `server/`: Node.js backend

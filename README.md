# AuctionApp - Fullstack Auction Site

Tech stack: React (Vite + TypeScript) → ASP.NET Core Web API → SQL Server (LocalDB).

## Prerequisites
- .NET 10 SDK, Node 24, SQL Server LocalDB, `dotnet-ef`

## Start backend
```bash
cd backend
dotnet user-secrets set "Jwt:Key" "<long random key, at least 32 characters>"
dotnet ef database update
dotnet run
```
The API runs on http://localhost:5139. Generate a key with e.g. `openssl rand -base64 48`.

## Start frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. Start the backend first.
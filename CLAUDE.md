# AuctionApp – project docs

Fullstack auction site for *Inlämningsuppgift 2* (Webbutveckling, Labb 2).
React (Vite) frontend → ASP.NET Core Web API → SQL Server. Auth with JWT.
Personal working preferences live in `~/.claude/CLAUDE.md`, not here.

## Status – PICK UP HERE

**Where we are (2026-10-09):** Planning for G is done. Repo has only README + .gitignore + this
file. No code yet. All machine-wide tools are installed (see "Prerequisites").

**Next steps:**
1. Kalle creates the `backend` branch from `main`, then `backend/scaffold` from `backend`
   (see "Git workflow").
2. Start **Step 1** of "Technical plan (G) → Build order" below: scaffold the backend.
3. Work through the build order one step at a time; tick off the G checklist as features work.

## Git workflow (Kalle, 2026-10-09)
Kalle runs all git commands. No pull requests; merges are done locally.
```
main                     ← finished, runnable versions only
├── backend              ← collects finished backend tasks
│   ├── backend/scaffold   (one short branch per task / build step)
│   └── backend/auth-jwt ...
└── frontend             ← created from main AFTER backend is merged in
    └── frontend/scaffold ...
```
- Task branch: create from its area branch, commit small, merge back into the area branch, delete.
- Area branch → `main` when a milestone works (e.g. backend steps 1–5 done and tested).
- `frontend` is branched from `main` once the backend is merged, so the API code is on disk to run against.
- Merge with `git merge --no-ff <branch>` so each task shows up as its own merge commit in history.

## How we work (Kalle, 2026-10-09)
- **Kalle writes all the code.** Claude is a guide: explains what to build next, why, and how the
  pieces fit; reviews Kalle's code and helps debug. Claude writes code only when Kalle explicitly asks.
- Small hints/snippets to illustrate a concept are OK; full files or features are not.
- Kalle takes pen-and-paper notes: explain each step's *why* in short, writable points.
- Claude keeps this file current and suggests a fresh session after milestones.

## Requirements checklist

Source: assignment text, quoted in full at the bottom of this file.

### G (pass)
- [ ] Create user (name, email, password) and log in. JWT authentication.
- [ ] Logged-in user can create an auction: title, description, price, start date, end date, creator.
- [ ] Auction is **open** if end date > current date and time.
- [ ] Search auctions by title. Only open auctions in search results.
- [ ] Select an auction → see all its bids.
- [ ] Place a bid (date + amount) if it's not your own auction. Must be higher than the current
      highest bid, otherwise show a "bid too low" message.
- [ ] Creator cannot bid on own auction, and the bid UI is **hidden** for them.
- [ ] All data fetched through Web API calls and shown in the browser.
- [ ] Well-designed UI and clean code following lesson guidelines. Runs without errors.

### VG (pass with distinction), on top of G
- [ ] Not logged in = read-only (no bidding, no create/update auctions). Always verify user with JWT.
- [ ] User can change own password, but not their username.
- [ ] Search can also include closed (ended) auctions.
- [ ] Closed auction view: auction info + winning (highest) bid only. No bid history, no bidding.
- [ ] Update an auction, but price can't change if it already has bids.
- [ ] Undo (delete) a bid: only the latest bid, and only while the auction is open.
- [ ] Use both React Router and Context API.
- [ ] Responsive: looks good on desktop and mobile.
- [ ] Admin login. Admin can deactivate an auction (hidden from search) and deactivate a user
      account (can't log in).
- [ ] Higher demands on code quality and structure.

### Presentation
- Demo the working app to the teacher. **Don't send anything by email.**
- Deadline: last day of the course.

## Course conventions (inferred, no official lesson material)

Sources, read 2026-10-09 (classmate's public GitHub, `BlazeDraconian`):
- Lesson code-alongs: `DemoWebAPI_Automapper`, `WebAPI_CORS`, `Demo-ContextAPI` (Feb–Mar 2026).
- Passed G solution: `Webbutveckling-Uppgift-2` (frontend only, backend not public).
**Rule (Kalle, 2026-10-09): use the classmate's repo only to understand structure and scope.
Never copy its code, CSS, texts or visual design.** Write everything from scratch.
- OK: folder/layer structure and patterns taught in the lesson demos (that's the course standard).
- OK: generic REST route names (`/api/auctions`, `/api/bids`) — any solution would have them.
- Not OK: copying or lightly rewriting their components, `apiFetch` helper, CSS or color theme.

### Backend (from the lesson demos)
- .NET 10 (`net10.0`), controllers: `[Route("api/[controller]")]`, `[ApiController]`, `ControllerBase`.
- Layers and folders:
  - `Controllers/`: thin, only calls the service and returns `Ok(...)` etc.
  - `Core/Interfaces/` + `Core/Services/`: business logic (e.g. "bid too low", "can't bid on own auction").
  - `Data/Interfaces/` + `Data/Repos/`: database access (EF Core here).
  - `Data/Entities/`: EF classes = tables. `Data/DTO/`: what the API sends/receives.
  - `Data/Profiles/`: AutoMapper profiles, Entity ↔ DTO.
- Every repo/service has an interface and is registered in `Program.cs` with `AddScoped<IX, X>()`.
- Constructor injection into `private readonly` fields named `_service`, `_repo`, `_mapper`.
- CORS: `AddCors()` + `UseCors(AllowAnyOrigin/Header/Method)` (lesson comment: simple but less secure).
- Comments in Swedish explaining concepts are normal in the course code.
- No JWT/EF demos found. Use standard ASP.NET Core JWT bearer + EF Core migrations.

### Frontend
- Lesson demo: Vite + React 19 + **TypeScript**. Folders `components/<Name>/<Name>.tsx` + own `.css`,
  `contexts/` (separate `XContext` + `XProvider` files), `services/` (fetch calls), `types/`.
- Passed solution: React 19 + React Router 7, **JavaScript**, `Pages/` + `Services/`.
  - One `apiFetch` helper that adds `Authorization: Bearer <token>` and throws on non-OK responses.
  - Token stored in `localStorage`, user id read from the JWT's `nameid` claim to hide bid UI for owner.
  - API routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auctions`,
    `GET /api/auctions/search?title=`, `GET /api/auctions/{id}`, `POST /api/auctions`,
    `GET /api/bids/auction/{id}`, `POST /api/bids`.

## Goal (Kalle, 2026-10-09)
**The best possible G solution, done our way.** Other students' solutions don't set the bar.
- Every G requirement fully and solidly done, plus a well-designed UI and clean code (both are G requirements).
- Follow the lesson architecture above, because the grading criteria explicitly require it.
  Where the lessons say nothing, use standard best practice.
- No VG features until G is complete.

## Prerequisites

**Installed on the machine (checked 2026-10-09):**
- .NET SDK 10.0.401 · Node 24.15 + npm 11.12 · SQL Server LocalDB (`MSSQLLocalDB`) · `dotnet-ef` 10.0.7

**Downloaded per project during scaffolding (not yet):**
- Backend (NuGet): `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.EntityFrameworkCore.Design`,
  `Microsoft.AspNetCore.Authentication.JwtBearer`, `AutoMapper`.
  Passwords hashed with ASP.NET Core's built-in `PasswordHasher<T>` (no extra package).
- Frontend (npm): Vite React-TS template (`react`, `react-dom`, `typescript`, `vite`) + `react-router-dom`.

## Technical plan (G)

### Data model (EF Core entities → SQL Server tables)
- **User:** Id, Name (unique, = username), Email (unique, used to log in), PasswordHash.
- **Auction:** Id, Title, Description, StartPrice, StartDate, EndDate, UserId (creator) → User.
- **Bid:** Id, Amount, BidDate (set by the server), AuctionId → Auction, UserId (bidder) → User.
- Money as `decimal`. Dates stored in UTC.
- Bid → User must not cascade-delete (SQL Server rejects multiple cascade paths to Bid).

### API endpoints
| Method + route | Login? | What it does |
|---|---|---|
| `POST /api/auth/register` | no | Create user (name, email, password) |
| `POST /api/auth/login` | no | Check email + password, return JWT |
| `GET /api/auctions?title=` | no | Search **open** auctions by title (all open if empty) |
| `GET /api/auctions/{id}` | no | One auction, incl. creator name and highest bid |
| `POST /api/auctions` | yes | Create auction; creator taken from the token, not the request |
| `GET /api/auctions/{id}/bids` | no | All bids for an auction, highest first |
| `POST /api/auctions/{id}/bids` | yes | Place bid (rules below) |

**Bid rules (in the service, not the controller):** auction must be open · bidder ≠ creator ·
amount > max(highest bid, start price), else 400 "Budet är för lågt".
**Status codes:** 200/201 OK · 400 validation/rule broken · 401 not logged in · 404 not found.

### Frontend (React + TS + React Router)
| Route | Page | Login? |
|---|---|---|
| `/` | Search + list of open auctions | no |
| `/auctions/:id` | Auction details, bid list, bid form (hidden for creator / logged out) | no |
| `/auctions/new` | Create auction form | yes |
| `/login`, `/register` | Forms | no |

- `contexts/`: `AuthContext` + `AuthProvider` (logged-in user + token), as in the lesson demo.
- `services/`: one file per API area (auth, auctions, bids). `types/`: shared TS types.
- `components/<Name>/<Name>.tsx` + `.css`. Errors shown in the page, not `alert()`.

### Build order (each step ends with something testable)
1. Backend scaffold: project, folders, packages, connection string, CORS.
2. Entities + DbContext + first migration → database exists in LocalDB.
3. Register + login + JWT → test with a `.http` file.
4. Auctions endpoints (create, search, get one).
5. Bids endpoints with the rules.
6. Frontend scaffold: Vite React-TS, router, `AuthContext`, API services.
7. Pages: register/login → auction list + search → details + bids → create auction.
8. Design pass: consistent look, error/loading states, works on a phone-sized screen.
9. Full run-through against the G checklist; fix anything that errors.

## Open questions (VG only, decide when we get there)
- Who may undo a bid: only the bidder who placed it? Assumption: yes.
- Who may update an auction: only its creator (and admin?).
- How is the admin account created: seeded in the database?

## Decisions (with reasons)
- **Stack:** ASP.NET Core Web API, EF Core, SQL Server, JWT, React + Vite, React Router,
  Context API. *Why:* required by the assignment (Router + Context are VG requirements).
- **Folder layout:** `backend/` and `frontend/` in one repo. *Why:* one fullstack solution to demo.
- **Frontend in TypeScript** (2026-10-09). *Why:* matches the lesson demos (Vite + React + TS).
- **"Namn" = username; log in with email + password** (2026-10-09). *Why:* the assignment lists
  name/email/password; email is unique and what users remember.
- **First bid must be higher than the start price** (2026-10-09). *Why:* otherwise the price means nothing.
- **Open = StartDate ≤ now < EndDate** (2026-10-09). *Why:* an auction that hasn't started shouldn't
  be searchable or take bids. The assignment only defines the end date, so this is our interpretation.
- **Branches: `main` → `backend`/`frontend` → one task branch per step, no PRs** (2026-10-09).
  *Why:* Kalle wants a clear split by area and small, isolated tasks; solo project, so local
  merges are enough. Long-lived area branches can drift, so merge to `main` at each milestone.
- **CLAUDE.md stays in the repo** (2026-10-09). *Why:* the school allows AI, the old commit already
  contains it, and rewriting history isn't worth the risk. Grading is a live demo.

## Glossary
- **G / VG / IG:** pass / pass with distinction / fail.
- **Redovisning:** presentation/demo to the teacher.
- **Open auction:** end date is later than now.
- **JWT (JSON Web Token):** signed token the API issues at login; the client sends it in the
  `Authorization: Bearer <token>` header to prove who it is.
- **EF Core:** ORM that maps C# classes to SQL Server tables; migrations create/update the schema.
- **Context API:** React's built-in way to share state (e.g. logged-in user) without passing props down.

## Learning notes (question → answer → why)
- **What is a DTO and why not just return the entity?** → A separate class shaped for the API.
  *Why:* the entity mirrors the DB table (e.g. password hash, navigation properties); the DTO
  controls exactly what leaves the API. AutoMapper copies fields between them.
- **Why interfaces for every service/repo?** → Controllers depend on `IAuctionService`, not the class.
  *Why:* dependency injection can swap the implementation (e.g. fake repo in tests) without
  changing the controller. This is the course's standard pattern.
- **How do I stop git tracking a file that's already committed?** → Add it to `.gitignore`, then
  run `git rm --cached <file>` and commit. *Why:* `.gitignore` only affects untracked files;
  `--cached` removes the file from git's index but keeps it on disk. Old commits still contain it.

## Original assignment text (Swedish, verbatim)

> Inlämningsuppgift 2: Skapa en fullstack auktionslösning
>
> Uppgiften handlar om att skapa en applikation med React som går mot ett ASP.NET web api. Lösningen skall hantera en auktionssajt och all data skall sparas i en SQL Server databas. Det skall vara en frontendklient som går mot ett web api och skapar en fullstacklösning med både frontend och backend som kommunicerar med varandra. React applikationen och web api:et skall stödja all funktionalitet som beskrivs nedan.
>
> **Krav för att uppgiften skall bli godkänd:**
> - Det skall gå att skapa och hantera auktioner, användare och bud i React applikationen. All data måste kunna hämtas via web api anrop och visas i webbläsaren. Det skall gå att skapa en användare (namn, email och lösenord) samt logga in. Behöver använda JWT för authentication.
> - Det skall gå att skapa auktioner för en inloggad användare. En auktion har en titel, beskrivning, ett pris och start- och slutdatum samt vilken användare som skapat den. Den är öppen om slutdatumet är senare än aktuellt datum och klockslag.
> - Det skall gå att söka på auktioner via titeln. Bara öppna auktioner skall visas i sökningar. Sedan skall det gå att välja en auktion och se alla bud som finns för den. Är det inte användarens egen auktion kan den lägga ett bud (datum och summa). Detta måste vara högre än det tidigare högsta budet, annars skall användaren få ett meddelande om att budet är för lågt.
> - Den användare som skapat auktionen kan inte själv lägga bud på den. Applikationen skall känna av detta och funktionalitet för att skapa bud skall inte visas i detta fall.
> - Designen för React applikationen måste kännas genomarbetad och skall följa de riktlinjer som vi pratat om på lektionerna. För koden gäller samma sak. Lösningen skall gå att köra utan fel.
> - Web api:et skall ha stöd för all denna funktionalitet och vara uppbyggt enligt de principer som vi pratat om på lektionerna.
> - Lösningen måste följa de riktlinjer som vi går igenom på lektionerna. Koden skall fungera och applikationen skall gå att köra utan att det blir fel.
>
> **Extra krav för Väl godkänd:**
> - Är man inte inloggad skall man bara kunna läsa data inte lägga bud eller skapa/uppdatera auktioner. En användare skall alltid verifieras med en JWT token. En användare skall kunna uppdatera sitt eget lösenord men inte ändra användarnamn.
> - Det skall även gå att söka på ej öppna(avslutade) auktioner. Väljs en auktion som inte är öppen skall bara information om auktionen visas samt det högsta vinnande budet. Det skall inte visas någon budhistorik och det skall inte gå att lägga bud.
> - Det skall även gå att uppdatera auktionen men inte ändra priset om det redan finns bud. Det går även att ångra ett bud dvs ta bort det på en auktion om auktionen inte är avslutad och det är senaste budet.
> - Ni måste använda både React Router och Context API (eller motsvarande externt bibliotek) i er lösning.
> - Lösningen skall vara responsiv dvs anpassa sig till olika skärmstorlek och se snygg ut både på stor skärm eller mobiltelefon skärm.
> - Det måste finnas en admin inloggning och som admin skall det finnas möjlighet att inaktivera en auktion så att den inte syns i sökningar. Det skall även gå att inaktivera ett användarkonto så att det inte går att logga in via det kontot.
> - Högre krav på koden och strukturen i lösningen
>
> **Betyg:** Det går att få G, VG och IG på uppgiften. Den är obligatorisk för att kunna få G på hela kursen. För betyget VG på kursen krävs VG på uppgiften.
>
> **Redovisning:** Redovisning sker genom att du visar läraren den fungerande uppgiften. Skicka INTE in något via mail! Senaste tidpunkt för redovisning är sista dagen på kursen.

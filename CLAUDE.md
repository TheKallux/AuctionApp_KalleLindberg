# AuctionApp – project docs

Fullstack auction site for *Inlämningsuppgift 2* (Webbutveckling, Labb 2).
React (Vite) frontend → ASP.NET Core Web API → SQL Server. Auth with JWT.
Personal working preferences live in `~/.claude/CLAUDE.md`, not here.

## Status – PICK UP HERE

**Where we are (2026-10-10):** Steps 1–2 done.
- Step 2 on `backend-entities-db`: entities `User`, `Auction`, `Bid` (`Data/Entities/`),
  `Data/AuctionDbContext.cs` (DbSets + rules in `OnModelCreating`), registered with
  `AddDbContext` in `Program.cs`, migration `InitialCreate` in `backend/Migrations/`.
- Database `AuctionDb` exists in LocalDB. Verified with sqlcmd: tables `Users`, `Auctions`, `Bids`
  + `__EFMigrationsHistory`. Migration checked: unique Email/Name, decimal(18,2), Bid→User Restrict.
- Added the missing `Microsoft.EntityFrameworkCore.Design` 10.0.12 (wasn't installed in Step 1).
- `main` is unchanged (merge `backend` → `main` after Step 5). API runs on `http://localhost:5139`.

- Step 2 merged into `backend` and pushed (2026-10-10).

**Step 3 in progress** on `backend-auth-jwt` (parts: 1 DTOs → 2 UserRepo → 3 AuthService/register
→ 4 AuthController + `.http` test → 5 JWT settings + token + login → 6 `Program.cs` auth + test):
- Parts 1–5 done (2026-10-14): DTOs, `UserRepo`, `AuthService` (register rules, hashing, login,
  `CreateToken` with NameIdentifier + Name claims, 2 h expiry), `AuthController`
  (`POST /api/auth/register` → 201/400, `POST /api/auth/login` → 200 + token / 401), `Jwt`
  section in `appsettings.json`. Tested via `AuctionApi.http`: register + login work.
- Part 5 code (AuthService/AuthController/appsettings/.http) was written by Claude on Kalle's
  request → walk through it with Kalle so they can explain it at the demo.
- **Next: Part 6** — `Program.cs`: `AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(...)` with `TokenValidationParameters` (issuer, audience, lifetime, signing key
  from config) + `app.UseAuthentication()` before `UseAuthorization()`. Test with a temporary
  `[Authorize]` endpoint (401 without token, 200 with `Authorization: Bearer <token>`).
  Then commit + merge `backend-auth-jwt` → `backend`.

**Last session recap (2026-10-10)** — greet Kalle with this at the start of the next session:
- Registered the DbContext in `Program.cs`; installed the missing EF `Design` package.
- Ran the first migration → database `AuctionDb` with Users/Auctions/Bids exists. Step 2 merged.
- Step 3 started on `backend-auth-jwt`: Part 1 DTOs done (Register/Login/AuthResponse + validation).
- Part 2 (UserRepo) started: `IUserRepo`/`UserRepo` files were created in a wrong top-level
  `Data/` folder → fix: `mv Data/Interfaces Data/Repos backend/Data/` + `rmdir Data` (repo root).
- Switched VS Code's terminal to Git Bash.

**Session notes:** Kalle found `OnModelCreating` (fluent API) hard → explain it slowly, line by
line. VS Code's terminal is PowerShell by default; Git Bash commands (`touch`, `mkdir -p`) need
the Git Bash profile.

## Git workflow (Kalle, 2026-10-09)
Kalle runs all git commands. No pull requests; merges are done locally.
```
main                     ← finished, runnable versions only
├── backend              ← collects finished backend tasks
│   ├── backend-scaffold   (one short branch per task / build step)
│   └── backend-auth-jwt ...
└── frontend             ← created from main AFTER backend is merged in
    └── frontend-scaffold ...
```
- Task branch: create from its area branch, commit small, merge back into the area branch, delete.
- Area branch → `main` when a milestone works (e.g. backend steps 1–5 done and tested).
- `frontend` is branched from `main` once the backend is merged, so the API code is on disk to run against.
- Merge with `git merge --no-ff <branch>` so each task shows up as its own merge commit in history.
- Task branches use a **dash**, not a slash (`backend-scaffold`, not `backend/scaffold`): Git can't
  have both a branch `backend` and `backend/...` (see Learning notes).

## Command cheat sheet (grows as we use new commands)
Pattern: `tool verb [what] [options]`. Stuck? `<tool> <verb> --help`. Git Bash: ↑ = history,
Ctrl+R = search history, Tab = complete names.

| Situation | Command |
|---|---|
| Where am I / what changed? | `git status` · `git branch -a` · `git log --oneline -5` |
| Start a task | `git switch backend` → `git pull` → `git switch -c backend-<task>` |
| Save work | `git add -A` (whole repo; `.` = current folder only) → `git commit -m "..."` |
| First push of a new branch | `git push -u origin <branch>` (after that: `git push`) |
| Finish a task | `git switch backend` → `git merge --no-ff backend-<task>` → `git push` → `git branch -d backend-<task>` |
| Create folder(s) | `mkdir -p backend/Data/Entities` (`-p` = also parents, no error if exists) |
| Create empty files | `touch backend/Data/Entities/{User,Auction,Bid}.cs` (`{a,b}` = several at once) |
| List files | `ls <folder>` |
| Open in VS Code | `code .` (whole folder) · `code <file>` |
| Vim (e.g. merge message) | save + quit: `:wq` + Enter |
| New .NET project | `dotnet new webapi --use-controllers -o <folder> -n <Name>` |
| Add a NuGet package | `dotnet add package <Name> [--version x.y.z]` (inside the project folder) |
| Create a migration (DB untouched) | `dotnet ef migrations add <Name>` (needs `EntityFrameworkCore.Design`) |
| Apply migrations to the DB | `dotnet ef database update` |
| Undo the last (unapplied) migration | `dotnet ef migrations remove` |
| List tables in the DB | `sqlcmd -S "(localdb)\MSSQLLocalDB" -d AuctionDb -Q "SELECT name FROM sys.tables"` |
| Where am I? | `pwd` · `ls` (a `.csproj` must be here for `dotnet` commands) · `cd ..` = up one |
| Does it compile? | `dotnet build` |
| Run the API | `dotnet run` (stop: Ctrl+C) |

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
- [x] (Foundation) Data saved in SQL Server: `AuctionDb` with Users/Auctions/Bids (2026-10-10).
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
  `Microsoft.AspNetCore.Authentication.JwtBearer`, `AutoMapper` **16.1.1** (same as lesson demo).
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
- **AutoMapper 16.1.1** (2026-10-09). *Why:* exact version in the lesson demo
  `DemoWebAPI_Automapper.csproj`. v15+ wants a license key; without one it only logs a warning
  at startup (the lesson runs it that way too). Expected, not an error.
- **Rule errors via `BusinessRuleException`** (2026-10-14). Services throw it with a Swedish
  user-facing message ("E-postadressen används redan", later "Budet är för lågt"); controllers
  catch only that type → `400 BadRequest(message)`. *Why:* one consistent pattern for every rule;
  real bugs (other exceptions) still surface as 500 instead of being hidden as 400.
- **Passwords: `IPasswordHasher<User>` via DI** (2026-10-14). *Why:* built into ASP.NET Core
  (salted PBKDF2), no extra package; DI keeps `AuthService` consistent with the lesson pattern.
- **Direct reference `System.Security.Cryptography.Pkcs` 10.0.13** (2026-10-14). *Why:*
  `EF SqlServer` → `Microsoft.Data.SqlClient` 6.1.6 pulled in 9.0.11 with known vulnerabilities
  (NU1902/NU1903). A direct, newer reference overrides the transitive one. Can be removed once
  SqlClient ships a fixed dependency (check with `dotnet list package --vulnerable --include-transitive`).
- **CLAUDE.md stays in the repo** (2026-10-09). *Why:* the school allows AI, the old commit already
  contains it, and rewriting history isn't worth the risk. Grading is a live demo.

## Glossary
- **G / VG / IG:** pass / pass with distinction / fail.
- **Redovisning:** presentation/demo to the teacher.
- **Open auction:** end date is later than now.
- **JWT (JSON Web Token):** signed token the API issues at login; the client sends it in the
  `Authorization: Bearer <token>` header to prove who it is.
- **EF Core:** ORM that maps C# classes to SQL Server tables; migrations create/update the schema.
- **CORS (Cross-Origin Resource Sharing):** browser rule; a page may only read responses from
  another origin (protocol + host + port) if that server sends `Access-Control-Allow-Origin`.
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
- **Why does the API need CORS?** → React (`localhost:5173`) and the API (`localhost:5xxx`) are
  different origins; the browser blocks the response unless the API allows it via `UseCors`.
  *Why:* Same-Origin Policy protects users' browsers. Only browsers enforce it, so `.http`
  files/Postman work without CORS. It doesn't secure the API — JWT does that.
- **What's the difference between `UserId` and `User` on an entity?** → `UserId` (int) is the
  foreign key column; `User` is a navigation property (no column) that EF fills in.
  *Why:* EF links `XId` + `X` by naming convention; you set only the id when saving.
- **Why does `string` need `= string.Empty` but `int Id` doesn't?** → `int` is a value type
  (default 0, never null); `string`/classes/lists are reference types (default null).
  *Why:* nullable checks warn about possible nulls; use `string.Empty`, `new()` or `null!` (EF fills it).
- **Why `HasMaxLength` before a unique index?** → SQL Server can't index `nvarchar(max)`.
  *Why:* strings without a length become `nvarchar(max)` by default.
- **Why `OnDelete(Restrict)` on Bid → User?** → User→Bid and User→Auction→Bid are two cascade
  paths; SQL Server refuses that. *Why:* it can't decide which delete path wins.
- **What is a migration?** → Generated C# (`Up()` = apply, `Down()` = undo) describing schema
  changes. `migrations add` creates it; `database update` runs it. *Why:* two steps so you can
  read it first; the DB's history lives in git with the code. `__EFMigrationsHistory` tracks
  which migrations have run.
- **"dotnet ef … doesn't reference Microsoft.EntityFrameworkCore.Design"?** → Install that package
  (same version as the other EF packages). *Why:* the EF tool needs it to load the DbContext.
- **`git add .` didn't include CLAUDE.md?** → `.` = current folder only; I was in `backend/`.
  *Why:* use `git add -A` for the whole repo, and `git status` before switching branches.
- **Why did `git switch -c backend/scaffold` fail with "cannot lock ref"?** → A branch `backend`
  already existed. *Why:* Git stores each branch as a file in `.git/refs/heads/`; `backend` is a
  file, so Git can't also make a folder `backend/` for `scaffold`. Fix: name it `backend-scaffold`.

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

# HotelPro: Hotel Room Booking System (MERN)

A full-stack hotel booking app with two roles.

- **Customer**: sign up, log in, search rooms by date, book, view booking history, cancel.
- **Admin**: all bookings, all rooms (edit / delete), add room, all users.

The screens follow the college reference design (Material-Design-Bootstrap look): light navbar "RoomsForUse" for visitors, "SB Hotel" for customers, blue gradient navbar for admin. Brand names and the currency symbol are in `frontend/src/utils.js`.

**Stack:** React (Vite) · Node.js · Express · MongoDB (Mongoose) · JWT · Bootstrap
**Backend pattern:** MVC (models, controllers, routes) plus middleware.

---

## 1. Prerequisites

| Tool | Check with | Notes |
| --- | --- | --- |
| Node.js 18 or newer | `node -v` | https://nodejs.org (LTS) |
| MongoDB Community Server | `mongod --version` | Or use a free MongoDB Atlas cluster instead (see below) |
| Git | `git --version` | https://git-scm.com |
| VS Code (optional) | | |

## 2. Project structure

```
hotelpro/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── controllers/              Request logic (auth, room, booking, admin)
│   ├── middlewares/fetchUser.js  JWT check (fetchUser) + role check (isAdmin)
│   ├── models/                   Mongoose schemas (User, Room, Booking)
│   ├── routes/                   URL → controller mapping
│   ├── utils/                    dates.js helpers, seed.js
│   ├── app.js                    Express app
│   ├── server.js                 Connects to DB, then starts the server
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/common/    Navbar, Home, Login, SignUp, ProtectedRoute...
│   │   ├── components/user/      UserHome (search + book), BookingHistory
│   │   ├── components/admin/     AdminHome tabs, AllBookings, AllRooms, AddRoom, AllUsers
│   │   ├── api.js                Axios instance (adds the token automatically)
│   │   ├── auth.jsx              Login state (React context)
│   │   └── App.jsx               Routes
│   └── .env.example
├── .gitignore
└── README.md
```

## 3. Run it locally

Open **two terminals** (one for the backend, one for the frontend).

### Backend

```bash
cd backend
npm install
```

Create your `.env` from the example:

```bash
# macOS / Linux / Git Bash
cp .env.example .env
# Windows Command Prompt / PowerShell
copy .env.example .env
```

Open `backend/.env` and set `JWT_SECRET` to a long random string. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Make sure MongoDB is running (on Windows it normally runs as a service; on macOS `brew services start mongodb-community`; on Linux `sudo systemctl start mongod`). Then:

```bash
npm run seed     # creates the admin account + 5 sample rooms (run once)
npm run dev      # starts the API with auto-restart on http://localhost:8000
```

You should see `Connected to MongoDB` and `Server running on http://localhost:8000`.
Check it: open http://localhost:8000/api/health in a browser. It should show `{"status":"ok"}`.

> `npm start` runs the server without auto-restart. `npm run dev` uses nodemon.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev
```

Open **http://localhost:5173**.

### Log in

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hotelpro.com` | `Admin@123` (or what you set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
| Customer | create one on the SignUp page (SELECT USER → Ordinary) | your choice |
| Admin (via SignUp) | SELECT USER → Admin, then type the access code | set `ADMIN_SIGNUP_CODE` in `backend/.env` and restart the backend. If empty, admin signup is disabled |

Change the admin password in `.env` before running the seed on anything you deploy.

### Quick test checklist

1. Sign up as a customer and log in. You land on the room cards.
2. Click **LEARN MORE** on a room, choose arrival and departure dates, check availability, then **Book now**.
3. Open **My Bookings**. Cancel the booking.
4. Log out. Log in as admin. You land on the admin tabs (All Bookings, All Rooms, Add Room, All User).
5. Add a room, edit it, then try deleting it.
6. In a customer account, type `/admin` in the address bar. You are redirected away.
7. Book the same room for overlapping dates from a second customer. It shows **Not available**.

### Optional: sign-page picture and exact table

- To show your own illustration on Login/SignUp, save it as `frontend/public/auth-illustration.png` (a built-in drawing is used otherwise).
- The All Rooms table has an extra Actions column (Edit/Delete). For an exact match with the reference, set `SHOW_ROOM_ACTIONS = false` in `frontend/src/components/admin/AllRooms.jsx`.

### Using MongoDB Atlas instead of a local database

1. Create a free cluster at https://www.mongodb.com/atlas, then a database user and allow your IP under Network Access.
2. Copy the connection string and put it in `backend/.env`:
   `MONGODB_CONNECTION_LINK=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hotelpro`

## 4. API reference

Base URL: `http://localhost:8000/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register (`name, email, password, phone, userType, adminCode`). `userType: admin` needs the correct `adminCode` |
| POST | `/auth/login` | Public | Returns `{ token, user }` |
| GET | `/auth/me` | Logged in | Current user |
| GET | `/rooms` | Public | List rooms. Optional `?type=deluxe&fromdate=YYYY-MM-DD&todate=YYYY-MM-DD` adds an `available` flag |
| GET | `/rooms/:id` | Public | One room |
| POST | `/rooms` | Admin | Add room |
| PUT | `/rooms/:id` | Admin | Edit room |
| DELETE | `/rooms/:id` | Admin | Delete room (blocked if it has active or upcoming bookings) |
| POST | `/bookings` | Logged in | Book a room (`roomid, fromdate, todate`) |
| GET | `/bookings/my` | Logged in | My bookings |
| POST | `/bookings/:id/cancel` | Owner or admin | Cancel a booking |
| GET | `/admin/bookings` | Admin | All bookings |
| GET | `/admin/users` | Admin | All users (no passwords) |
| GET | `/admin/stats` | Admin | Totals for the dashboard |

## 5. Design decisions (useful for your report and viva)

- **MVC:** models hold the schemas, controllers hold the logic, routes map URLs to controllers.
- **Roles are enforced on the server.** Signup creates a customer unless Admin is chosen with the correct server-side `ADMIN_SIGNUP_CODE`. The first admin can also come from the seed script. Every protected request re-checks the token and loads the user from the database.
- **Passwords** are hashed with bcrypt. The signup form has no confirm-password field (as in the reference).
- **No card data is stored.** Storing card numbers or CVV is unsafe and not allowed by PCI-DSS. The booking screen says payment is collected at the hotel. A payment gateway (Stripe or Razorpay) is a future enhancement.
- **Pricing is calculated on the server:** nights = check-out minus check-in (23rd to 24th is 1 night), total = nights × rent. The client cannot set the price.
- **No double booking:** a new stay clashes with an existing booked stay if `existing.from < new.to AND existing.to > new.from`. Same-day check-out and check-in is allowed.
- **Frontend route guards** use the role inside the signed token. They only hide screens. The API is what actually protects the data.

### Future scope

Online payments (Stripe / Razorpay), email confirmations (Nodemailer), staff role and check-in / check-out, reviews and ratings, room image upload (Multer), admin reports and charts, multiple hotels.

## 6. Push to GitHub

Do this from the **project root** (the `hotelpro` folder that contains `backend`, `frontend` and `.gitignore`).

**One-time setup**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**1. Create an empty repository on GitHub**
github.com → **New repository** → name it `hotelpro` → leave "Add a README", ".gitignore" and "license" **unchecked** → **Create repository**. Copy the repository URL it shows, for example `https://github.com/<your-username>/hotelpro.git`.

**2. Commit and push**

```bash
cd hotelpro
git init
git add .
git status          # check: NO .env file and NO node_modules in the list
git commit -m "Initial commit: HotelPro MERN hotel booking system"
git branch -M main
git remote add origin https://github.com/<your-username>/hotelpro.git
git push -u origin main
```

**3. Sign in when Git asks.** GitHub no longer accepts your account password for pushes. Use one of:

- **GitHub CLI (easiest):** install from https://cli.github.com, run `gh auth login`, then push again.
- **Personal access token:** GitHub → Settings → Developer settings → Personal access tokens → generate a token with `repo` scope, and paste it when asked for the password.
- **SSH key:** add an SSH key in GitHub settings and use the `git@github.com:<your-username>/hotelpro.git` URL.

**4. Later changes**

```bash
git add .
git commit -m "Describe what you changed"
git push
```

**If you accidentally committed `.env`:** run `git rm --cached backend/.env` and commit again, then **change your `JWT_SECRET` and database password**, because the old values stay in Git history. Only `.env.example` (no real secrets) should be on GitHub.

Tip: add the repository link and a few screenshots to this README so your project looks complete to evaluators.

## 7. Troubleshooting

| Problem | Fix |
| --- | --- |
| `MongooseServerSelectionError` / `ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Start the service, or use an Atlas connection string |
| `JWT_SECRET is missing` / `MONGODB_CONNECTION_LINK is missing` | You have not created `backend/.env` from `.env.example` |
| Frontend shows network errors | Backend not running, or `VITE_API_URL` in `frontend/.env` is wrong. Restart `npm run dev` after editing `.env` |
| CORS error in the browser console | `CLIENT_URL` in `backend/.env` must match the frontend address exactly (`http://localhost:5173`) |
| Rooms page is empty | Run `npm run seed` in `backend`, or add rooms as admin |
| Logged out immediately, or 401 errors | Token expired (1 day), or you changed `JWT_SECRET`. Log in again |
| `EADDRINUSE: port 8000` | Another program uses the port. Change `PORT` in `backend/.env` and `VITE_API_URL` in `frontend/.env` |
| PowerShell says running scripts is disabled | Use Command Prompt or Git Bash, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |

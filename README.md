<div align="center">

<br />

```
███████╗██████╗ ██╗  ██╗███████╗███╗   ███╗███████╗██████╗  █████╗ ██╗
██╔════╝██╔══██╗██║  ██║██╔════╝████╗ ████║██╔════╝██╔══██╗██╔══██╗██║
█████╗  ██████╔╝███████║█████╗  ██╔████╔██║█████╗  ██████╔╝███████║██║
██╔══╝  ██╔═══╝ ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══╝  ██╔══██╗██╔══██║██║
███████╗██║     ██║  ██║███████╗██║ ╚═╝ ██║███████╗██║  ██║██║  ██║███████╗
╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

### *Say it. Share it. Forget it.*

**A real-time ephemeral chat room that burns itself after 60 minutes.**  
Text · Voice notes · Photos · Video — then nothing.

<br />

[![Live Demo](https://img.shields.io/badge/🔥_LIVE_DEMO-ephemeral--messenger.xyz-FF5E1F?style=for-the-badge&labelColor=0B0B13)](https://ephemeral-messenger.xyz)
[![GitHub](https://img.shields.io/badge/GitHub-mnvvshu%2Fephemeral--chat-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mnvvshu/ephemeral-chat)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

<br />

</div>

---

## What is Ephemeral?

Think **Snapchat for conversations**. You open a room, share a link, approve who gets in — and when the 60-minute timer hits zero, the server **permanently destroys** the room, the messages, and every uploaded file. No logs. No archive. No trace.

> *Every room you open burns itself clean after sixty minutes.*  
> *No logs. No history. Just the conversation.*

---

## ✦ Features

| | Feature | Detail |
|---|---|---|
| 🔥 | **Self-destructing rooms** | 60-minute timer. Server-side deletion. Unrecoverable. |
| 🚪 | **Host approval gate** | Guests knock — host admits or denies. You control the door. |
| 👥 | **Unlimited participants** | No seat cap. Invite as many as you want. |
| 💬 | **Real-time text** | Instant delivery with typing indicators and slide animations. |
| 🎙️ | **Voice notes** | Tap mic → record up to 2 min → send. MediaRecorder API. |
| 🖼️ | **Photos & video** | Images and video up to 25 MB with optional captions. |
| ⏱️ | **Live countdown** | Turns red at 5 minutes remaining. |
| 🧨 | **Burn early** | Host can end the room instantly with the End Chat button. |
| 🔐 | **Auth layer** | Supabase email/password for room creators. Guests need no account. |
| 🎨 | **Cinematic UI** | Dark purple · Orange flame accents · Fraunces + Inter + JetBrains Mono |

---

## 🖥️ Screenshots

<table>
<tr>
<td align="center" width="50%">

**Live Chat Room**

*Real-time messaging with countdown timer and END ROOM button*

</td>
<td align="center" width="50%">

**Login Page**

*"Welcome back to the flame." — Supabase auth, split layout*

</td>
</tr>
</table>

**Live URL:** [ephemeral-messenger.xyz](https://ephemeral-messenger.xyz)

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/mnvvshu/ephemeral-chat.git
cd ephemeral-chat

# Install
npm install

# Run
npm start

# Open
open http://localhost:3000
```

**That's it.** No `.env` file, no database setup, no build step.

---

## 🔄 How It Works

```
1. HOST opens ephemeral-messenger.xyz → clicks "Generate Link"
        │
        ▼
2. A unique room is created (10-char ID) + a secret host token (24-char)
   Timer starts immediately → T-60:00
        │
        ▼
3. HOST shares the link  →  /s/aBcD1234Xy
        │
        ▼
4. GUESTS click the link → enter a name → land in waiting room
        │
        ▼
5. HOST sees knock notification → clicks "Admit" or "Deny"
        │
        ▼
6. All admitted guests are now in the room → chat freely
   Text · Voice · Photos · Video
        │
        ▼
7. T = 0:00  →  server calls destroySession()
   ├── clearTimeout(timer)
   ├── fs.unlink() every uploaded file
   ├── io.to(room).emit("session:ended")
   └── sessions.delete(id)  ← gone from memory forever
```

---

## 📁 Project Structure

```
ephemeral-chat/
├── server.js              ← Entire backend (Express + Socket.IO)
├── package.json           ← express, socket.io, multer, nanoid
├── package-lock.json
├── .gitignore
├── README.md
└── public/
    ├── index.html         ← Landing page — generate link, hero, features
    ├── chat.html          ← Chat room — gate → waiting → messaging → end screen
    ├── login.html         ← Supabase sign-in
    ├── register.html      ← Supabase create-account
    ├── favicon.svg        ← Flame icon
    └── uploads/           ← Temp media storage (auto-deleted per session)
```

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.19.2 | HTTP server, static files, REST API |
| `socket.io` | ^4.7.5 | Real-time WebSocket events |
| `multer` | ^1.4.5-lts.1 | Multipart file upload handling |
| `nanoid` | ^3.3.7 | Cryptographically random session IDs |

### Frontend
- **Vanilla HTML/CSS/JS** — zero build step, zero framework
- **Inter** — UI body text and labels
- **Fraunces** — italic serif for all headings
- **JetBrains Mono** — monospace labels and timers
- **Socket.IO client** — served by the Express server
- **Supabase JS v2** — CDN-loaded for auth pages only

### Auth
- **Supabase** — email + password authentication
- Email uniqueness enforced at the database level
- JWT session auto-persisted in `localStorage`

---

## 🔌 API Reference

### REST Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/session` | — | Create a new room → returns `sessionId`, `hostToken`, `expiresAt` |
| `GET` | `/api/session/:id` | — | Check if session is alive |
| `POST` | `/api/session/:id/end` | hostToken | Host ends the session immediately |
| `POST` | `/api/upload/:sessionId` | — | Upload a file (max 25MB) |
| `GET` | `/s/:id` | — | Serve the chat room page |

### Socket.IO Events

**Client → Server**

| Event | Payload | Description |
|---|---|---|
| `session:host-join` | `{ sessionId, hostToken, name }` | Host enters room |
| `session:request` | `{ sessionId, name }` | Guest requests entry |
| `host:approve` | `{ socketId }` | Admit a waiting guest |
| `host:reject` | `{ socketId }` | Deny a waiting guest |
| `host:kick` | `{ socketId }` | Remove a participant |
| `message:send` | `{ type, text, media, caption }` | Send a message |
| `typing` | `{ typing: bool }` | Typing indicator |

**Server → Client**

| Event | Description |
|---|---|
| `session:joined` | You're in the room — includes participants and pending list |
| `session:pending` | You're in the waiting room |
| `session:rejected` | Host denied your request |
| `session:kicked` | You were removed by the host |
| `session:ended` | Room destroyed — reason: `expired` / `host_ended` / `host_left` |
| `host:request` | New guest is knocking (host only) |
| `participants:update` | Updated room roster broadcast |
| `message:new` | New message from any participant |
| `peer:typing` | Typing indicator from another user |

---

## ☁️ Deployment

Deployed on **[Render.com](https://render.com)** (free tier) at [ephemeral-messenger.xyz](https://ephemeral-messenger.xyz).

### Deploy your own

1. Fork this repo
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Fill in:
   ```
   Build command:  npm install
   Start command:  npm start
   Instance type:  Free
   ```
5. Click **Create Web Service** → live in ~2 minutes

**No environment variables needed.** The server auto-detects `process.env.PORT`.

### Push updates

```bash
git add .
git commit -m "your message"
git push origin main
# Render auto-deploys in ~60 seconds
```

---

## ⚙️ Session Internals

Sessions live **entirely in memory** — nothing touches a database.

```js
session = {
  id:             string,        // 10-char nanoid  (the URL)
  hostToken:      string,        // 24-char nanoid  (secret)
  hostSocketId:   string | null,
  createdAt:      number,        // Date.now()
  expiresAt:      number,        // createdAt + 3_600_000
  participants:   Map<socketId, { name, isHost }>,
  pending:        Map<socketId, { name }>,
  uploadedFiles:  Set<filepath>, // unlinked on destroy
  timer:          NodeJS.Timeout
}
```

**On destroy:**
```js
clearTimeout(session.timer)
session.uploadedFiles.forEach(f => fs.unlink(f))
io.to(sessionId).emit('session:ended', { reason })
sessions.delete(sessionId)
```

---

## 📋 Notes & Limits

| Constant | Value |
|---|---|
| Session TTL | 60 minutes |
| Max file size | 25 MB |
| Voice note cap | 2 minutes |
| Session ID | 10 chars (nanoid) |
| Host token | 24 chars (nanoid) |
| Timer warning | Turns red at 5 min |
| Participants | Unlimited (host-gated) |
| Persistence | None — in-memory only |

> **⚠️ Server restart = all rooms gone.** This is intentional — it matches the ephemeral nature of the app.

> **⚠️ Microphone** requires HTTPS. Works on the deployed URL. Use the live site for voice note testing.

---

## 🔐 Supabase Auth Setup

If you want the login/register pages to work on your own deployment:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** → copy your **Project URL** and **anon public key**
3. Replace the credentials in `public/login.html` and `public/register.html`
4. In **Authentication → Settings**, set **Site URL** to your deployed domain
5. Optionally disable email confirmation for instant sign-up: **Auth → Providers → Email → toggle off**

---

## 🗺️ Roadmap

- [ ] End-to-end encryption (client-side key exchange)
- [ ] Push notifications when a guest is waiting
- [ ] Configurable TTL (15 / 30 / 60 / 120 min)
- [ ] Read receipts
- [ ] Redis-backed session store for horizontal scaling
- [ ] Message reactions (also ephemeral)

---

## 📄 License

MIT — do whatever you want with it.

---

<div align="center">

**Built by [mnvvshu](https://github.com/mnvvshu) · VibeCoded with Claude**

*No logs. No archive. No trace.*

🔥

</div>

# EMBER — Ephemeral Chat ( VibeCoded )

A real-time two-person chat room that **self-destructs in 60 minutes**. Text, voice notes, images, and videos. No accounts, no archive, no trace.

## Features

- 🔥 **Generate a link** on the landing page — valid for 60 minutes
- 👥 **Two people join** with any nickname they want
- 💬 **Real-time text** with typing indicators
- 🎙️ **Voice notes** (tap the mic, speak, send)
- 🖼️ **Photos & videos** up to 25 MB (with optional caption)
- ⏱️ **Live countdown** in the room — turns red in the last 5 minutes
- 🧨 **Auto-purge** on expiry: messages + uploaded files are deleted from disk, and both clients see an "Into ashes" screen

## How to run

You need **Node.js 18+** installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open http://localhost:3000 in your browser
```

Click **Generate Link**, copy the URL, share it with one other person. Each of you enters a nickname, and you're chatting. When the timer hits zero, the room burns.

## Tech stack

- **Node.js + Express** — HTTP server
- **Socket.IO** — real-time messaging, typing, presence
- **Multer** — file upload handling (voice notes, images, videos)
- **Vanilla HTML/CSS/JS** on the frontend — no build step, fully custom UI
- **In-memory session store** — nothing is persisted to a database; uploaded files are deleted from disk when the session expires

## Project layout

```
ephemeral-chat/
├── server.js          # Express + Socket.IO server, session TTL logic
├── package.json
└── public/
    ├── index.html     # Landing page with "Generate Link"
    ├── chat.html      # The actual chat room
    └── uploads/       # Temporary media storage (auto-cleaned per session)
```

## Notes

- Sessions are capped at **2 participants**. A third person trying to join sees "Room is full."
- Voice notes are capped at **2 minutes** each.
- Files are capped at **25 MB** each.
- The server uses in-memory storage, so **all rooms are lost if the server restarts**. That's intentional — it matches the ephemeral nature of the app.
- For a production deploy you'd want: HTTPS, a real domain, and possibly Redis-backed sessions if you run multiple server instances.

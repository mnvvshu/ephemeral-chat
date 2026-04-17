/**
 * EPHEMERAL CHAT SERVER
 * - Generates a session link valid for 60 minutes
 * - Two users join with a nickname
 * - Real-time text, voice notes, images, and videos via Socket.IO
 * - Everything (messages + files) is wiped after 60 minutes
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 25 * 1024 * 1024 }); // 25MB for media

const PORT = process.env.PORT || 3000;
const SESSION_TTL_MS = 60 * 60 * 1000; // 60 minutes

// -----------------------------------------------------------------------------
// In-memory session store. Each session self-destructs at `expiresAt`.
// -----------------------------------------------------------------------------
const sessions = new Map();

function createSession() {
  const id = nanoid(10);
  const now = Date.now();
  const session = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    participants: new Map(), // socketId -> { nickname, joinedAt }
    messages: [],
    files: [], // track uploaded file paths so we can delete on expiry
    expiryTimer: null,
  };

  // Schedule the purge
  session.expiryTimer = setTimeout(() => destroySession(id, 'expired'), SESSION_TTL_MS);
  sessions.set(id, session);
  return session;
}

function destroySession(id, reason = 'expired') {
  const session = sessions.get(id);
  if (!session) return;

  // Notify any connected clients first
  io.to(id).emit('session:ended', { reason });

  // Disconnect every socket in the room
  const room = io.sockets.adapter.rooms.get(id);
  if (room) {
    for (const socketId of room) {
      const s = io.sockets.sockets.get(socketId);
      if (s) s.leave(id);
    }
  }

  // Delete any files uploaded during this session
  for (const filePath of session.files) {
    fs.unlink(filePath, () => {});
  }

  if (session.expiryTimer) clearTimeout(session.expiryTimer);
  sessions.delete(id);
  console.log(`[session] ${id} destroyed (${reason})`);
}

// -----------------------------------------------------------------------------
// File upload handling (images / videos / voice notes)
// -----------------------------------------------------------------------------
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${nanoid(12)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// -----------------------------------------------------------------------------
// HTTP routes
// -----------------------------------------------------------------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate a new session link
app.post('/api/session', (req, res) => {
  const session = createSession();
  res.json({
    id: session.id,
    expiresAt: session.expiresAt,
    url: `/s/${session.id}`,
  });
});

// Check session status (before joining)
app.get('/api/session/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found or expired' });
  res.json({
    id: session.id,
    expiresAt: session.expiresAt,
    participantCount: session.participants.size,
    full: session.participants.size >= 2,
  });
});

// Upload media inside an active session
app.post('/api/upload/:sessionId', upload.single('file'), (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    // Clean up orphan upload
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ error: 'Session not found or expired' });
  }
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  session.files.push(req.file.path);
  res.json({
    url: `/uploads/${req.file.filename}`,
    mimetype: req.file.mimetype,
    size: req.file.size,
    originalName: req.file.originalname,
  });
});

// Pretty session URL -> serves the chat page
app.get('/s/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Root -> landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// -----------------------------------------------------------------------------
// Socket.IO real-time logic
// -----------------------------------------------------------------------------
io.on('connection', (socket) => {
  let currentSessionId = null;
  let currentNickname = null;

  socket.on('session:join', ({ sessionId, nickname }, ack) => {
    const session = sessions.get(sessionId);
    if (!session) return ack?.({ ok: false, error: 'Session expired or not found' });
    if (session.participants.size >= 2) return ack?.({ ok: false, error: 'Session is full (2 people max)' });

    const clean = String(nickname || '').trim().slice(0, 24) || 'anonymous';
    session.participants.set(socket.id, { nickname: clean, joinedAt: Date.now() });
    currentSessionId = sessionId;
    currentNickname = clean;
    socket.join(sessionId);

    ack?.({
      ok: true,
      expiresAt: session.expiresAt,
      history: session.messages,
      participants: [...session.participants.values()].map((p) => p.nickname),
    });

    // Notify the other participant
    socket.to(sessionId).emit('peer:joined', { nickname: clean });
    io.to(sessionId).emit('participants:update', {
      participants: [...session.participants.values()].map((p) => p.nickname),
    });
  });

  socket.on('message:send', (payload) => {
    if (!currentSessionId) return;
    const session = sessions.get(currentSessionId);
    if (!session) return;

    const message = {
      id: nanoid(8),
      nickname: currentNickname,
      type: payload.type || 'text', // text | image | video | audio
      content: String(payload.content || '').slice(0, 4000),
      mediaUrl: payload.mediaUrl || null,
      mimetype: payload.mimetype || null,
      timestamp: Date.now(),
    };

    session.messages.push(message);
    io.to(currentSessionId).emit('message:new', message);
  });

  socket.on('typing', (isTyping) => {
    if (!currentSessionId) return;
    socket.to(currentSessionId).emit('peer:typing', { nickname: currentNickname, isTyping: !!isTyping });
  });

  socket.on('disconnect', () => {
    if (!currentSessionId) return;
    const session = sessions.get(currentSessionId);
    if (!session) return;
    session.participants.delete(socket.id);
    socket.to(currentSessionId).emit('peer:left', { nickname: currentNickname });
    io.to(currentSessionId).emit('participants:update', {
      participants: [...session.participants.values()].map((p) => p.nickname),
    });
  });
});

server.listen(PORT, () => {
  console.log(`Ephemeral chat running → http://localhost:${PORT}`);
});

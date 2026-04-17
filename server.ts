import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Real-time Neighborhood Hub Logic
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_neighborhood', (userData) => {
      activeUsers.set(socket.id, { ...userData, id: socket.id });
      io.emit('neighbor_list', Array.from(activeUsers.values()));
      socket.broadcast.emit('neighbor_joined', userData);
    });

    socket.on('move', (position) => {
      const user = activeUsers.get(socket.id);
      if (user) {
        user.position = position;
        socket.broadcast.emit('neighbor_moved', { id: socket.id, position });
      }
    });

    socket.on('send_message', (msg) => {
      socket.broadcast.emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      io.emit('neighbor_list', Array.from(activeUsers.values()));
      console.log('User disconnected:', socket.id);
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Neo-Kin Server running at http://localhost:${PORT}`);
  });
}

startServer();

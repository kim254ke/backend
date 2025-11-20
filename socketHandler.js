import { Server } from "socket.io";

export const setupSocketIO = (httpServer) => {
  // --- CRITICAL SOCKET.IO CORS CONFIGURATION FIX ---
  // The allowed origins must match the list in server.js
  const allowedOrigins = [
    // 1. **REQUIRED FIX:** Your new active Render frontend URL
    "https://client-s58d.onrender.com", 
    
    // 2. Fallback for your previous Vercel deployment
    "https://client-8q8n30cor-kim254kes-projects.vercel.app", 
    
    // 3. Local development ports 
    "http://localhost:3000",
    "http://localhost:5173", 

    // 4. Use environment variable for flexibility 
    process.env.CLIENT_URL,
  ].filter(url => url); 
    
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"], // Standard methods used by sockets
      credentials: true
    }
  });

  // --- Socket.IO Connection Logic ---

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Example of joining a chat or notification room (e.g., for a specific user ID)
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle real-time messaging, if applicable
    socket.on('sendMessage', (data) => {
      // Broadcast the message to all clients in the room
      io.to(data.roomId).emit('receiveMessage', data.message);
    });

    // Handle custom events, like a booking update notification
    socket.on('bookingUpdate', (data) => {
        // Example: Notify a specific user or stylist room of a booking status change
        io.to(`user-${data.userId}`).emit('newNotification', { message: 'Your booking status has changed.' });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
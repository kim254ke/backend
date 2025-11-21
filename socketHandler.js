// socketHandler.js - Add this to your backend
import { Server } from "socket.io";

// Automated responses based on keywords
const getAutomatedResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  // Service inquiries
  if (lowerMsg.includes("manicure") || lowerMsg.includes("nails")) {
    return "Our manicure service is amazing! 💅 We offer classic manicures starting at KSh 800, gel manicures, and nail art. Would you like to book an appointment?";
  }
  
  if (lowerMsg.includes("pedicure") || lowerMsg.includes("feet")) {
    return "We have luxurious pedicure services! 🦶✨ Treat your feet to some pampering. Prices start at KSh 1000. Interested in booking?";
  }
  
  if (lowerMsg.includes("hair") || lowerMsg.includes("braids") || lowerMsg.includes("dreadlocks")) {
    return "Our hair services are top-notch! 💇‍♀️ We do braids, dreadlocks, weaves, and more. What style are you thinking about?";
  }
  
  if (lowerMsg.includes("massage") || lowerMsg.includes("spa")) {
    return "Yess queen! 👑 Our full body massage is so relaxing. Perfect for unwinding after a long day. KSh 2500 for 60 minutes. Should I book you in?";
  }
  
  if (lowerMsg.includes("facial") || lowerMsg.includes("skin")) {
    return "Our facials are incredible for your skin! ✨ We customize treatments based on your skin type. Prices start at KSh 1500. Want to know more?";
  }
  
  if (lowerMsg.includes("waxing")) {
    return "We offer professional waxing services in a comfortable, private setting. 🌸 Full body, legs, arms, bikini - we've got you covered! Prices vary by area.";
  }

  // Pricing
  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("how much")) {
    return "Our prices are very competitive! 💰 Services range from KSh 500 to KSh 3000. What specific service are you interested in? I can give you exact pricing!";
  }

  // Booking
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment") || lowerMsg.includes("schedule")) {
    return "Booking is super easy! 📅 Just click on 'Book Service' at the top of the page, choose your service, pick a date and time, and you're all set! Need help with that?";
  }

  // Hours
  if (lowerMsg.includes("open") || lowerMsg.includes("hours") || lowerMsg.includes("time")) {
    return "We're open Monday to Saturday, 9 AM to 7 PM, and Sundays 10 AM to 5 PM. ⏰ What day works best for you?";
  }

  // Location
  if (lowerMsg.includes("location") || lowerMsg.includes("where") || lowerMsg.includes("address")) {
    return "We're located in Nairobi! 📍 Our exact address will be shared when you book. We're easily accessible and can't wait to see you!";
  }

  // Greetings
  if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
    return "Hey babe! 💕 So glad you're here! What can I help you with today?";
  }

  // Thank you
  if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
    return "You're so welcome hun! 🥰 Anything else you'd like to know?";
  }

  // Default response
  return "That's a great question! 🤔 Our team can give you more details. You can also browse our services page or book a consultation. What would you like to know more about?";
};

export const setupSocketIO = (httpServer) => {
  // CORS Configuration
  const allowedOrigins = [
    "https://client-s58d.onrender.com", 
    "https://client-8q8n30cor-kim254kes-projects.vercel.app", 
    "http://localhost:3000",
    "http://localhost:5173", 
    process.env.CLIENT_URL,
  ].filter(Boolean); 
    
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.IO Connection Logic
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Handle user messages for chatbot
    socket.on('userMessage', (message) => {
      console.log(`💬 User message from ${socket.id}:`, message);
      
      // Get automated response
      const botResponse = getAutomatedResponse(message);
      
      console.log(`🤖 Bot response:`, botResponse);
      
      // Send response back after a short delay (simulate typing)
      setTimeout(() => {
        socket.emit('botMessage', botResponse);
      }, 1000);
    });

    // Example: Join a room (for user-specific notifications)
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`🚪 Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle real-time messaging between users
    socket.on('sendMessage', (data) => {
      io.to(data.roomId).emit('receiveMessage', data.message);
      console.log(`📨 Message sent to room ${data.roomId}`);
    });

    // Handle booking update notifications
    socket.on('bookingUpdate', (data) => {
      io.to(`user-${data.userId}`).emit('newNotification', { 
        message: 'Your booking status has changed.' 
      });
      console.log(`🔔 Booking notification sent to user ${data.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 Socket.IO setup complete');
  return io;
};
// import http from 'http';
// import { Server } from 'socket.io';
// import { createLiveUser, removeLiveUser } from "./modules/live-users/live.users.service";
// import { Express } from "express";
// import Logger from './utils/logger';

// export const bootSocket = (app: Express) => {
//   const httpServer = http.createServer(app); // Create an HTTP httpServer

//   const logger = new Logger('exception-handler');
//   const io = new Server(httpServer, {
//     cors: {
//       origin: '*',
//       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     },
//   });

//   io.on('connection', (socket) => {
//     const userId = socket.handshake.query.userId; // Assuming you pass userId as a query parameter during connection
//     logger.log(`A user connected : ${userId}`, {});
//     // Create a private room for the user
//     socket.join(userId);
//     let companyId: string | null = null


//     socket.on('join-company-group', async (data) => {

//       //leave previous room
//       if (companyId !== null) {
//         const { users, count } = await removeLiveUser({ userId: userId as string, companyId })
//         socket.broadcast.to(companyId).emit('user-logged-out', { data: users, count });
//         socket.leave(companyId);
//       }

//       const companyRoom = data?.companyId;
//       companyId = companyRoom // set prev room

//       socket.join(companyRoom)

//       logger.log(`User ${userId} joined ${companyRoom}`, {})

//       const { users, count } = await createLiveUser(data)
//       io.to(companyRoom).emit('live-users', { data: users, count })
//     })

//     // Listen for the logout event
//     socket.on('logout', async () => {
//       logger.log(`User ${userId} logged out`, {});
//       const { users, count } = await removeLiveUser({ userId: userId as string, companyId })
//       if (companyId !== null) {
//         io.to(companyId).emit('user-logged-out', { data: users, count });
//       }
//       // Handle the disconnection
//       socket.disconnect();
//     });

//     // Listen for disconnection
//     socket.on('disconnect', async () => {
//       logger.log(`A user disconnected : ${userId}`, {});

//       // Get the list of rooms the socket is currently in
//       const rooms = Object.keys(socket.rooms);
//       const { users, count } = await removeLiveUser({ userId: userId as string, companyId })
//       io.to(companyId).emit('user-logged-out', { data: users, count });

//       // Leave all rooms except for the default room (socket.id)
//       rooms.forEach((room) => {
//         if (room !== socket.id) {
//           socket.leave(room);
//           logger.log(`Socket left room: ${room}`, {});
//         }
//       });
//     });
//   });

//   return { io, httpServer }
// }

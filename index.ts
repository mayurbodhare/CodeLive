import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ACTIONS from "./src/Actions";
import { log } from "node:console";

const app = express();

const server = createServer(app);

const io = new Server(server);

const userSocketMap: { [key: string]: string } = {};

let code = "";

function getAllConnectedClients(roomId: string) {
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketId) => {
			return {
				socketId,
				userName: userSocketMap[socketId],
			};
		},
	);
}

io.on("connection", (socket) => {
	socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
		userSocketMap[socket.id] = userName;
		socket.join(roomId);
		const clients = getAllConnectedClients(roomId);
		for (const { socketId } of clients) {
			io.to(socketId).emit(ACTIONS.JOINED, {
				clients,
				userName,
				socketId: socket.id,
			});
		}
	});

	socket.on(ACTIONS.CODE_CHANGE, ({ roomId, value }) => {
        code = value;
		socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
			value,
		});
	});

	socket.on(ACTIONS.SYNC_CODE, ({ socketId, value }) => {
		io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
			value : code,
		});
	});

	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		for (const room of rooms) {
			socket.in(room).emit(ACTIONS.DISCONNECTED, {
				socketId: socket.id,
				userName: userSocketMap[socket.id],
			});
			socket.leave(room);
		}
		delete userSocketMap[socket.id];
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

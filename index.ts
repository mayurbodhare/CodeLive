import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ACTIONS from "./src/Actions";
import { log } from "node:console";
import path from "node:path";

const app = express();

const server = createServer(app);

const io = new Server(server);

app.use(express.static('dist'));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "dist", "index.html")); // This is the line that sends the index.html file to the browser
})

const userSocketMap: { [key: string]: string } = {};
const codeSocketMap: { [key: string]: string } = {};

// let code = "";

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
		// console.log("ACTIONs_JOIN", 'RoomId :', roomId);
		// console.log("ACTIONs_JOIN",'socket.id :', socket.id);
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
		// console.log("ACTIONs_CODE_CHANGE",'RoomId :', roomId);
		// console.log("ACTIONs_CODE_CHANGE",'socket.id :', socket.id);
        // code = value;
		codeSocketMap[roomId] = value;
		socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
			value,
		});
	});

	socket.on(ACTIONS.SYNC_CODE, ({ socketId, value, roomId }) => {
		// console.log("ACTIONs_SYNC_CODE", 'SocketId :', socketId);
		// console.log("ACTIONs_SYNC_CODE", 'socket.id :',socket.id);
		io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
			value : codeSocketMap[roomId],
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

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import Client from "../componets/Client";
import Editor from "../componets/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
	const location = useLocation();
	const { roomId } = useParams();
	const reactNavigator = useNavigate();

	const socketRef = useRef<Socket | null>(null);
	const codeRef = useRef("");
	const [clients, setClients] = useState<{ socketId: string; userName: string }[]>([]);

	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();
			socketRef.current.on("connect_error", (err: Error) => handleErrors(err));

			socketRef.current.on("connect_failed", (err: Error) => handleErrors(err));

			function handleErrors(e: Error) {
				console.error("socket error", e);
				toast.error("Socket connection failed, try again later.");
				reactNavigator("/");
			}

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				userName: location.state?.userName,
			});

			// Listening for joined event
			socketRef.current.on(
				ACTIONS.JOINED,
				({ clients, userName, socketId }) => {
					if (userName !== location.state?.userName) {
						toast.success(`${userName} joined the room`);
					}
					setClients(clients);
					socketRef.current?.emit(ACTIONS.SYNC_CODE, {
						value: codeRef.current,
						socketId,
					});
				},
			);

			// Listening for disconnected event
			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
				toast.success(`${userName} left the room`);
				setClients((prev) =>
					prev.filter((client) => client.socketId !== socketId),
				);
			});
		};

		init();

		return () => {
			socketRef.current?.disconnect();
			socketRef.current?.off(ACTIONS.JOINED);
			socketRef.current?.off(ACTIONS.DISCONNECTED);
		};
	}, [roomId, location.state?.userName, reactNavigator]);

	if (!location.state) {
		<Navigate to="/" />;
	}

	async function copyRoomId(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> {
		try {
			event.stopPropagation();
			await navigator.clipboard.writeText(roomId || "");
			toast.success("Room ID has been copied to your clipboard");
		} catch (error) {
			toast.error("Room ID cannot copied to your clipboard");
			console.log(error);
		}
	}

	function leaveRoom(): void {
		reactNavigator("/");
	}

	return (
		<div className="mainWrap">
			<div className="aside">
				<div className="asideInner">
					<div className="logo">
						<img
							className="logoImage"
							src="/code-sync-logo.png"
							alt="code-sync"
						/>
					</div>

					<h3>Connected</h3>
					<div className="clientsList">
						{clients.map((client) => (
							<Client
								key={clients.indexOf(client)}
								userName={client.userName}
							/>
						))}
					</div>
				</div>
				<button className="btn copyBtn" type="button" onClick={copyRoomId}>
					Copy ROOM ID
				</button>
				<button className="btn leaveBtn" type="button" onClick={leaveRoom}>
					Leave
				</button>
			</div>
			<div className="editorWrap">
				<Editor
					socketRef={socketRef}
					roomId={roomId}
					onCodeChange={(code) => {
						codeRef.current = code;
					}}
				/>
			</div>
		</div>
	);
};

export default EditorPage;

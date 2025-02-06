import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {
	const navigate = useNavigate();

	const [roomId, setRoomId] = useState("");
	const [userName, setUserName] = useState("");

	function createNewRoom(event: React.MouseEvent<HTMLAnchorElement>): void {
		event.preventDefault();
		const id = uuidv4();
		setRoomId(id);
		toast.success("Created a new room");
	}

	function joinRoom(): void {
		if (!roomId || !userName) {
			toast.error("ROOM ID & USER NAME is required");
			return;
		}

		// redirect
		navigate(`/editor/${roomId}`, { state: { userName } });
	}

    function handleEnterInput(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            joinRoom();
        }
    }

	return (
		<div className="homePageWrapper">
			<div className="formWrapper">
				<div className="logoContainer">
					<img
						className="homePageLogo"
						src="/CodeLive.jpg"
						alt="code-sync-logo"
					/>
				</div>
					
				<h4 className="mainLabel"> Paste invitation room Id</h4>
				<div className="inputGroup">
					<input
						type="text"
						className="inputBox"
						placeholder="ROOM ID"
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleEnterInput}
					/>
					<input
						type="text"
						className="inputBox"
						placeholder="USER NAME"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
                        onKeyUp={handleEnterInput}
					/>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button className="btn joinBtn" onClick={joinRoom}>
						Join
					</button>
					<span className="">
						If you don't have an invite then create &nbsp;{" "}
						{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
						<a onClick={createNewRoom} href="#" className="createNewBtn">
							New Room
						</a>
					</span>
				</div>
			</div>
			<footer>
				<h4>
					Built with 💛 by &nbsp;
					<a href="https://github.com/mayurbodhare">Mayur Bodhare</a>
				</h4>
			</footer>
		</div>
	);
};

export default HomePage;

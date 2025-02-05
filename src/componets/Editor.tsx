import { Editor } from "@monaco-editor/react";
import React, { type MutableRefObject, useEffect } from "react";
import type { Socket } from "socket.io-client";
import ACTIONS from "../Actions";

const EditorComponent = ({
	socketRef,
	roomId,
	onCodeChange,
}: {
	socketRef: MutableRefObject<Socket | null>;
	roomId: string | undefined;
	onCodeChange: (value: string) => void;
}) => {
	const [editorValue, setEditorValue] = React.useState("// start from here");

	useEffect(() => {
		if (socketRef.current) {
			socketRef.current?.on(
				ACTIONS.CODE_CHANGE,
				({ value }: { value: string }) => {
					if (value !== null) {
						setEditorValue(value);
					}
				},
			);
		}

		return () => {
			socketRef.current?.off(ACTIONS.CODE_CHANGE);
		};
	}, [socketRef.current]);

	const handleEditorChange = (
		value: string | undefined,
	) => {
		onCodeChange(value as string);
		socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
			roomId,
			value,
		});
	};

	return (
		<div>
			<Editor
				height="100vh"
				width="100vw"
				defaultLanguage="javascript"
				theme="vs-dark"
				value={editorValue}
				options={{
					fontSize: 20,
					wordWrap: "on",
					automaticLayout: true,
					padding: {
						top: 20,
					},
				}}
				onChange={handleEditorChange}
			/>
		</div>
	);
};

export default EditorComponent;

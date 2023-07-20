import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MultiplayerMenu from "../components/multiplayer/MultiplayerMenu";
import OpponentPlayArea from "../components/multiplayer/OpponentPlayArea";
import OpponentReconnectionTimer from "../components/multiplayer/OpponentReconnectionTimer";
import GameStats from "../components/tetris/GameStats";
import SingleTetromino from "../components/tetris/SingleTetromino";
import TetrisPlayArea from "../components/tetris/TetrisPlayArea";
import { useSnack } from "../contexts/SnackProvider";
import useTetrisStates, { TetroUnit } from "../hooks/useTetrisStates";

export type OpponentGameState = {
	playArea: number[][];
	score: number;
	clearedLines: number;
	nextTetromino: TetroUnit[][];
	gameOver: boolean;
};

export default function MultiplayerAlpha() {
	const {
		holdTetro,
		score,
		totalClearedLines,
		playArea,
		landed,
		isPlaying,
		gameOver,
		setIsPlaying,
		resetGame,
		nextTetro,
		tetro,
		InsertTrashLine,
		getNewPlayArea,
		RecieveGameState,
	} = useTetrisStates();

	const [gameId, setGameId] = useState("");
	const [connection, setConnection] = useState<HubConnection | null>(null);
	const [opponentGameState, setOpponentGameState] = useState<OpponentGameState>(
		{
			playArea: getNewPlayArea(),
			score: 0,
			clearedLines: 0,
			nextTetromino: [[{ color: 0, position: { x: 5, y: 0 } }]],
			gameOver: false,
		}
	);
	const [mirroredTetro, setMirroredTetro] = useState<TetroUnit[][]>([
		[{ color: 0, position: { x: 5, y: 0 } }],
	]);
	const [opponentReadyStatus, setOpponentReadyStatus] = useState(false);
	const [startGameCountDown, setStartGameCountDown] = useState(false);
	const [playerReadyStatus, setPlayerReadyStatus] = useState(false);
	const [opponentConnected, setOpponentConnected] = useState(false);
	const [awaitReconnection, setAwaitReconnection] = useState(false);

	const prevTotalClearedLines = useRef(0);
	const opponentConnectedRef = useRef(opponentConnected);
	const resetGameRef = useRef(false);

	const { urlGameId } = useParams();
	const { snack } = useSnack();

	useEffect(() => {
		connection?.invoke("SendReadinessStatus", playerReadyStatus, gameId);
	}, [playerReadyStatus]);

	useEffect(() => {
		const newConnection = new HubConnectionBuilder()
			.withUrl("https://localhost:7076/multiplayerHub")
			.build();
		setConnection(newConnection);
		return () => {
			connection?.stop();
		};
	}, []);

	useEffect(() => {
		if (opponentConnectedRef.current && !opponentConnected) {
			snack({
				message: "Opponent disconnected",
				severity: "error",
			});
			setIsPlaying(false);

			if (!gameOver && !opponentGameState.gameOver) {
				setAwaitReconnection(true);
				setStartGameCountDown(false);
			}
		}

		if (awaitReconnection && opponentConnected) {
			connection?.invoke(
				"TransferGameState",
				opponentGameState,
				mirroredTetro,
				gameId
			);
			connection?.invoke(
				"SendGameData",
				{
					playArea: landed,
					score: score,
					clearedLines: totalClearedLines,
					nextTetromino: nextTetro,
					gameOver: gameOver,
				},
				gameId
			);
			setAwaitReconnection(false);
			resetGameRef.current = false;
		}

		opponentConnectedRef.current = opponentConnected;
	}, [opponentConnected]);

	useEffect(() => {
		if (opponentGameState.gameOver || gameOver) {
			setIsPlaying(false);
			setStartGameCountDown(false);
		}
	}, [opponentGameState.gameOver, gameOver]);

	useEffect(() => {
		if (startGameCountDown && resetGameRef.current) {
			resetGame();
		}
	}, [startGameCountDown]);

	useEffect(() => {
		const onReceiveGameData = (data: OpponentGameState) =>
			setOpponentGameState(data);

		const onReceiveTetromino = (data: TetroUnit[][]) => setMirroredTetro(data);

		const onReceiveTrashLine = () => InsertTrashLine();

		const onOpponentReadyStatus = (data: boolean) =>
			setOpponentReadyStatus(data);

		const onStartCountDown = () => setStartGameCountDown(true);

		const onOpponentConnected = (data: boolean) => setOpponentConnected(data);

		const onNewGameId = (data: string) => setGameId(data);

		const onRecieveGameState = (
			data: OpponentGameState,
			tetro: TetroUnit[][]
		) => RecieveGameState(data, tetro);

		if (connection) {
			connection
				.start()
				.then(() => {
					if (urlGameId) {
						connection.invoke("JoinGame", urlGameId);
						setGameId(urlGameId);
					}
					connection.on("ReceiveGameData", onReceiveGameData);
					connection.on("ReceiveTetromino", onReceiveTetromino);
					connection.on("ReceiveTrashLine", onReceiveTrashLine);
					connection.on("OpponentReadyStatus", onOpponentReadyStatus);
					connection.on("StartCountDown", onStartCountDown);
					connection.on("OpponentConnected", onOpponentConnected);
					connection.on("NewGameId", onNewGameId);
					connection.on("RecieveGameState", onRecieveGameState);
				})
				.catch(() =>
					snack({
						message: "Connection to server failed",
						severity: "error",
					})
				);

			return () => {
				connection.off("ReceiveGameData", onReceiveGameData);
				connection.off("ReceiveTetromino", onReceiveTetromino);
				connection.off("ReceiveTrashLine", onReceiveTrashLine);
				connection.off("OpponentReadyStatus", onOpponentReadyStatus);
				connection.off("StartCountDown", onStartCountDown);
				connection.off("OpponentConnected", onOpponentConnected);
				connection.off("NewGameId", onNewGameId);
				connection.off("RecieveGameState", onRecieveGameState);
			};
		}
	}, [connection]);

	useEffect(() => {
		for (
			let clearedLinesDelta = prevTotalClearedLines.current + 1;
			clearedLinesDelta <= totalClearedLines;
			clearedLinesDelta++
		) {
			if (clearedLinesDelta % 4 === 0) {
				connection?.invoke("SendTrashLine", gameId);
				break;
			}
		}
		prevTotalClearedLines.current = totalClearedLines;
	}, [totalClearedLines]);

	useEffect(() => {
		connection?.invoke(
			"SendGameData",
			{
				playArea: landed,
				score: score,
				clearedLines: totalClearedLines,
				nextTetromino: nextTetro,
				gameOver: gameOver,
			},
			gameId
		);
	}, [nextTetro, gameOver]);

	useEffect(() => {
		connection?.invoke("SendTetromino", tetro, gameId);
	}, [tetro]);

	return (
		<Box className="flex w-full justify-center h-19/20 max-w-full">
			<Box className="flex">
				<Box
					className={`
						${startGameCountDown ? "opacity-100 max-w-[250px]" : "opacity-0 max-w-0"} 
						transition-all duration-2500 ease-in-out inline-flex flex-col justify-between`}
				>
					<SingleTetromino
						isPlaying={isPlaying}
						align="right"
						tetro={opponentGameState.nextTetromino}
						title="next"
					/>
					<Box className="h-2/4 w-2/3">
						<OpponentPlayArea
							landed={opponentGameState.playArea}
							tetro={mirroredTetro}
							getNewPlayArea={getNewPlayArea}
							isPlaying={isPlaying}
						/>
					</Box>

					<GameStats
						score={opponentGameState.score}
						clearedLines={opponentGameState.clearedLines}
						variant="right"
						title="Opponent"
					/>
				</Box>
				<Box className="w-3/5 flex">
					<Box className="flex flex-col place-content-between ">
						<SingleTetromino
							isPlaying={isPlaying}
							title="hold"
							align="left"
							tetro={holdTetro}
						/>

						<GameStats
							score={score}
							clearedLines={totalClearedLines}
							variant="left"
							title="Player"
						/>
					</Box>
					<Box className="relative flex flex-col h-full">
						<TetrisPlayArea
							playArea={playArea}
							landed={landed}
							isPlaying={isPlaying}
							getNewPlayArea={getNewPlayArea}
						>
							<MultiplayerMenu
								showMenu={!isPlaying}
								gameOver={gameOver}
								setIsPlaying={setIsPlaying}
								startGameCountDown={startGameCountDown}
								opponentReadyStatus={opponentReadyStatus}
								readyStatus={playerReadyStatus}
								setReadyStatus={setPlayerReadyStatus}
								opponentConnected={opponentConnected}
								gameId={gameId}
								createNewGame={() => connection?.invoke("CreateNewGame")}
								joinGame={(gameId: string) => {
									setGameId(gameId);
									connection?.invoke("JoinGame", gameId);
								}}
								opponentGameOver={opponentGameState.gameOver}
								resetGameRef={resetGameRef}
							/>
						</TetrisPlayArea>
						<OpponentReconnectionTimer awaitReconnection={awaitReconnection} />
					</Box>

					<SingleTetromino
						isPlaying={isPlaying}
						title="next"
						align="right"
						tetro={nextTetro}
					/>
				</Box>
			</Box>
		</Box>
	);
}

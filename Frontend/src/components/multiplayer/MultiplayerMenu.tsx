import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
	Box,
	Button,
	Chip,
	Paper,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useSnack } from "../../contexts/SnackProvider";
import GameIdInput from "./GameIdInput";

interface Props {
	showMenu: boolean;
	setIsPlaying: Dispatch<boolean>;
	gameOver: boolean;
	startGameCountDown: boolean;
	opponentReadyStatus: boolean;
	readyStatus: boolean;
	setReadyStatus: Dispatch<SetStateAction<boolean>>;
	opponentConnected: boolean;
	gameId: string;
	createNewGame: () => void;
	joinGame: (gameId: string) => void;
	opponentGameOver: boolean;
	resetGameRef: MutableRefObject<boolean>;
}
export default function MultiplayerMenu({
	showMenu,
	setIsPlaying,
	gameOver,
	startGameCountDown,
	opponentReadyStatus,
	readyStatus,
	setReadyStatus,
	opponentConnected,
	gameId,
	createNewGame,
	joinGame,
	opponentGameOver,
	resetGameRef,
}: Props) {
	const [gameActive, setGameActive] = useState(false);
	const delayBeforeStartSeconds = 5;
	const { snack } = useSnack();

	useEffect(() => {
		if (!gameActive && !showMenu) {
			setGameActive(true);
		}
	}, [showMenu]);

	async function handleCodeCopy() {
		await navigator.clipboard.writeText(gameId);
		snack({
			message: `Code "${gameId}" copied to clipboard`,
		});
	}

	async function handleUrlCopy() {
		await navigator.clipboard.writeText(`${location.href}/${gameId}`);
		snack({
			message: "Url copied to clipboard",
		});
	}

	return (
		<Box
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-9/12 h-5/6 flex flex-col justify-center items-center bg-gradient-to-b from-gray-600 to-gray-800 rounded"
		>
			{gameId === "" ? (
				<Box className="w-5/6">
					<Box className="flex flex-col gap-3">
						<Paper
							elevation={5}
							className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100"
						>
							<GameIdInput joinGame={joinGame} />
						</Paper>
						<Paper elevation={5} className="bg-gray-600">
							<Typography>Or</Typography>
						</Paper>
						<Paper
							elevation={5}
							className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100"
						>
							<Button variant="outlined" onClick={createNewGame}>
								<Typography>New game</Typography>
							</Button>
						</Paper>
					</Box>
				</Box>
			) : (
				<>
					{!gameOver && !opponentGameOver ? (
						<Box>
							<Paper
								elevation={5}
								className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100 w-11/12 m-auto p-3 mb-3 flex flex-col"
							>
								<Box className="flex items-center justify-between mb-3">
									<Typography variant="h6">GameId</Typography>
									<TextField
										disabled
										value={gameId}
										className="w-3/6"
										inputProps={{
											style: { textAlign: "center", fontSize: 15 },
										}}
									/>
								</Box>
								<Box className="flex justify-between">
									<Button variant="outlined" onClick={handleUrlCopy}>
										<Typography>Url</Typography>
										<ContentCopyIcon className="ml-2" />
									</Button>
									<Button variant="outlined" onClick={handleCodeCopy}>
										<Typography>Code</Typography>
										<ContentCopyIcon className="ml-2" />
									</Button>
								</Box>
							</Paper>
							<Paper
								elevation={5}
								className={`${
									startGameCountDown
										? "opacity-100 max-h-[300px] mb-3"
										: "opacity-0 max-h-0 -mb-3"
								} transition-all duration-1000 ease-in-out overflow-hidden bg-gray-600 w-11/12 m-auto p-3 flex justify-center`}
							>
								<CountdownCircleTimer
									isPlaying={startGameCountDown}
									key={startGameCountDown ? "new props" : "reset timer"}
									duration={delayBeforeStartSeconds}
									colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
									colorsTime={[7, 5, 2, 0]}
									onComplete={() => {
										setIsPlaying(true);
										setReadyStatus(false);
									}}
								>
									{({ remainingTime }) => (
										<Box>
											<Typography className="mb-6" variant="overline">
												Get ready!
											</Typography>
											<Typography variant="body1">{remainingTime}</Typography>
										</Box>
									)}
								</CountdownCircleTimer>
							</Paper>

							<Paper
								elevation={5}
								className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100 w-11/12 m-auto p-3"
							>
								<Box className="flex items-center w-full justify-between">
									<Typography>Opponent status </Typography>
									{opponentConnected ? (
										<Chip
											className="text-white"
											label="Connected"
											color="primary"
										/>
									) : (
										<Chip label="Absent" color="error" />
									)}
								</Box>
								<Box className="flex items-center w-full justify-between">
									<Typography>Ready?</Typography>
									<Switch
										checked={readyStatus || startGameCountDown}
										onChange={(e) => setReadyStatus(e.target.checked)}
										color="primary"
										disabled={startGameCountDown || !opponentConnected}
									/>
								</Box>
								<Box className="flex items-center w-full justify-between">
									<Typography>Opponent</Typography>
									<Switch
										checked={opponentReadyStatus || startGameCountDown}
										disabled
										color="primary"
									/>
								</Box>
							</Paper>
						</Box>
					) : (
						<Box className="w-11/12">
							<Box className="mb-3">
								<Typography variant="h4">
									{opponentGameOver ? "You win!" : "You lose!"}
								</Typography>
							</Box>
							<Paper
								elevation={5}
								className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100 w-11/12 m-auto p-3 mb-3 flex flex-col"
							>
								<Box className="flex flex-col items-center w-full justify-between">
									<Typography className="mb-3">Rematch status </Typography>
									{opponentConnected ? (
										opponentReadyStatus ? (
											<Chip
												className="text-white"
												label="Requested"
												color="primary"
											/>
										) : (
											<Chip
												className="text-white"
												label="Pending"
												color="warning"
											/>
										)
									) : (
										<Chip label="Declined" color="error" />
									)}
								</Box>
							</Paper>
							<Paper
								elevation={5}
								className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100 w-11/12 m-auto p-3 mb-3 flex flex-col"
							>
								<Box className="flex flex-col items-center w-full justify-between">
									<Typography className="mb-3">Rematch?</Typography>
									<Box className="flex justify-around w-full">
										<Button
											onClick={() => {
												resetGameRef.current = true;
												setReadyStatus(true);
											}}
											variant="outlined"
										>
											<Typography>Yes</Typography>
										</Button>
										<Button
											onClick={() => setReadyStatus(false)}
											variant="outlined"
											color="error"
										>
											<Typography>No</Typography>
										</Button>
									</Box>
								</Box>
							</Paper>
						</Box>
					)}
				</>
			)}
		</Box>
	);
}

import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { axiosClient } from "../../hooks/client";
import useLocalStorage from "../../hooks/useLocalStorage";
import { LocalHighScore } from "../../models/HighScore";

interface Props {
	showMenu: boolean;
	setIsPlaying: React.Dispatch<boolean>;
	playAgain: () => void;
	gameOver: boolean;
	score: number;
	resumeGame: boolean;
}
export default function TetrisMenu({
	showMenu,
	setIsPlaying,
	playAgain,
	gameOver,
	score,
	resumeGame,
}: Props) {
	const [highscorePosted, setHighscorePosted] = useState(false);
	const { isLoggedIn, user } = useUser();
	const client = useQueryClient();

	const [localHighScores, setLocalHighScores] = useLocalStorage<
		LocalHighScore[]
	>("localHighscores", [] as LocalHighScore[]);

	const displayScore = isLoggedIn
		? user.highScores.map((h) => ({ score: h.score, achievedAt: h.achievedAt }))
		: localHighScores.slice(0, 5);

	const postSingInRequest = useMutation(
		["logIn"],
		async () =>
			await axiosClient.post(
				"v1/highscore/",
				JSON.stringify({
					userId: user.id,
					score,
				})
			),
		{
			onSuccess: () => {
				client.invalidateQueries(["user"]);
				setHighscorePosted(true);
			},
			onError: () => {},
		}
	);

	useEffect(() => {
		if (gameOver && !highscorePosted) {
			if (isLoggedIn) {
				postSingInRequest.mutate();
			} else {
				setLocalHighScores(
					[
						...localHighScores,
						{ score, achievedAt: new Date().toLocaleString() },
					].sort((a, b) => b.score - a.score)
				);
				setHighscorePosted(true);
			}
		} else {
			setHighscorePosted(false);
		}
	}, [gameOver]);

	return (
		<Box
			className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-9/12 h-5/6 flex flex-col justify-center items-center bg-gradient-to-b from-gray-600 to-gray-800 rounded overflow-hidden"
		>
			<CloseIcon
				className="absolute top-5 right-5 cursor-pointer"
				onClick={() => {
					setIsPlaying(true);
				}}
			/>

			{resumeGame && !gameOver ? (
				<>
					<Typography variant="body1" component="p">
						Resume
					</Typography>
					<Button
						variant="outlined"
						className="my-3"
						onClick={() => setIsPlaying(true)}
					>
						<Typography variant="body1">Resume</Typography>
					</Button>
				</>
			) : (
				<>
					<Typography variant="h3">
						{gameOver ? "Game over" : "New game"}
					</Typography>
					{gameOver && (
						<Typography variant="body1">{`Score: ${score}`}</Typography>
					)}

					<Button
						variant="outlined"
						className="my-3"
						onClick={() => {
							playAgain();
							setIsPlaying(true);
						}}
					>
						<Typography variant="body1">
							{gameOver ? "New game" : "Play"}
						</Typography>
					</Button>
				</>
			)}
			{displayScore.length > 0 && (
				<Box>
					<TableContainer>
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell align={"left"}>
										<Typography>achieved at</Typography>
									</TableCell>
									<TableCell align={"right"}>
										<Typography>score</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{displayScore.map((hs, i) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={i}>
											<TableCell align={"left"}>
												<Typography>
													{new Date(hs.achievedAt).toLocaleDateString("sv-SE")}
												</Typography>
											</TableCell>
											<TableCell align={"right"}>
												<Typography>{hs.score}</Typography>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			)}
		</Box>
	);
}

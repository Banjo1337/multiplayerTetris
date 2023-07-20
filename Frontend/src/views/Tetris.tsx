import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GameStats from "../components/tetris/GameStats";
import PlayAreaWrapper from "../components/tetris/PlayAreaWrapper";
import SingleTetromino from "../components/tetris/SingleTetromino";
import TetrisMenu from "../components/tetris/TetrisMenu";
import TetrisPlayArea from "../components/tetris/TetrisPlayArea";
import useTetrisStates from "../hooks/useTetrisStates";

export default function Tetris() {
	const [resumeGame, setResumeGame] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const isPlayingRef = useRef(false);
	const gameOverRef = useRef(false);
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
		getNewPlayArea,
	} = useTetrisStates();

	useEffect(() => {
		if (!resumeGame && isPlaying) {
			setResumeGame(true);
		}
		isPlayingRef.current = isPlaying;
		gameOverRef.current = gameOver;
	}, [isPlaying]);

	useEffect(() => {
		if (!isFocused) {
			setIsPlaying(false);
			setIsFocused(true);
		}
	}, [isFocused]);

	useEffect(() => {
		const handleKeyDown = ({ key }: KeyboardEvent) => {
			key = key.toLowerCase();

			if (!isPlayingRef.current) {
				if (key === " ") {
					if (!gameOverRef.current) {
						setIsPlaying(true);
					} else if (gameOverRef.current) {
						resetGame();
						setIsPlaying(true);
					}
				}
			} else if (key === "escape") {
				setIsPlaying(false);
			}
		};

		addEventListener("keydown", handleKeyDown);

		return () => {
			removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<Box className="flex justify-center w-full h-19/20">
			<Box className="flex">
				<Box className="flex flex-col place-content-between">
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
					/>
				</Box>
				<PlayAreaWrapper
					className="relative h-full"
					setIsFocused={setIsFocused}
				>
					<TetrisPlayArea
						isPlaying={isPlaying}
						playArea={playArea}
						landed={landed}
						getNewPlayArea={getNewPlayArea}
					>
						<TetrisMenu
							showMenu={!isPlaying}
							gameOver={gameOver}
							setIsPlaying={setIsPlaying}
							playAgain={resetGame}
							score={score}
							resumeGame={resumeGame}
						/>
					</TetrisPlayArea>
				</PlayAreaWrapper>

				<SingleTetromino
					isPlaying={isPlaying}
					title="next"
					align="right"
					tetro={nextTetro}
				/>
			</Box>
		</Box>
	);
}

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { TetroUnit } from "../../hooks/useTetrisStates";
import TetrisPlayArea from "../tetris/TetrisPlayArea";
interface Props {
	landed: number[][];
	tetro: TetroUnit[][];
	getNewPlayArea: () => number[][];
	isPlaying: boolean;
}
export default function OpponentPlayArea({
	landed,
	tetro,
	getNewPlayArea,
	isPlaying,
}: Props) {
	// lots of duped code here, will try to reuse existing...
	const [playArea, setPlayArea] = useState<number[][]>(getNewPlayArea());

	useEffect(() => {
		renderPlayarea();
	}, [tetro]);

	function renderPlayarea() {
		var newPlayArea = getNewPlayArea();

		for (let i = 0; i < tetro.length; i++) {
			for (let j = 0; j < tetro[0].length; j++) {
				if (tetro[i][j].color != 0) {
					newPlayArea[tetro[i][j].position.y][tetro[i][j].position.x] =
						tetro[i][j].color;
				}
			}
		}
		setPlayArea(newPlayArea);
	}

	return (
		<Box className="h-full w-full">
			<TetrisPlayArea
				playArea={playArea}
				landed={landed}
				getNewPlayArea={getNewPlayArea}
				isPlaying={isPlaying}
			/>
		</Box>
	);
}

import { Box } from "@mui/material";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

interface Props {
	playArea: number[][];
	landed?: number[][];
	children?: ReactNode;
	isPlaying: boolean;
	getNewPlayArea: () => number[][];
}

export default function TetrisPlayArea({
	playArea,
	landed,
	children,
	isPlaying,
	getNewPlayArea,
}: Props) {
	const playAreaRef = useRef<HTMLDivElement | null>(null);
	const [gameSize, setGameSize] = useState(0);
	const rows = playArea.length;

	useEffect(() => {
		const handleResize = () => {
			if (playAreaRef.current) {
				setGameSize(playAreaRef.current.offsetHeight / rows);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [rows]);

	const mappedPlayArea = useMemo(
		() =>
			((isPlaying === undefined ? true : isPlaying)
				? playArea
				: getNewPlayArea()
			).map((ta, i) => (
				<Box key={i} className="flex">
					{ta.map((tu, j) => (
						<Box
							style={{
								height: `${gameSize}px`,
								width: `${gameSize}px`,
							}}
							key={i + j}
							className={`border border-black bg-tetromino${
								(landed && landed[i][j]) || tu
							}`}
						></Box>
					))}
				</Box>
			)),
		[playArea, landed, gameSize]
	);


	return (
		<Box ref={playAreaRef} className="relative h-full flex-col inline-flex">
			{mappedPlayArea}
			{!isPlaying && children ? children : null}
		</Box>
	);
}


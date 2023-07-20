import { Box, Typography } from "@mui/material";
import { TetroUnit } from "../../hooks/useTetrisStates";

interface Props {
	tetro?: TetroUnit[][];
	align: "left" | "right";
	title?: string;
	isPlaying: boolean;
}

export default function SingleTetromino({
	tetro,
	align,
	title,
	isPlaying,
}: Props) {
	const mappedNextTetro = (
		isPlaying ? tetro : [[{ color: 0, position: { x: 5, y: 0 } }]]
	)?.map((y, i) => (
		<Box key={i} className="flex place-content-center">
			{y.map((x, j) => (
				<Box
					key={i + j}
					className={`w-1/4 h-1/4 ${
						x.color === 0 ? "invisible" : ""
					} border border-black bg-tetromino${x.color} text-tetromino${
						x.color
					}`}
				>
					{x.color}
				</Box>
			))}
		</Box>
	));

	return (
		<Box
			className={`${
				tetro
					? `flex flex-col justify-between rounded-${
							align === "left" ? "l" : "r"
					  }-lg bg-gray-400`
					: "invisible"
			} ${align === "left" ? "ml-auto" : "mr-auto"}`}
			style={{ width: 100, height: 130 }}
		>
			<Typography
				variant="h6"
				className={`px-1 text-${align === "left" ? "right" : "left"}`}
			>
				{title?.toUpperCase()}
			</Typography>
			<Box
				className={`rounded-${align === "left" ? "l" : "r"}-lg bg-gray-500`}
				style={{ width: 100, height: 100 }}
			>
				<Box className="min-h-full">{mappedNextTetro}</Box>
			</Box>
		</Box>
	);
}

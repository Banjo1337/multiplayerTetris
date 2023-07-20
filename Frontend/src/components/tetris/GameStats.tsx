import { Box, Typography } from "@mui/material";

interface Props {
	score: number;
	clearedLines: number;
	variant: "left" | "right";
	title?: string;
}

export default function GameStats({
	score,
	clearedLines,
	variant,
	title,
}: Props) {
	const level = Math.floor(clearedLines / 10);
	const prependZeroes = (score: number) =>
		[...Array(7 - score.toString().length)]
			.map((_) => 0)
			.concat(score)
			.toString()
			.replaceAll(",", "");
	const columnStyle = `mb-5 flex flex-col ${
		variant === "left" ? "text-right mr-1" : "text-left ml-1"
	}`;
	return (
		<Box
			className={`bg-gray-500 ${
				variant === "left" ? "ml-auto rounded-l-lg" : "mr-auto rounded-r-lg"
			}`}
		>
			{title ? <Typography className={columnStyle}>{title}</Typography> : null}
			<Box className={columnStyle}>
				<Typography>Score</Typography>
				<Typography variant="h6">{prependZeroes(score)}</Typography>
			</Box>
			<Box className={columnStyle}>
				<Typography>Level</Typography>
				<Typography variant="h6">{level}</Typography>
			</Box>
			<Box className={columnStyle}>
				<Typography>Cleared lines</Typography>
				<Typography variant="h6">{clearedLines}</Typography>
			</Box>
		</Box>
	);
}

import { Box, Paper, Typography } from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from "react-router-dom";

interface Props {
	awaitReconnection: boolean;
}
export default function OpponentReconnectionTimer({
	awaitReconnection,
}: Props) {
	const navigate = useNavigate();

	return (
		<Box
			className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-9/12 h-5/6  bg-gradient-to-b from-gray-600 to-gray-800 rounded flex ${
							awaitReconnection ? "" : "hidden"
						}`}
		>
			<Paper
				elevation={5}
				className="bg-gray-600 hover:scale-105 transition ease-in-out delay-100 w-11/12 m-auto p-3 flex justify-center"
			>
				<CountdownCircleTimer
					isPlaying={awaitReconnection}
					duration={60}
					colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
					colorsTime={[7, 5, 2, 0]}
					onComplete={() => navigate(0)}
				>
					{({ remainingTime }) => (
						<Box>
							<Typography className="mb-6" variant="overline">
								Awaiting reconnection
							</Typography>
							<Typography variant="body1">{remainingTime}</Typography>
						</Box>
					)}
				</CountdownCircleTimer>
			</Paper>
		</Box>
	);
}

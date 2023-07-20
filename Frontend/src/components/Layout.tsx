import GitHubIcon from "@mui/icons-material/GitHub";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	Box,
	CssBaseline,
	Link,
	MenuItem,
	ThemeOptions,
	ThemeProvider,
	Typography,
	createTheme,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SplitMenuButton from "./SplitMenuButton";
import ManageUserDrawer from "./user/ManageUserDrawer";

export const themeOptions: ThemeOptions = {
	palette: {
		mode: "dark",
		primary: {
			main: "rgba(88,249,135,0.53)",
		},
		secondary: {
			main: "#f50057",
		},
		success: {
			main: "rgba(55,203,60,0.67)",
		},
	},
	typography: {
		fontFamily: '"Press Start 2P", Arial, sans-serif',
		fontSize: 12,
	},
};

export default function Layout() {
	const navigate = useNavigate();
	const { isLoggedIn, user } = useUser();
	const [open, setOpen] = useState(false);
	const theme = createTheme(themeOptions);
	return (
		<ThemeProvider theme={theme}>
			<Box className="flex flex-col justify-between h-screen bg-gradient-to-b from-[#121212] to-gray-800">
				<Box className="w-full bg-green-600">
					<Box className="flex flex-row justify-between max-w-screen-lg px-8 mx-auto ">
						<Box>
							<SplitMenuButton
								contentPrimary={
									<Typography className="flex content-center">
										<PlayArrowIcon /> Play
									</Typography>
								}
								onClickPrimary={() => navigate("/")}
								menuItems={[
									<MenuItem onClick={() => navigate("/")}>
										Singleplayer
									</MenuItem>,
									<MenuItem onClick={() => navigate("/Multiplayer")}>
										Multiplayer
									</MenuItem>,
								]}
							/>
							<SplitMenuButton
								contentPrimary={
									<Typography className="flex content-center">
										<PlayArrowIcon /> Highscores
									</Typography>
								}
								onClickPrimary={() => navigate("/highscores")}
								menuItems={[
									<MenuItem onClick={() => navigate("/highscores")}>
										Leaderboard
									</MenuItem>,
									<MenuItem
										onClick={() =>
											navigate(
												`/highscores${isLoggedIn ? `/${user.displayName}` : ""}`
											)
										}
									>
										Personal
									</MenuItem>,
								]}
							/>
						</Box>
						<Box className="flex items-center">
							<Box
								className="flex items-center cursor-pointer"
								onClick={() => setOpen(true)}
							>
								{isLoggedIn ? (
									<Typography>{user?.displayName}</Typography>
								) : (
									<Typography>Sign in</Typography>
								)}
							</Box>
							<ManageUserDrawer open={open} setOpen={setOpen} />
						</Box>
					</Box>
				</Box>
				<Box className="h-full w-full max-w-screen-lg my-0 mx-auto p-8 text-center overflow-auto">
					<Outlet />
				</Box>
				<Box className="flex justify-center">
					<Link className="no-underline" href="https://github.com/Banjo1337">
						<Typography className="flex place-content-center pb-1">
							<GitHubIcon className="mr-1" />
							Banjo1337
						</Typography>
					</Link>
				</Box>
			</Box>
			<CssBaseline />
		</ThemeProvider>
	);
}

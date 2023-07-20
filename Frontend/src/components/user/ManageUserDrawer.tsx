// import { UserOutlined } from "@ant-design/icons";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Drawer,
	Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { axiosClient } from "../../hooks/client";
import UserSignIn from "./UserSignIn";
import UserSignUp from "./UserSignUp";

interface Props {
	open: boolean;
	setOpen: React.Dispatch<boolean>;
}
export default function ManageUserDrawer({ open, setOpen }: Props) {
	const { isLoggedIn, user } = useUser();
	const [toggleSignInSignUp, setToggleSignInSignUp] = useState(true);
	const client = useQueryClient();
	const signOut = useMutation(
		["logIn"],
		async () => await axiosClient.get("v1/user/LogOut"),
		{
			onSuccess: () => {
				client.invalidateQueries(["user"]);
			},
		}
	);

	return (
		<Drawer
			anchor="right"
			PaperProps={{ sx: { width: "25%" } }}
			open={open}
			onClose={() => setOpen(false)}
		>
			<Box>
				<CloseIcon
					className="absolute top-5 right-5 cursor-pointer"
					onClick={() => {
						setOpen(false);
					}}
				/>
			</Box>
			<Box className="mt-14 mx-auto justify-center align-center align-items-center">
				{isLoggedIn ? (
					<Box className="flex flex-col">
						<Typography variant="body1">
							Member since: {new Date(user.memberSince).toDateString()}
						</Typography>
						<Typography variant="body1">
							{user.highScores.length
								? `Highest score: ${user.highScores[0]?.score}`
								: "No highscores yet"}
						</Typography>
						<Button variant="outlined" onClick={() => signOut.mutate()}>
							<Typography variant="body1">Sign out</Typography>
						</Button>
					</Box>
				) : (
					<Box>
						<Accordion
							expanded={toggleSignInSignUp}
							onChange={() => setToggleSignInSignUp((prev) => !prev)}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>Sign in</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<UserSignIn />
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={!toggleSignInSignUp}
							onChange={() => setToggleSignInSignUp((prev) => !prev)}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>Sign up</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<UserSignUp />
							</AccordionDetails>
						</Accordion>
					</Box>
				)}
			</Box>
		</Drawer>
	);
}

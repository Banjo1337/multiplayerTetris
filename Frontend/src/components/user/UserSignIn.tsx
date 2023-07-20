import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { axiosClient } from "../../hooks/client";
import { UserSignInRequestDto } from "../../models/User";
export default function UserSignIn() {
	const [showErrors, setShowErros] = useState(false);
	const signInSchema = z.object({
		email: z
			.string()
			.email({ message: "Not a valid email" })
			.min(5, { message: "Too short" })
			.max(25, { message: "Too long" }),
		password: z
			.string()
			.min(5, { message: "Too short" })
			.max(25, { message: "Too long" })
			.regex(new RegExp(/^.*[0-9].*$/), {
				message: "Needs to contain atleast one digit",
			}),
	});
	type signInFormError = {
		email: string[];
		password: string[];
	};

	const [userSignInRequestDto, setUserSignInRequest] = useState<
		z.infer<typeof signInSchema>
	>({
		email: "",
		password: "",
	} as z.infer<typeof signInSchema>);
	const [formError, setFormError] = useState<signInFormError>({
		email: [],
		password: [],
	});
	const client = useQueryClient();
	const postSingInRequest = useMutation<any, any, UserSignInRequestDto, any>(
		["logIn"],
		async (signInRequest) => {
			return await axiosClient.post(
				"v1/user/SignIn",
				JSON.stringify(signInRequest)
			);
		},
		{
			onSuccess: (res) => {
				client.invalidateQueries(["user"]);
				setShowErros(false);
				setFormError((prev) => ({
					...prev,
					password: prev.password.filter((x) => x === "Invalid credentials"),
				}));
			},
			onError: () => {
				setFormError((prev) => ({
					...prev,
					password: [...prev.password, "Invalid credentials"],
				}));
				setShowErros(true);
			},
		}
	);
	useEffect(() => {
		if (!showErrors) {
			return;
		}

		setFormError({
			email: [],
			password: [],
		});
		try {
			signInSchema.parse(userSignInRequestDto);
		} catch (err) {
			if (err instanceof z.ZodError) {
				err.issues.forEach((err) => {
					setFormError((prev) => ({
						...prev,
						[err.path[0]]: [
							...prev[err.path[0] as keyof signInFormError],
							err.message,
						],
					}));
				});
			}
		}
	}, [userSignInRequestDto]);

	function handleSubmit() {
		setShowErros(false);

		const result = signInSchema.safeParse(userSignInRequestDto);
		if (result.success) {
			postSingInRequest.mutate(userSignInRequestDto);
		} else {
			setShowErros(true);
		}
	}

	return (
		<Box
			component="form"
			sx={{
				"& .MuiTextField-root": { m: 1, width: "25ch" },
			}}
			noValidate
			autoComplete="off"
		>
			<Box className="flex flex-col">
				<TextField
					label="Email"
					error={formError.email.length !== 0}
					value={userSignInRequestDto.email}
					helperText={
						<>
							{formError.email.map((err, i) => (
								<Typography key={i} variant="caption">
									{err} <br />
								</Typography>
							))}
						</>
					}
					onChange={(e) =>
						setUserSignInRequest((prev) => ({ ...prev, email: e.target.value }))
					}
				/>
				<TextField
					label="Password"
					type="password"
					error={formError.password.length !== 0}
					helperText={
						<>
							{formError.password.map((err, i) => (
								<Typography key={i} variant="caption">
									{err} <br />
								</Typography>
							))}
						</>
					}
					value={userSignInRequestDto.password}
					onChange={(e) =>
						setUserSignInRequest((prev) => ({
							...prev,
							password: e.target.value,
						}))
					}
					onKeyDown={({ key }) => (key === "Enter" ? handleSubmit() : null)}
				/>
				<Button variant="outlined" onClick={handleSubmit}>
					<Typography>Sign in</Typography>
				</Button>
			</Box>
		</Box>
	);
}

import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { axiosClient } from "../../hooks/client";
import { UserSignUpRequestDto, UserSignUpResponseDto } from "../../models/User";

export default function UserSignUp() {
	const client = useQueryClient();
	const signUpSchema = z
		.object({
			email: z
				.string()
				.email({ message: "Not a valid email" })
				.min(5, { message: "Too short" })
				.max(25, { message: "Too long" }),
			displayName: z
				.string()
				.min(5, { message: "Too short" })
				.max(25, { message: "Too long" }),
			password: z
				.string()
				.min(5, { message: "Too short" })
				.max(25, { message: "Too long" })
				.regex(new RegExp(/^.*[0-9].*$/), {
					message: "Needs to contain atleast one digit",
				}),
			passwordConfirm: z.string(),
		})
		.superRefine(({ password, passwordConfirm }, ctx) => {
			if (passwordConfirm !== password) {
				ctx.addIssue({
					code: "custom",
					message: "Passwords must match",
					path: ["passwordConfirm"],
				});
			}
		});
	type signUpFormError = {
		email: string[];
		displayName: string[];
		password: string[];
		passwordConfirm: string[];
	};

	const [userSignUpRequest, setUserSignUpRequest] = useState<
		z.infer<typeof signUpSchema>
	>({
		email: "",
		displayName: "",
		password: "",
		passwordConfirm: "",
	} as z.infer<typeof signUpSchema>);
	const [formError, setFormError] = useState<signUpFormError>({
		email: [],
		displayName: [],
		password: [],
		passwordConfirm: [],
	});

	useEffect(() => {
		setFormError({
			email: [],
			displayName: [],
			password: [],
			passwordConfirm: [],
		});
		try {
			signUpSchema.parse(userSignUpRequest);
		} catch (err) {
			if (err instanceof z.ZodError) {
				err.issues.forEach((err) => {
					setFormError((prev) => ({
						...prev,
						[err.path[0]]: [
							...prev[err.path[0] as keyof signUpFormError],
							err.message,
						],
					}));
				});
			}
		}
	}, [userSignUpRequest]);

	const postSignUpRequest = useMutation<
		any,
		UserSignUpResponseDto,
		UserSignUpRequestDto,
		any
	>(
		["signUp"],
		async (signUpRequestDto) => {
			return await axiosClient.post(
				"v1/user/SignUp",
				JSON.stringify(signUpRequestDto)
			);
		},
		{
			onSuccess: () => {
				client.invalidateQueries(["user"]);
			},
		}
	);

	function handleSubmit() {
		const result = signUpSchema.safeParse(userSignUpRequest);
		if (result.success) {
			postSignUpRequest.mutate(userSignUpRequest);
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
					label="Username"
					error={formError.displayName.length !== 0}
					value={userSignUpRequest.displayName}
					helperText={
						<>
							{formError.displayName.map((err, i) => (
								<Typography key={i} variant="caption">
									{err} <br />
								</Typography>
							))}
						</>
					}
					onChange={(e) =>
						setUserSignUpRequest((prev) => ({
							...prev,
							displayName: e.target.value,
						}))
					}
				/>
				<TextField
					label="Email"
					error={formError.email.length !== 0}
					value={userSignUpRequest.email}
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
						setUserSignUpRequest((prev) => ({ ...prev, email: e.target.value }))
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
					value={userSignUpRequest.password}
					onChange={(e) =>
						setUserSignUpRequest((prev) => ({
							...prev,
							password: e.target.value,
						}))
					}
				/>
				<TextField
					label="Confirm password"
					type="password"
					error={formError.passwordConfirm.length !== 0}
					value={userSignUpRequest.passwordConfirm}
					helperText={
						<>
							{formError.passwordConfirm.map((err, i) => (
								<Typography key={i} variant="caption">
									{err} <br />
								</Typography>
							))}
						</>
					}
					onChange={(e) =>
						setUserSignUpRequest((prev) => ({
							...prev,
							passwordConfirm: e.target.value,
						}))
					}
				/>
				<Button variant="outlined" onClick={handleSubmit}>
					<Typography>Sign up</Typography>
				</Button>
			</Box>
		</Box>
	);
}

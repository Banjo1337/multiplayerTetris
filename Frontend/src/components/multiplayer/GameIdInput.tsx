import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Props {
	joinGame: (gameId: string) => void;
}

export default function GameIdInput({ joinGame }: Props) {
	// const clipBoard = new Clipboard()
	const joinGameSchema = z.object({
		gameId: z.string().regex(new RegExp(/^[0-9a-f]{5}$/), {
			message: "Invalid id",
		}),
	});
	type joinGameError = {
		gameId: string[];
	};

	const [inputGameId, setInputGameId] = useState<
		z.infer<typeof joinGameSchema>
	>({ gameId: "" } as z.infer<typeof joinGameSchema>);

	const [formError, setFormError] = useState<joinGameError>({
		gameId: [],
	});

	useEffect(() => {
		if (inputGameId.gameId.length === 0) {
			return;
		}
		setFormError({
			gameId: [],
		});
		try {
			joinGameSchema.parse(inputGameId);
		} catch (err) {
			if (err instanceof z.ZodError) {
				err.issues.forEach((err) => {
					setFormError((prev) => ({
						...prev,
						[err.path[0]]: [
							...prev[err.path[0] as keyof joinGameError],
							err.message,
						],
					}));
				});
			}
		}
	}, [inputGameId]);

	function handleSubmit() {
		const result = joinGameSchema.safeParse(inputGameId);
		if (result.success) {
			joinGame(inputGameId.gameId);
		}
	}

	const handlePaste = async () =>
		setInputGameId({ gameId: await navigator.clipboard.readText() });

	return (
		<Box
			component="form"
			sx={{
				"& .MuiTextField-root": { m: 1, width: "25ch" },
			}}
			noValidate
			autoComplete="off"
            className=""
		>
			<Box className="flex flex-col">
				<Box className="flex flex-row items-center">
					<TextField
						label="GameId"
						error={formError.gameId.length !== 0}
						helperText={
							<>
								{formError.gameId.map((err, i) => (
									<Typography key={i} variant="caption">
										{err} <br />
									</Typography>
								))}
							</>
						}
						value={inputGameId.gameId}
						onChange={(e) => setInputGameId({ gameId: e.target.value })}
					/>
					<Button variant="outlined" onClick={handlePaste}>
						<ContentPasteGoIcon />
					</Button>
				</Box>
				<Button variant="outlined" onClick={handleSubmit}>
					<Typography>Join</Typography>
				</Button>
			</Box>
		</Box>
	);
}

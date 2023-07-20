import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";

import { ReactNode, createContext, useContext, useState } from "react";

interface Props {
	children: ReactNode;
}

interface SnackProps {
	duration?: number;
	severity?: AlertColor;
	message: string;
}

interface ContextValue {
	snack: (snackProps: SnackProps) => void;
}

const SnackContext = createContext({} as ContextValue);

export function SnackProvider({ children }: Props) {
	const [open, setOpen] = useState(false);
	const defaultSnackState: SnackProps = {
		duration: 4000,
		severity: "success",
		message: "",
	};
	const [snackState, setSnackState] = useState(defaultSnackState);

	function snack(snackProps: SnackProps) {
		setSnackState({
			duration: snackProps.duration ?? defaultSnackState.duration,
			severity: snackProps.severity ?? defaultSnackState.severity,
			message: snackProps.message,
		});
		setOpen((prev) => !prev);
	}

	return (
		<SnackContext.Provider value={{ snack }}>
			{children}
			<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={snackState.duration}>
				<Alert onClose={() => setOpen(false)} severity={snackState.severity} className="w-full">
					<Typography>{snackState.message}</Typography>
				</Alert>
			</Snackbar>
		</SnackContext.Provider>
	);
}

export const useSnack = () => useContext(SnackContext);

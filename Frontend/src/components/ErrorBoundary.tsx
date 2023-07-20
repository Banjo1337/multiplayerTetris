import { Box } from "@mui/material";
import { Component } from "react";
interface ErrorBoundaryState {
	hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryState> {
	constructor(props: ErrorBoundaryState) {
		super(props);
		this.state = {
			hasError: false,
		};
	}
	componentDidCatch() {
		this.setState({ hasError: true });
	}
	render(): React.ReactNode {
		return (
			<Box className="w-full flex place-content-center min-h-screen bg-gradient-to-b from-[#121212] to-gray-800">
				<Box
					component="img"
					className="h-1/6"
					src="https://media.tenor.com/StMx6F8h5RQAAAAC/psyduck-confused.gif"
				/>
			</Box>
		);
	}
}

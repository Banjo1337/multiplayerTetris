import { StyledEngineProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<App />
		</StyledEngineProvider>
	</React.StrictMode>
);

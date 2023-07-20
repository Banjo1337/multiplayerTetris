import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { SnackProvider } from "./contexts/SnackProvider";
import UserProvider from "./contexts/UserContext";
import HighScores from "./views/HighScores";
import MultiplayerAlpha from "./views/MultiPlayer";
import Tetris from "./views/Tetris";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />} errorElement={<ErrorBoundary hasError={false}/>}>
			<Route index element={<Tetris />} />
			<Route path="Highscores/:displayName?" element={<HighScores />} />
			<Route path="Multiplayer/:urlGameId?" element={<MultiplayerAlpha />} />
		</Route>
	)
);

const client = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 30,
			refetchOnWindowFocus: false,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={client}>
			<SnackProvider>
				<UserProvider>
					<ReactQueryDevtools initialIsOpen={false} />
					<RouterProvider router={router} />
				</UserProvider>
			</SnackProvider>
		</QueryClientProvider>
	);
}

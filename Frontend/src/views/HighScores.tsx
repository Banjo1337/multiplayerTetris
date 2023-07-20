import {
	Box,
	Fade,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { axiosClient } from "../hooks/client";
import { HighScore } from "../models/HighScore";

export default function HighScores() {
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [data, setData] = useState<HighScore[]>([]);
	const [longFetch, setLongFetch] = useState(false);
	const { displayName } = useParams();

	const { isRefetching, refetch } = useQuery<HighScore[]>({
		queryKey: ["highScore", page],
		queryFn: async () =>
			await axiosClient(
				`v1/highscore/GetPaginated/${
					displayName ? `${page}?displayName=${displayName}` : page
				}`
			).then((res) => res.data),
		keepPreviousData: true,
		onSuccess: (response) => {
			setData((prev) => [...prev, ...response]);
			setHasMore(response.length !== 0);
		},
	});

	useEffect(() => {
		setPage(0);
		setData([]);
		refetch();
	}, [displayName]);

	useEffect(() => {
		setLongFetch(true);

		const interval = setInterval(() => {
			setLongFetch(false);
		}, 1000);
		return () => clearInterval(interval);
	}, [isRefetching]);

	return (
		<>
			<Fade timeout={{ enter: 1000, exit: 1000 }} in={longFetch}>
				<LinearProgress />
			</Fade>
			<Box
				className="w-full h-19/20 max-w-full overflow-auto"
				id="scrollableBox"
			>
				<InfiniteScroll
					dataLength={data.length}
					next={() => setPage((prev) => prev + 1)}
					hasMore={hasMore}
					loader={null}
					endMessage={<Typography>No more</Typography>}
					scrollableTarget="scrollableBox"
				>
					<TableContainer>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell align={"left"}>
										<Typography>Username</Typography>
									</TableCell>
									<TableCell align={"center"}>
										<Typography>achieved at</Typography>
									</TableCell>
									<TableCell align={"right"}>
										<Typography>score</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((hs, i) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={i}>
											<TableCell align={"left"}>
												<Typography>{hs.displayName}</Typography>
											</TableCell>
											<TableCell align={"center"}>
												<Typography>
													{new Date(hs.achievedAt).toLocaleDateString("sv-SE")}
												</Typography>
											</TableCell>
											<TableCell align={"right"}>
												<Typography>{hs.score}</Typography>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</InfiniteScroll>
			</Box>
			<Fade
				timeout={{ enter: 1000, exit: 1000 }}
				in={longFetch}
				className="rotate-180"
			>
				<LinearProgress />
			</Fade>
		</>
	);
}

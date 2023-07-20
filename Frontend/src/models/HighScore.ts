export type HighScore = {
	id: string;
	userId: string;
	score: number;
	achievedAt: string;
	displayName: string;
};

export type LocalHighScore = Pick<HighScore, "score" | "achievedAt">;
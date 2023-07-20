import { HighScore } from "./HighScore";
export type User = {
	id: string;
	displayName: string;
	memberSince: string;
	highScores: HighScore[];
};

export type UserSignUpRequestDto = {
	email: string;
	displayName: string;
	password: string;
};

export type UserSignInRequestDto = Omit<UserSignUpRequestDto, "displayName">;

export type UserSignUpResponseDto = {
	field: string;
	status: string;
}
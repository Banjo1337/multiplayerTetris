import { useEffect, useRef, useState } from "react";

import { OpponentGameState } from "../views/MultiPlayer";
import { useTetrominoBag } from "./TetrominoBag";

export type TetroUnit = {
	color: number;
	position: Position;
};

export type Position = {
	x: number;
	y: number;
};

type Keys = {
	[key: string]: boolean;
};

export default function useTetrisStates() {
	const [playArea, setPlayArea] = useState<number[][]>(getNewPlayArea);
	const [landed, setLanded] = useState<number[][]>(getNewPlayArea);
	const { nextFromBag, resetBag } = useTetrominoBag();
	const [tetro, setTetro] = useState(nextFromBag);
	const [possibleHold, setPossibleHold] = useState(tetro);
	const [holdTetro, setHoldTetro] = useState<TetroUnit[][]>();
	const [hasHeld, setHasHeld] = useState(false);
	const [nextTetro, setNextTetro] = useState(nextFromBag);
	const [score, setScore] = useState(0);
	const [totalClearedLines, setTotalClearedLines] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [keys, setKeys] = useState<Keys>({});

	const prevLandedRef = useRef(landed);
	const suppressUseEffects = useRef(false);

	useEffect(() => {
		if (isPlaying) {
			const interval = setInterval(() => {
				tickDown();
			}, 1000 - totalClearedLines * 10);
			return () => clearInterval(interval);
		}
	}, [tetro, isPlaying]);

	useEffect(() => {
		const handleKeyUp = ({ key }: KeyboardEvent) =>
			setKeys((prev) => ({ ...prev, [key.toLowerCase()]: false }));
		addEventListener("keyup", handleKeyUp);

		const handleKeyDown = ({ key }: KeyboardEvent) =>
			setKeys((prev) => ({ ...prev, [key.toLowerCase()]: true }));
		addEventListener("keydown", handleKeyDown);

		return () => {
			removeEventListener("keyup", handleKeyUp);
			removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (!isPlaying) {
			return;
		}

		if (keys["arrowup"] || keys["w"]) {
			handleRotate(true);
			setKeys((prev) => ({ ...prev, ["w"]: false, ["arrowup"]: false }));
		} else if (keys["z"]) {
			handleRotate(false);
			setKeys((prev) => ({ ...prev, ["z"]: false }));
		} else if (keys[" "]) {
			hardDrop();
			setKeys((prev) => ({ ...prev, [" "]: false }));
		} else if (keys["c"]) {
			handleHold();
		} else if (keys["arrowdown"]) {
			tickDown();
		} else if (keys["a"] || keys["arrowleft"]) {
			moveX(-1);
		} else if (keys["d"] || keys["arrowright"]) {
			moveX(1);
		} else if (keys["p"]) {
			InsertTrashLine();
		}
	}, [keys]);

	useEffect(() => {
		if (prevLandedRef.current !== landed) {
			insertTetro();
			prevLandedRef.current = landed;
		}
	}, [landed]);

	useEffect(() => {
		checkForClears();
	}, [landed]);

	useEffect(() => {
		renderPlayarea();
	}, [tetro]);

	useEffect(() => {
		setPossibleHold(tetro);
		setHasHeld(false);
	}, [nextTetro]);

	function getNewPlayArea() {
		var newPlayArea: number[][] = [];
		for (let i = 0; i < 20; i++) {
			newPlayArea[i] = [];
			for (let j = 0; j < 10; j++) {
				newPlayArea[i][j] = 0;
			}
		}

		return newPlayArea;
	}

	function insertTetro() {
		if (suppressUseEffects.current) {
			suppressUseEffects.current = false;
			renderPlayarea();
			return;
		}

		var possiblePlayArea = getNewPlayArea();
		var isInsertable = true;
		for (let i = 0; i < nextTetro.length; i++) {
			for (let j = 0; j < nextTetro[0].length; j++) {
				if (
					landed[nextTetro[i][j].position.y][nextTetro[i][j].position.x] &&
					landed[nextTetro[i][j].position.y][nextTetro[i][j].position.x] != 0
				) {
					isInsertable = false;
				} else {
					possiblePlayArea[nextTetro[i][j].position.y][
						nextTetro[i][j].position.x
					] = nextTetro[i][j].color;
				}
			}
		}
		if (isInsertable) {
			setPlayArea(possiblePlayArea);
			setTetro(nextTetro);
			setNextTetro(nextFromBag());
		} else {
			temporaryGameOverFunction();
		}
	}

	function temporaryGameOverFunction() {
		setIsPlaying(false);
		setGameOver(true);
	}

	function renderPlayarea() {
		const dropShadowTetro = determineDropShadow();
		var newPlayArea = getNewPlayArea();

		for (let i = 0; i < tetro.length; i++) {
			for (let j = 0; j < tetro[0].length; j++) {
				if (tetro[i][j].position.y < 0) {
					temporaryGameOverFunction();
					return;
				}

				if (dropShadowTetro[i][j].color != 0) {
					newPlayArea[dropShadowTetro[i][j].position.y][
						dropShadowTetro[i][j].position.x
					] = dropShadowTetro[i][j].color + 10;
				}

				if (tetro[i][j].color != 0) {
					newPlayArea[tetro[i][j].position.y][tetro[i][j].position.x] =
						tetro[i][j].color;
				}
			}
		}
		setPlayArea(newPlayArea);
	}

	function moveX(increment: number) {
		var possibleTetro = structuredClone(tetro);

		for (let i = 0; i < tetro.length; i++) {
			for (let j = 0; j < tetro[i].length; j++) {
				if (
					tetro[i][j].color != 0 &&
					landed[tetro[i][j].position.y][tetro[i][j].position.x + increment] !=
						0
				) {
					return;
				} else {
					possibleTetro[i][j].position.x += increment;
				}
			}
		}

		setTetro(possibleTetro);
	}

	function determineDropShadow() {
		let possibleTetro: TetroUnit[][] = structuredClone(tetro);

		while (true) {
			let returnAbleTetro: TetroUnit[][] = structuredClone(possibleTetro);

			for (let i = 0; i < possibleTetro.length; i++) {
				for (let j = 0; j < possibleTetro[i].length; j++) {
					if (
						!landed[possibleTetro[i][j].position.y + 1] &&
						possibleTetro[i][j].color === 0
					) {
					} else if (
						!landed[possibleTetro[i][j].position.y + 1] ||
						(landed[possibleTetro[i][j].position.y + 1][
							possibleTetro[i][j].position.x
						] != 0 &&
							possibleTetro[i][j].color != 0)
					) {
						return returnAbleTetro;
					} else {
						possibleTetro[i][j].position.y++;
					}
				}
			}
		}
	}

	function hardDrop() {
		var possibleTetro: TetroUnit[][] = determineDropShadow();
		var possibleLanded = getNewPlayArea();

		for (let i = 0; i < tetro.length; i++) {
			for (let j = 0; j < tetro[i].length; j++) {
				if (tetro[i][j].color != 0) {
					possibleLanded[possibleTetro[i][j].position.y][
						possibleTetro[i][j].position.x
					] = tetro[i][j].color;
				}
			}
		}

		setLanded((prev) =>
			prev.map((x, i1) =>
				x.map((y, i2) =>
					possibleLanded[i1][i2] != 0 ? possibleLanded[i1][i2] : y
				)
			)
		);
	}

	function tickDown() {
		var possibleTetro: TetroUnit[][] = structuredClone(tetro);
		var possibleLanded = getNewPlayArea();
		var isMovable = true;
		for (let i = 0; i < tetro.length; i++) {
			for (let j = 0; j < tetro[i].length; j++) {
				if (tetro[i][j].color != 0) {
					possibleLanded[tetro[i][j].position.y][tetro[i][j].position.x] =
						tetro[i][j].color;
				}
				if (!landed[tetro[i][j].position.y + 1] && tetro[i][j].color === 0) {
				} else if (
					!landed[tetro[i][j].position.y + 1] ||
					(landed[tetro[i][j].position.y + 1][tetro[i][j].position.x] != 0 &&
						tetro[i][j].color != 0)
				) {
					isMovable = false;
				} else {
					possibleTetro[i][j].position.y++;
				}
			}
		}

		if (isMovable) {
			setTetro(possibleTetro);
		} else {
			setLanded((prev) =>
				prev.map((x, i1) =>
					x.map((y, i2) =>
						possibleLanded[i1][i2] != 0 ? possibleLanded[i1][i2] : y
					)
				)
			);
		}
	}

	function checkForClears() {
		let possibleLanded: number[][] = structuredClone(landed);
		let clearedLines = 0;
		for (let i = 0; i < landed.length; i++) {
			if (!landed[i].includes(0) && !landed[i].includes(8)) {
				possibleLanded.splice(i, 1);
				possibleLanded.splice(
					0,
					0,
					[...Array(10)].map((x) => 0)
				);

				clearedLines++;
			}
		}

		if (clearedLines) {
			setLanded(possibleLanded);
			prevLandedRef.current = possibleLanded;
			giveScore(clearedLines);
		}
	}

	function giveScore(clearedLines: number) {
		const scores = [0, 100, 300, 500, 800];
		const level = Math.floor(totalClearedLines / 10);
		setScore((prev) => prev + scores[clearedLines] * (level !== 0 ? level : 1));
		setTotalClearedLines((prev) => prev + clearedLines);
	}
	function handleRotate(clockWise: boolean) {
		// this is ass

		const pureForm = tetro.map((y) => y.map((x) => x.color));

		const rotated = clockWise
			? pureForm.map((_, i) => pureForm.map((y) => y[i]).reverse())
			: pureForm[0].map((_, i) => pureForm.map((row) => row[i])).reverse();

		let rotatedTetro = tetro.map((y, i) =>
			y.map((x, j) => ({ ...x, color: rotated[i][j] }))
		);

		while (true) {
			let adjustXBy = 0;
			let adjustYBy = 0;
			for (let i = 0; i < rotatedTetro.length; i++) {
				for (let j = 0; j < rotatedTetro[i].length; j++) {
					if (rotatedTetro[i][j].position.x > 9) {
						adjustXBy = -1;
					} else if (rotatedTetro[i][j].position.x < 0) {
						adjustXBy = 1;
					} else if (
						landed[rotatedTetro[i][j].position.y][
							rotatedTetro[i][j].position.x
						] != 0 &&
						rotatedTetro[i][j].color != 0
					) {
						adjustYBy = -1;
					}
				}
			}

			rotatedTetro = rotatedTetro.map((y, i) =>
				y.map((x, j) => ({
					...x,
					color: rotated[i][j],
					position: {
						y: x.position.y + adjustYBy,
						x: x.position.x + adjustXBy,
					},
				}))
			);

			let breakLoop = true;

			rotatedTetro.forEach((y) =>
				y.forEach((x) => {
					if (landed[x.position.y][x.position.x] != 0 && x.color != 0) {
						breakLoop = false;
					}
				})
			);

			if (breakLoop) {
				break;
			}
		}
		setTetro(rotatedTetro);
	}

	function handleHold() {
		if (!hasHeld) {
			if (!holdTetro) {
				setHoldTetro(possibleHold);

				insertTetro();
			} else {
				// This bypasses hitdetection
				setTetro(holdTetro);
				setHoldTetro(possibleHold);
			}
			setHasHeld(true);
		}
	}

	function resetGame() {
		setPlayArea(getNewPlayArea());
		setLanded(getNewPlayArea());
		resetBag();
		setHoldTetro([[{ color: 0, position: { x: 5, y: 0 } }]]);
		setTetro(nextFromBag);
		setPossibleHold(tetro);
		setHasHeld(false);
		setNextTetro(nextFromBag);
		setScore(0);
		setTotalClearedLines(0);
		setGameOver(false);
	}

	function InsertTrashLine() {
		suppressUseEffects.current = true;
		const highestTrashLineIndex = landed.reduce(
			(acc, cur, i) => (cur.includes(8) && acc < 0 ? i : acc),
			19
		);
		const lowestYPostion = tetro.reduce(
			(acc, cur) =>
				cur.map((ta) => ta.position.y).sort((a, b) => a - b)[0] > acc
					? cur.map((ta) => ta.position.y).sort((a, b) => b - a)[0]
					: acc,
			0
		);
		if (lowestYPostion >= highestTrashLineIndex - 1) {
			setTetro((prev) =>
				prev.map((ta) =>
					ta.map((tu) => ({
						...tu,
						position: { ...tu.position, y: tu.position.y - 1 },
					}))
				)
			);
		}
		setLanded((prev) => [
			...prev.filter((_, i) => i !== 0),
			[...Array(10)].map((_) => 8),
		]);
	}

	function RecieveGameState(data: OpponentGameState, tetro: TetroUnit[][]) {
		suppressUseEffects.current = true;

		setLanded(data.playArea);
		setTetro(tetro);
		setNextTetro(data.nextTetromino);
		setScore(data.score);
		setTotalClearedLines(data.clearedLines);
		setGameOver(data.gameOver);
	}

	return {
		holdTetro,
		score,
		totalClearedLines,
		playArea,
		landed,
		isPlaying,
		gameOver,
		setIsPlaying,
		resetGame,
		nextTetro,
		tetro,
		InsertTrashLine,
		getNewPlayArea,
		RecieveGameState,
	};
}

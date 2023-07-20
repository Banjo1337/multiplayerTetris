import { useEffect, useState } from "react";

export const useTetrominoBag = () => {
	const [tetrominoBag, setTetrominoBag] = useState(Tetrominos);
	useEffect(() => {
		if (!tetrominoBag.length) {
			setTetrominoBag(Tetrominos);
		}
	}, [tetrominoBag]);

	function nextFromBag() {
		const random = Math.ceil(Math.random() * tetrominoBag.length - 1);
		const tetro = tetrominoBag[random];
		setTetrominoBag((prev) => prev.filter((_, i) => i !== random));
		return tetro;
	}

	const resetBag = () => setTetrominoBag(Tetrominos);

	return { nextFromBag, resetBag };
};
const Tetrominos = [
	[
		[
			{ color: 0, position: { x: 4, y: 0 } },
			{ color: 1, position: { x: 5, y: 0 } },
			{ color: 0, position: { x: 6, y: 0 } },
		],
		[
			{ color: 1, position: { x: 4, y: 1 } },
			{ color: 1, position: { x: 5, y: 1 } },
			{ color: 1, position: { x: 6, y: 1 } },
		],
		[
			{ color: 0, position: { x: 4, y: 2 } },
			{ color: 0, position: { x: 5, y: 2 } },
			{ color: 0, position: { x: 6, y: 2 } },
		],
	],
	[
		[
			{ color: 2, position: { x: 4, y: 0 } },
			{ color: 2, position: { x: 5, y: 0 } },
		],
		[
			{ color: 2, position: { x: 4, y: 1 } },
			{ color: 2, position: { x: 5, y: 1 } },
		],
	],
	[
		[
			{ color: 0, position: { x: 4, y: 0 } },
			{ color: 3, position: { x: 5, y: 0 } },
			{ color: 3, position: { x: 6, y: 0 } },
		],
		[
			{ color: 3, position: { x: 4, y: 1 } },
			{ color: 3, position: { x: 5, y: 1 } },
			{ color: 0, position: { x: 6, y: 1 } },
		],
		[
			{ color: 0, position: { x: 4, y: 2 } },
			{ color: 0, position: { x: 5, y: 2 } },
			{ color: 0, position: { x: 6, y: 2 } },
		],
	],
	[
		[
			{ color: 4, position: { x: 4, y: 0 } },
			{ color: 4, position: { x: 5, y: 0 } },
			{ color: 0, position: { x: 6, y: 0 } },
		],
		[
			{ color: 0, position: { x: 4, y: 1 } },
			{ color: 4, position: { x: 5, y: 1 } },
			{ color: 4, position: { x: 6, y: 1 } },
		],
		[
			{ color: 0, position: { x: 4, y: 2 } },
			{ color: 0, position: { x: 5, y: 2 } },
			{ color: 0, position: { x: 6, y: 2 } },
		],
	],
	[
		[
			{ color: 0, position: { x: 5, y: 0 } },
			{ color: 0, position: { x: 6, y: 0 } },
			{ color: 0, position: { x: 7, y: 0 } },
			{ color: 0, position: { x: 8, y: 0 } },
		],
		[
			{ color: 5, position: { x: 5, y: 1 } },
			{ color: 5, position: { x: 6, y: 1 } },
			{ color: 5, position: { x: 7, y: 1 } },
			{ color: 5, position: { x: 8, y: 1 } },
		],
		[
			{ color: 0, position: { x: 5, y: 2 } },
			{ color: 0, position: { x: 6, y: 2 } },
			{ color: 0, position: { x: 7, y: 2 } },
			{ color: 0, position: { x: 8, y: 2 } },
		],
		[
			{ color: 0, position: { x: 5, y: 3 } },
			{ color: 0, position: { x: 6, y: 3 } },
			{ color: 0, position: { x: 7, y: 3 } },
			{ color: 0, position: { x: 8, y: 3 } },
		],
	],
	[
		[
			{ color: 0, position: { x: 4, y: 0 } },
			{ color: 6, position: { x: 5, y: 0 } },
			{ color: 0, position: { x: 6, y: 0 } },
		],
		[
			{ color: 0, position: { x: 4, y: 1 } },
			{ color: 6, position: { x: 5, y: 1 } },
			{ color: 0, position: { x: 6, y: 1 } },
		],
		[
			{ color: 0, position: { x: 4, y: 2 } },
			{ color: 6, position: { x: 5, y: 2 } },
			{ color: 6, position: { x: 6, y: 2 } },
		],
	],
	[
		[
			{ color: 0, position: { x: 4, y: 0 } },
			{ color: 7, position: { x: 5, y: 0 } },
			{ color: 0, position: { x: 6, y: 0 } },
		],
		[
			{ color: 0, position: { x: 4, y: 1 } },
			{ color: 7, position: { x: 5, y: 1 } },
			{ color: 0, position: { x: 6, y: 1 } },
		],
		[
			{ color: 7, position: { x: 4, y: 2 } },
			{ color: 7, position: { x: 5, y: 2 } },
			{ color: 0, position: { x: 6, y: 2 } },
		],
	],
];

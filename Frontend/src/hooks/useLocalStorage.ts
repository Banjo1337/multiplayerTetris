import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialState: T) {
	const [value, setValue] = useState<T>(() => {
		const result = localStorage.getItem(key);
		if (result) {
			return JSON.parse(result);
		} else if (initialState !== undefined) {
			return initialState;
		}
		return undefined
	});

	useEffect(() => {
		if (value !== undefined) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}, [value]);

	return [value, setValue] as const;
}

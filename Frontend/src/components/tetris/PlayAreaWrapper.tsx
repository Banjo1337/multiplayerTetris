import { Box } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";

interface Props {
	children: ReactNode;
	className: string;
	setIsFocused: Dispatch<SetStateAction<boolean>>;
}

export default function PlayAreaWrapper({
	children,
	className,
	setIsFocused,
}: Props) {
	const wrapperElementRef = useRef<null | Element>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) =>
			setIsFocused(
				(wrapperElementRef.current as Element).contains(e.target as Element)
			);
		addEventListener("mousedown", handleClickOutside);
		return () => {
			removeEventListener("mousedown", handleClickOutside);
		};
	}, [wrapperElementRef]);

	return (
		<Box className={className} ref={wrapperElementRef}>
			{children}
		</Box>
	);
}

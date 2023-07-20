import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
	Box,
	Button,
	ButtonGroup,
	ClickAwayListener,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper,
} from "@mui/material";

import React, { MouseEventHandler, ReactElement, ReactNode } from "react";
interface Props {
	contentPrimary: ReactNode;
	onClickPrimary: MouseEventHandler<HTMLButtonElement>;
	menuItems: ReactElement<typeof MenuItem>[];
}

export default function SplitMenuButton({
	contentPrimary,
	onClickPrimary,
	menuItems,
}: Props) {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef<HTMLDivElement>(null);



	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: Event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}

		setOpen(false);
	};

	return (
		<React.Fragment>
			<ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
				<Button onClick={onClickPrimary}>{contentPrimary}</Button>
				<Button
					size="small"
					aria-controls={open ? "split-button-menu" : undefined}
					aria-expanded={open ? "true" : undefined}
					onClick={handleToggle}
				>
					<ArrowDropDownIcon />
				</Button>
			</ButtonGroup>
			<Popper
	
				className="z-10"
				open={open}
				anchorEl={anchorRef.current}
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === "bottom" ? "center top" : "center bottom",
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id="split-button-menu" autoFocusItem>
									{menuItems.map((item, i) => (
										<Box key={i} onClick={() => setOpen(false)}>
											{item}
										</Box>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</React.Fragment>
	);
}

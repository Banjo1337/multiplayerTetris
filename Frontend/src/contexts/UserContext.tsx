import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState } from "react";
import { axiosClient } from "../hooks/client";
import { User } from "../models/User";
import { useSnack } from "./SnackProvider";

interface ContextValue {
	user: User;
	isLoggedIn: boolean;
}

const UserContext = createContext<ContextValue>({} as ContextValue);

interface Props {
	children: ReactNode;
}

function UserProvider({ children }: Props) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState({} as User);
	const [initialSignin, setInitialSignin] = useState(true);
	const { snack } = useSnack();

	useQuery<User>(
		["user"],
		async () => await axiosClient.get("v1/user").then((res) => res.data),
		{
			onSuccess: (res) => {
				setIsLoggedIn(true);
				setUser(res);
				if (initialSignin) {
					snack({
						message: `Welcome back ${res.displayName}`,
					});
					setInitialSignin(false);
				}
			},
			onError: () => {
				setIsLoggedIn(false);
			},
			retry: false,
		}
	);

	return (
		<UserContext.Provider value={{ user, isLoggedIn }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);

export default UserProvider;

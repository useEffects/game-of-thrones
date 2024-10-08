import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { IMessage } from "src/components/message-bubble";
import useLocalStorageState from "use-local-storage-state";

export const UserContext = createContext<{
    user: User,
    setUser: Dispatch<SetStateAction<User>>,
}>({
    user: { name: '', messages: [] },
    setUser: () => { },
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useLocalStorageState<User>('user', {
        defaultValue: {
            name: 'Guest User',
            messages: [],
        }
    })

    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}

export type User = {
    name: string,
    messages: IMessage[],
}
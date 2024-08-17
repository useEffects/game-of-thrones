import { useContext } from "react";
import { UserContext } from "src/context/user";

export default function useUser() {
    return useContext(UserContext);
}
/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/

import { useSession } from "next-auth/react";

export type User = {
    name: string | null | undefined;
    email: string;
    user_id: number;
    created_on: string;
    role: string;
}

export type Session = {
    user: User
}



export const useUserSession = () => {
    const { data: session } = useSession();
    
    return { session: session as Session | null };
};
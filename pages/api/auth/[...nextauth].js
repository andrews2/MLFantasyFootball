import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { server } from "../../../config";

export const authOptions = {

    providers: [
        CredentialsProvider({
            secret: process.env.NEXTAUTH_SECRET,
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const res = await fetch(`${server}/api/userlogin`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                  });

                  const user = await res.json();
                  user.name = user.username;

                  if (res.ok && user) {
                    return user;
                  }
            }
        })
    ],

    pages: {
        signIn: '/',
        signOut: '/',
        error: '/',
    }
  };
  export default NextAuth(authOptions);
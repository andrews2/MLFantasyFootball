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

    session: {
      maxAge: 259200,
    },

    pages: {
        signIn: '/',
        signOut: '/',
        error: '/',
    },

    callbacks : {
        async jwt({ token, user }) {
            return { ...token, ...user };
          },
          async session({ session, token }) {
            session.user = token;
            return session;
          },
    },
  };
  export default NextAuth(authOptions);
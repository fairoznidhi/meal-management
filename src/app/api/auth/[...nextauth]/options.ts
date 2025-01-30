import { CustomUserJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const { email, password } = credentials || {};
          
          const accessToken = await fetch(`${process.env.NEXT_PUBLIC_PROXY_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }).then((res) => res.json());
          //jwt decode
          const decoded = jwtDecode<CustomUserJwtPayload>(accessToken);
          console.log({...decoded,accessToken})
          if (accessToken) {
            return {...decoded,accessToken};
          }
          return accessToken;
        },
      }),
    ],
    callbacks:{
      async jwt({ token, user, account, profile }) {
        // if(user){
        //   token.accessToken=user.accessToken
        // }
        // console.log("JWT-Token: ",token,"User: ",user,"Account ",account,"Profile ",profile)
        return {...token,...user}
      },
      async session({ session, user, token }) {
        // if (token) {
        //   session.user.accessToken = token.accessToken;
        // }
        session.user=token
        // console.log("Session: ",session,"User: ",user,"Token ",token)
        return session
      },
    },
    pages: {
        signIn: "/login",
      },
      session: {
        strategy: "jwt",
      },
    secret: process.env.NEXTAUTH_SECRET
}

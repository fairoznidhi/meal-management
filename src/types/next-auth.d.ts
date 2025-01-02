import 'next-auth'
// import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User extends NextAuth.User {
        accessToken?:string;
    }
    interface Session extends NextAuth.Session {
        user:{
            accessToken?:string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT {
        accessToken?:string;
    }
}
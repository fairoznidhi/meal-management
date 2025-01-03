//import { loginUser } from "@/utils/actions/loginUser";
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions:NextAuthOptions={
//     providers:[
//         CredentialsProvider({
//             id:"credentials",
//             name:"Credentials",
//             credentials: {
//                 email: { label: "Email", type: "text", placeholder: "jsmith" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials:any):Promise<any>{
//                 const user=await loginUser({
//                     email:credentials.identifier,
//                     password:credentials.identifier
//                 })
//                 try{
//                     if(!user){
//                         throw new Error('No user found with this email')
//                     }
//                     // if(!user.isVerified){
//                     //     throw new Error('Email is not verified')
//                     // }
//                     const isPasswordValid = user.password === credentials.password;
//                     if (!isPasswordValid) {
//                         throw new Error("Invalid password");
//                     }
//                 } catch(err:any){
//                     throw new Error(err)
//                 }
//                 return user
//             }
//         }),
//     ],
//     pages:{
//         signIn: '/sign-in',
//     },
//     session:{
//         strategy: "jwt",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
    
// }
import { AuthOptions, getServerSession, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_KEY as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "auth/login"
  },
};

// const authOptions: NextAuthOptions = {
//   providers: [
//     // GoogleProvider and CredentialsProvider configurations
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET_KEY as string,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 1 * 24 * 60 * 60, // 1 day
//   },
//   jwt: {
//     // JWT encoding and decoding configurations
//   },
//   callbacks: {
//     // signIn, session callbacks
//   },
//   pages: {
//     signIn: "/signIn", // Custom sign-in page
//   },
// };

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };

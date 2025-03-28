import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 检查环境变量中的管理员凭据
        const adminUsername = process.env.ADMIN_USERNAME || 'doomwang91';
        const adminPassword = process.env.ADMIN_PASSWORD || 'mina1995';

        if (
          credentials?.username === adminUsername &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: adminUsername,
            email: "admin@example.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore - 忽略TypeScript类型错误
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore - 忽略TypeScript类型错误
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
};

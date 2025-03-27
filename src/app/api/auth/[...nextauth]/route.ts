import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// 定义用户类型
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 定义自定义会话类型
interface CustomSession extends Session {
  user: {
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    [key: string]: any;
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        // 添加类型检查，确保credentials不为undefined
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        // 这里可以连接数据库验证，简化版本只允许一个管理员登录
        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { 
            id: "1", 
            name: "Admin", 
            email: "admin@example.com",
            role: "admin"
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // 使用更通用的类型定义，避免类型错误
    async session(params) {
      const { session, token } = params;
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

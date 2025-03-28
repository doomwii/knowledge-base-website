import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 使用NextAuth官方推荐的类型定义方式
export const authOptions: NextAuthOptions = {
  // 添加调试模式，帮助排查问题
  debug: true,
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
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  }
};

// 使用NextAuth官方API创建处理程序
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

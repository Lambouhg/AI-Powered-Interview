import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api|sign-in.*|sign-up.*).*)",
    "/api/:path*",
  ],
};

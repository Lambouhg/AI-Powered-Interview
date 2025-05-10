import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head"; // Import Head từ next/head
import "./globals.css";
import ChatbaseWidget from "../components/ChatbaseWidget";
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MyApp({ Component, pageProps }) {
  if (!clerkKey) {
    return <p>Lỗi r nè</p>;
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <Head>
        <title>Job Finder</title> {/* Đặt title cho ứng dụng */}
        <meta name="description" content="This is my awesome app!" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <ChatbaseWidget />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;

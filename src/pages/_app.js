import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head"; // Import Head từ next/head
import { Toaster } from "react-hot-toast"; // Thay ToastProvider bằng Toaster
import "./globals.css";

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
      <Toaster /> {/* Thêm Toaster ở đây */}
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
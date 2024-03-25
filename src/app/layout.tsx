import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Notification from "@/components/Notification";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | MS RESTURANT & BURGERS",
    default: "MS RESTURANT & BURGERS"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <link rel="icon" href="/logo-no-background.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
          <Notification />
          <Navbar />
          {children}
          <Footer />
          <ToastContainer position="bottom-right" theme="dark" autoClose={3000}/>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

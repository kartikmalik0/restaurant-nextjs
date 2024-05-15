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
import { ChakraProvider } from '@chakra-ui/react'
import { Providers } from "./chakraProvider";
const inter = Inter({ subsets: ["latin"] });
import { fonts } from "./fonts";
import MaxHeightWrapper from "@/components/MaxHeightWrapper";
import NextTopLoader from 'nextjs-toploader';


export const metadata: Metadata = {
  title: {
    template: "%s | MS RESTURANT & BURGERS",
    default: "MS RESTURANT & BURGERS",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <link rel="icon" href="/logo-no-background.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <Providers>
              {/* <Notification /> */}
              <Navbar />
              <MaxHeightWrapper>
              <NextTopLoader color="#ef4444" showSpinner={false}/>

              {children}
              </MaxHeightWrapper>
              <Footer />
              <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
            </Providers>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

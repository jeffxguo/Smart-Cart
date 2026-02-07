import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import StoreProvider from "./components/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartCart",
  description: "AI-powered shopping assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

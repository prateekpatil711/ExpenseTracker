import "./globals.css";
import { Inter } from "next/font/google";
import Menu from "./menu/page";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expense",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-800 text-slate-100 p-4 container-fluid`}
      >
        <Menu/>
        {children}
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auragram",
  description: "SOCIAL MEDIA REIMAGINED",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[url(/images/noise-texture.png)] bg-repeat`}
      >
        {children}
      </body>
    </html>
  );
}

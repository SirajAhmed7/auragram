import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { getCurrentUser } from "@/lib/actions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auragram",
  description: "SOCIAL MEDIA REIMAGINED",
};

export default async function RootLayout({ children }) {
  // Fetch initial user data on the server
  const initialUser = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[url(/images/noise-texture.png)] bg-repeat`}
      >
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </body>
    </html>
  );
}

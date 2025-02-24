import "./globals.css";
import { Inter } from "next/font/google";
import { SavedJobsProvider } from "@/context/SavedJobsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Unibui Jobs",
  description: "Job Discovery App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SavedJobsProvider>
          {children}
        </SavedJobsProvider>
      </body>
    </html>
  );
}

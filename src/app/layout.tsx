import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="fixed top-0 left-0 w-full h-16 bg-black text-white flex items-center p-4 shadow-md">
          <h1 className="text-xl font-bold">Unibui Jobs</h1>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

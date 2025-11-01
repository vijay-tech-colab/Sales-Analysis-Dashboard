import "./globals.css"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Dashboard",
  description: "Modern dashboard app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-0 m-0">
       <NextTopLoader
           color="#7A3AED" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
           shadow="0 0 10px #7A3AED, 0 0 5px #2563eb"
          showSpinner={false}
        />
        {children}
      </body>
    </html>
  )
}

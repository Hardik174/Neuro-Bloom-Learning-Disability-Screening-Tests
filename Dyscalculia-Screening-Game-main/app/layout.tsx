import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CandylandBackground from "./CandylandBackground/page"

export const metadata = {
  title: "Math Adventure - Dyscalculia Screening",
  description: "Fun interactive math games for dyscalculia screening",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CandylandBackground>
            {children}
          </CandylandBackground>
        </ThemeProvider>
      </body>
    </html>
  )
}
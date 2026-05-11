import { Toaster } from "@/components/ui/sonner"
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
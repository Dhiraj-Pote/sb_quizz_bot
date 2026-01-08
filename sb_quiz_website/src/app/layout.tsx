import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Śrīmad Bhāgavatam Quiz | Test Your Knowledge",
  description: "Interactive quiz platform for ISKCON devotees to test their knowledge of Śrīmad Bhāgavatam. Chapter-wise quizzes with leaderboards.",
  keywords: ["Srimad Bhagavatam", "ISKCON", "Quiz", "Krishna", "Vedic", "Spiritual"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

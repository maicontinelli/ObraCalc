import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SimpleNav from "@/components/SimpleNav";
import { Footer } from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space",
    display: "swap",
});

export const metadata: Metadata = {
    title: "ObraCalc - Orçamentos de Construção",
    description: "Sistema simples e gratuito para criar orçamentos de construção com IA",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
                <div className="fixed inset-0 z-[-1] flex items-center justify-center opacity-30 pointer-events-none select-none overflow-hidden">
                    {/* Background Logo Watermark */}
                    <img
                        src="/obracalc-logo-new.png"
                        alt=""
                        className="w-[85vw] max-w-[1000px] h-auto object-contain opacity-50 contrast-50 grayscale"
                    />
                </div>
                <SimpleNav />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

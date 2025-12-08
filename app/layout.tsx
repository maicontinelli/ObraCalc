import type { Metadata } from "next";
import "./globals.css";
import SimpleNav from "@/components/SimpleNav";
import { Footer } from "@/components/Footer";

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
            <body className="antialiased">
                <SimpleNav />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

import { Building2, Home, Landmark, Warehouse } from "lucide-react";

export function TrustBar() {
    return (
        <section className="pt-48 pb-10 bg-transparent relative z-20">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-normal tracking-wide mb-2">
                    Integração direta com as bases de referência nacional
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600">SINAPI</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600">SICRO</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600">ORSE</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600">TCPO</div>
                </div>
            </div>
        </section>
    );
}

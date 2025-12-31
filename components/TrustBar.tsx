import { Building2, Home, Landmark, Warehouse } from "lucide-react";

export function TrustBar() {
    return (
        <section className="py-10 bg-transparent">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-[#6b6967] mb-6">
                    CONFIADO POR MAIS DE 5.000 PROFISSIONAIS
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-bold text-xl text-[#8a8886]">
                        <Building2 className="h-6 w-6" />
                        <span>Constructa</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-[#8a8886]">
                        <Home className="h-6 w-6" />
                        <span>LarDoce</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-[#8a8886]">
                        <Landmark className="h-6 w-6" />
                        <span>ArchTech</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl text-[#8a8886]">
                        <Warehouse className="h-6 w-6" />
                        <span>BuildFast</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

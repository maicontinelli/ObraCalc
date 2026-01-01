import { createClient } from '@/lib/supabase/client';
import { BOQ_TEMPLATES } from '@/lib/constants';

export type CatalogItem = {
    id: string;
    category: string;
    name: string;
    unit: string;
    price: number;
    materialPrice?: number;
    laborPrice?: number;
    description?: string;
};

// Simple in-memory cache to avoid repeated DB calls in same session
let cachedCatalog: CatalogItem[] | null = null;

// Ratio definitions: [Material %, Labor %]
const CATEGORY_RATIOS: Record<string, [number, number]> = {
    'SERVIÇOS PRELIMINARES E GERAIS': [0.15, 0.85],
    'DEMOLIÇÕES E RETIRADAS': [0.05, 0.95],
    'MOVIMENTAÇÃO DE TERRA': [0.10, 0.90],
    'INFRAESTRUTURA / FUNDAÇÕES': [0.55, 0.45],
    'SUPERESTRUTURA': [0.55, 0.45],
    'PAREDES E PAINÉIS': [0.60, 0.40],
    'ESTRUTURAS METÁLICAS E MADEIRA': [0.70, 0.30],
    'COBERTURA E TELHADO': [0.65, 0.35],
    'IMPERMEABILIZAÇÃO': [0.45, 0.55],
    'REVESTIMENTOS DE PAREDE': [0.60, 0.40],
    'FORROS': [0.60, 0.40],
    'PISOS E RODAPÉS': [0.70, 0.30],
    'ESQUADRIAS E VIDROS': [0.85, 0.15],
    'INSTALAÇÕES ELÉTRICAS': [0.45, 0.55],
    'INSTALAÇÕES HIDRÁULICAS': [0.45, 0.55],
    'LOUÇAS E METAIS': [0.85, 0.15],
    'PINTURA': [0.30, 0.70],
    'SERVIÇOS FINAIS / DIVERSOS': [0.20, 0.80]
};

// Helper to get ratio for any category string (handles numbering and fuzzy matches)
function getRatio(category: string): [number, number] {
    const normalized = category.toUpperCase();
    // Try exact match first
    for (const [key, ratio] of Object.entries(CATEGORY_RATIOS)) {
        if (normalized.includes(key)) return ratio;
    }
    // Default fallback
    return [0.50, 0.50];
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
    if (cachedCatalog && cachedCatalog.length > 0) {
        return cachedCatalog;
    }

    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching catalog from Supabase:', error);
            throw error;
        }

        if (data && data.length > 0) {
            // Map snake_case DB columns to camelCase TS properties
            const mappedData = data.map((item: any) => {
                const ratios = getRatio(item.category);

                // SAFETY CHECK: If labor/material price equals full price, ignore it and force ratio calc.
                // This handles cases where DB might have full price in partial columns incorrectly.

                const materialInfo = (item.material_price && Number(item.material_price) > 0 && Number(item.material_price) < item.price)
                    ? Number(item.material_price)
                    : item.price * ratios[0];

                const laborInfo = (item.labor_price && Number(item.labor_price) > 0 && Number(item.labor_price) < item.price)
                    ? Number(item.labor_price)
                    : item.price * ratios[1];

                return {
                    ...item,
                    materialPrice: materialInfo,
                    laborPrice: laborInfo
                };
            });
            cachedCatalog = mappedData;
            return mappedData;
        }
    } catch (err) {
        console.warn('Falling back to local constants due to DB error or empty result.');
    }

    // Fallback logic for local constants
    const fallbackItems = BOQ_TEMPLATES.obra_nova.flatMap(cat =>
        cat.items.map(item => {
            const ratios = getRatio(cat.name);
            return {
                id: item.id,
                category: cat.name,
                name: item.name,
                unit: item.unit,
                price: item.price,
                materialPrice: item.price * ratios[0],
                laborPrice: item.price * ratios[1],
                description: 'Local fallback'
            };
        })
    );

    cachedCatalog = fallbackItems;
    return fallbackItems;
}

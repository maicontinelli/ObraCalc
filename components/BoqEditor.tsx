'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, FileText, Settings, ChevronDown, Sparkles, Loader2, Cloud, CloudOff } from 'lucide-react';
import CommandSearch, { BoqItem } from './CommandSearch';
import { BOQ_TEMPLATES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { getDddInfo } from '@/lib/ddd-data';

export default function BoqEditor({ estimateId }: { estimateId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams?.get('type') as 'obra_nova') || 'obra_nova';

    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isCloudSynced, setIsCloudSynced] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [items, setItems] = useState<BoqItem[]>([]);
    const [bdi, setBdi] = useState(20);
    const [providerName, setProviderName] = useState('');
    const [clientName, setClientName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [deadline, setDeadline] = useState('');
    const [providerPhone, setProviderPhone] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [workCity, setWorkCity] = useState('');
    const [workState, setWorkState] = useState('');
    const [aiRequests, setAiRequests] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [budgetCount, setBudgetCount] = useState(0); // Track budget count for limits

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // FULL Default Items Template generated from shared constants
    const DEFAULT_ITEMS: BoqItem[] = useMemo(() => {
        return BOQ_TEMPLATES.obra_nova.flatMap(cat =>
            cat.items.map(item => ({
                id: item.id,
                category: cat.name.toUpperCase(), // Normalize to Uppercase for consistency
                name: item.name,
                unit: item.unit,
                quantity: item.quantity || 0,
                price: item.price,
                included: false
            }))
        );
    }, []);

    // Auth & Limit Check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { count } = await supabase
                    .from('budgets')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                setBudgetCount(count || 0);
            }
        };
        checkUser();
    }, []);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            let dataToLoad = null;
            let fromCloud = false;

            // 1. Try Supabase first if logged in
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('budgets')
                        .select('content, updated_at')
                        .eq('id', estimateId)
                        .maybeSingle();

                    if (data && data.content) {
                        dataToLoad = data.content;
                        fromCloud = true;
                        setLastSaved(new Date(data.updated_at));
                        setIsCloudSynced(true);
                    }
                } catch (err) {
                    console.error("Error loading from cloud:", err);
                }
            }

            // 2. Fallback to LocalStorage if not in cloud
            if (!dataToLoad) {
                const localData = localStorage.getItem(`estimate_${estimateId}`);
                if (localData) {
                    dataToLoad = JSON.parse(localData);
                }
            }

            // 3. Apply Data
            let finalItems: BoqItem[] = [];

            if (dataToLoad) {
                try {
                    const parsed = dataToLoad;
                    let loadedItems = parsed.items || [];
                    const hasStructure = loadedItems.some((i: BoqItem) => i.category?.includes('ESTRUTURA') || i.category?.includes('Estrutura'));

                    if (loadedItems.length < 10 && !hasStructure) {
                        const mergedItems = [...DEFAULT_ITEMS];
                        loadedItems.forEach((savedItem: BoqItem) => {
                            const index = mergedItems.findIndex(def => def.id === savedItem.id);
                            if (index !== -1) {
                                if (savedItem.quantity > 0 || savedItem.included) {
                                    mergedItems[index] = { ...mergedItems[index], ...savedItem };
                                }
                            } else if (savedItem.isCustom || savedItem.included) {
                                mergedItems.push(savedItem);
                            }
                        });
                        loadedItems = mergedItems;
                    }

                    finalItems = loadedItems;
                    setItems(loadedItems);
                    setBdi(parsed.bdi || 20);
                    setProviderName(parsed.providerName || '');
                    setClientName(parsed.clientName || '');
                    setProjectType(parsed.projectType || '');
                    setDeadline(parsed.deadline || '');
                    setProviderPhone(parsed.providerPhone || '');
                    setClientPhone(parsed.clientPhone || '');
                    setWorkCity(parsed.workCity || '');
                    setWorkState(parsed.workState || '');
                    setAiRequests(parsed.aiRequests || []);
                } catch (e) {
                    console.error("Error parsing estimate:", e);
                    finalItems = DEFAULT_ITEMS;
                    setItems(DEFAULT_ITEMS);
                }
            } else {
                finalItems = DEFAULT_ITEMS;
                setItems(DEFAULT_ITEMS);
            }

            // Auto-fill Provider Info from User Profile if empty (New Budget Strategy)
            if (user && user.user_metadata) {
                // Prefer company name, fallback to full name
                const profileName = user.user_metadata.company_name || user.user_metadata.full_name;
                const profilePhone = user.user_metadata.phone;

                // Only overwrite if current state is empty (don't overwrite saved data)
                if (!providerName && !dataToLoad?.providerName && profileName) {
                    setProviderName(profileName);
                }
                if (!providerPhone && !dataToLoad?.providerPhone && profilePhone) {
                    setProviderPhone(profilePhone);
                }
            }

            // 4. Auto-expand
            const initialExpanded: Record<string, boolean> = {};
            finalItems.forEach((item: BoqItem) => {
                if (item.isCustom || (item.aiRequestId && item.included)) {
                    initialExpanded[item.category] = true;
                }
            });
            setExpandedCategories(prev => ({ ...prev, ...initialExpanded }));

            setIsLoaded(true);
        };

        if (!isLoaded || user) { // Reload if user changes (login)
            loadData();
        }

    }, [estimateId, user, DEFAULT_ITEMS]);

    // Save to localStorage ONLY (Cloud save will be manual)
    useEffect(() => {
        if (!isLoaded) return;

        const dataToSave = {
            id: estimateId,
            items,
            bdi,
            providerName,
            clientName,
            projectType,
            deadline,
            providerPhone,
            clientPhone,
            workCity,
            workState,
            updatedAt: new Date().toISOString(),
            aiRequests
        };

        // LocalStorage (Immediate & Cheap)
        localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(dataToSave));

        // Update estimates list locally
        const estimatesList = JSON.parse(localStorage.getItem('estimates_list') || '[]');
        const existingIndex = estimatesList.findIndex((e: any) => e.id === estimateId);

        const listEntry = {
            id: estimateId,
            clientName: clientName || 'Novo Orçamento',
            updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            estimatesList[existingIndex] = listEntry;
        } else {
            estimatesList.push(listEntry);
        }
        localStorage.setItem('estimates_list', JSON.stringify(estimatesList));

        // Note: Cloud save removed from here to reduce traffic. 
        // Will be triggered manually or on report generation.
        setIsCloudSynced(false);

    }, [estimateId, items, bdi, providerName, clientName, projectType, deadline, providerPhone, clientPhone, workCity, workState, aiRequests, isLoaded]);


    const MAX_FREE_ITEMS = 20;
    // TODO: Connect this to real subscription state. For now, only Logged users are "Premium" enough to bypass the initial limit.
    // Ideally, we should check user.subscription_status or similar.
    const isPremium = !!user;

    // Handlers
    const toggleInclude = (id: string, forceState?: boolean) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const willBeIncluded = forceState !== undefined ? forceState : !item.included;

        // Count currently included items
        const currentCount = items.filter(i => i.included).length;

        // If we are turning it ON, and we are NOT premium, and we hit the limit
        if (willBeIncluded && !item.included && !isPremium && currentCount >= MAX_FREE_ITEMS) {
            alert(`Limpo do Plano Grátis atingido! \n\nVocê só pode adicionar até ${MAX_FREE_ITEMS} itens no plano gratuito.\n\nAssine o Plano Profissional para criar orçamentos ilimitados.`);
            return;
        }

        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, included: willBeIncluded };
            }
            return item;
        }));
    };

    const handleQuantityChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: isNaN(numValue) ? 0 : numValue, included: true } : item));
    };

    const handlePriceChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        setItems(prev => prev.map(item => item.id === id ? { ...item, manualPrice: isNaN(numValue) ? 0 : numValue, included: true } : item));
    };

    const handleNameChange = (id: string, name: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, name, included: true } : item));
    };

    const handleUnitChange = (id: string, unit: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, unit, included: true } : item));
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleAddCustomItem = (category: string) => {
        const newItem: BoqItem = {
            id: crypto.randomUUID(),
            name: '',
            unit: 'un',
            quantity: 0,
            price: 0,
            category: category,
            included: true,
            isCustom: true
        };
        setItems([...items, newItem]);
    };

    const toggleCategoryItems = (category: string, shouldInclude: boolean) => {
        setItems(items.map(item =>
            item.category === category ? { ...item, included: shouldInclude } : item
        ));
    };

    const toggleCategoryExpansion = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSaveToCloud = async () => {
        if (!user) return;

        // Restriction: Free Plan Limit (Max 3 Budgets)
        // Ensure we are not blocking updates to existing (already saved) budgets.
        // We assume 'lastSaved' is non-null if it's an existing cloud budget AND we are just updating.
        // If lastSaved is null, it's a new insertion.
        const MAX_FREE_BUDGETS = 3;
        // Re-read isPremium from scope or define logic here. 
        // We will strictly enforce limit for ALL users until "pro" plan bit is set in DB.
        // Temporary: Treat everyone as Free for this test.
        const isUserPremium = false;

        if (!isUserPremium && !lastSaved && budgetCount >= MAX_FREE_BUDGETS) {
            alert(`Limite do Plano Grátis Atingido!\n\nVocê já possui ${budgetCount} orçamentos salvos.\nO plano gratuito permite salvar até ${MAX_FREE_BUDGETS} orçamentos.\n\nAssine o Plano Profissional para criar orçamentos ilimitados.`);
            return;
        }

        setIsCloudSynced(false);

        const dataToSave = {
            id: estimateId,
            items,
            bdi,
            providerName,
            clientName,
            projectType,
            deadline,
            providerPhone,
            clientPhone,
            workCity,
            workState,
            updatedAt: new Date().toISOString(),
            aiRequests
        };

        try {
            const { error } = await supabase.from('budgets').upsert({
                id: estimateId,
                user_id: user.id,
                title: clientName ? `${clientName}` : 'Sem Título',
                content: dataToSave,
                updated_at: new Date().toISOString(),
                client_name: clientName,
                client_phone: clientPhone,
                project_type: projectType,
                work_city: workCity,
                work_state: workState,
                status: 'draft'
            });

            if (!error) {
                setIsCloudSynced(true);
                setLastSaved(new Date());
            } else {
                console.error('Supabase Save Error:', error);
            }
        } catch (err) {
            console.error('Cloud Save Exception:', err);
        }
    };

    const handleGenerateReport = async () => {
        setIsSaving(true);
        // Force save locally one last time
        const dataToSave = {
            id: estimateId,
            items,
            bdi,
            providerName,
            clientName,
            projectType,
            deadline,
            providerPhone,
            clientPhone,
            workCity,
            workState,
            updatedAt: new Date().toISOString(),
            aiRequests
        };
        localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(dataToSave));

        // Save to Cloud if logged in
        if (user) {
            await handleSaveToCloud();
        } else {
            // "Arapuca de Leads": Silent capture for anonymous users
            // Fire-and-forget: we don't await this nor block the user flow
            supabase.from('anonymous_leads').insert({
                provider_name: providerName,
                provider_phone: providerPhone,
                client_name: clientName,
                client_phone: clientPhone,
                project_type: projectType,
                work_city: workCity,
                work_state: workState,
                origin: 'editor_guest'
            }).then(({ error }) => {
                if (error) console.error('Lead Trap Error:', error);
            });

            // Small delay locally only
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        router.push(`/report/${estimateId}`);
    };

    // Calculations
    const includedItems = items.filter(i => i.included);

    const subtotal = useMemo(() =>
        includedItems.reduce((sum, item) => {
            const price = item.manualPrice ?? item.price;
            return sum + (Number(price) * Number(item.quantity));
        }, 0),
        [includedItems]);

    const bdiValue = subtotal * (bdi / 100);
    const total = subtotal + bdiValue;

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, BoqItem[]> = {};

        // Get standard categories from template
        const templateCategories = BOQ_TEMPLATES.obra_nova.map(c => c.name.toUpperCase());

        // Initialize groups
        templateCategories.forEach(cat => {
            groups[cat] = [];
        });

        // Populate items
        items.forEach(item => {
            // If category matches standard (case insensitive check just in case), use it. 
            // Otherwise create new group if needed.
            // But we already normalized to Uppercase in load/add.
            const cat = item.category || 'ITENS ADICIONAIS';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });

        return groups;
    }, [items]);

    // Get categories maintaining the preferred order: Custom First, then Standard
    const categories = useMemo(() => {
        const defaultCats = BOQ_TEMPLATES.obra_nova.map(c => c.name.toUpperCase());
        const activeCats = Object.keys(groupedItems).filter(cat => groupedItems[cat].length > 0);

        const standard = defaultCats.filter(c => activeCats.includes(c));
        const custom = activeCats.filter(c => !defaultCats.includes(c) && c !== 'ITENS ADICIONAIS');
        const others = activeCats.filter(c => c === 'ITENS ADICIONAIS');

        // Custom (AI) -> Standard -> Others
        return [...custom, ...standard, ...others];
    }, [groupedItems]);

    // Get DDD info for phone numbers
    // Get DDD info for phone numbers
    const providerDddInfo = useMemo(() => getDddInfo(providerPhone), [providerPhone]);
    const clientDddInfo = useMemo(() => getDddInfo(clientPhone), [clientPhone]);

    // Auto-fill Work Location from Client Phone DDD
    useEffect(() => {
        if (clientDddInfo) {
            // Only auto-fill if fields are empty to avoid overwriting user manual input
            if (!workState) {
                setWorkState(clientDddInfo.state);
            }
            if (!workCity) {
                // Use the first city or region as a suggestion
                // Ideally we would put the 'region' string, but city field implies a specific city.
                // Let's use the first city in the list as a best guess/suggestion.
                if (clientDddInfo.cities.length > 0) {
                    setWorkCity(clientDddInfo.cities[0]);
                }
            }
        }
    }, [clientDddInfo, workState, workCity]);

    // Phone formatting helper
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    const handlePhoneChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numeric = rawValue.replace(/\D/g, '');

        // Limit to 11 digits
        if (numeric.length > 11) return;

        let formatted = numeric;
        if (numeric.length > 2) formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2)}`;
        if (numeric.length > 7) formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2, 7)}-${numeric.slice(7)}`;

        setter(formatted);
    };

    const isFormValid = useMemo(() => {
        return (
            providerName.trim() !== '' &&
            clientName.trim() !== '' &&
            providerPhone.replace(/\D/g, '').length >= 10 &&
            clientPhone.replace(/\D/g, '').length >= 10 &&
            projectType !== '' &&
            deadline !== ''
        );
    }, [providerName, clientName, providerPhone, clientPhone, projectType, deadline]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="max-w-[1600px] mx-auto p-6 lg:p-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Labels for AI vs Manual */}
                        <div className="flex items-center justify-between px-1 mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500/80">
                                ✨ Gerar com IA
                            </span>

                            {/* Cloud Save Button */}
                            {user && (
                                <button
                                    onClick={handleSaveToCloud}
                                    disabled={isCloudSynced}
                                    className={`flex items-center gap-1.5 transition-all duration-300 px-2 py-1 rounded-md group ${isCloudSynced ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer'}`}
                                    title={isCloudSynced ? "Sincronizado com a nuvem" : "Clique para salvar na nuvem"}
                                >
                                    {isCloudSynced ? (
                                        <>
                                            <Cloud className="w-3 h-3 text-green-500" />
                                            <span className="text-[10px] font-medium">Salvo {lastSaved ? `às ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
                                        </>
                                    ) : (
                                        <>
                                            <CloudOff className="w-3 h-3 text-blue-500 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-medium">Salvar na Nuvem</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* AI Assistant Search Bar */}
                        <div className="mb-2">
                            <CommandSearch
                                items={items}
                                onSelect={(item) => {
                                    // Expand the category where the item is located
                                    setExpandedCategories(prev => ({
                                        ...prev,
                                        [item.category]: true
                                    }));

                                    // Scroll to item after a short delay to allow expansion animation
                                    setTimeout(() => {
                                        const element = document.getElementById(`item-${item.id}`);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            // Optional: Add a temporary highlight effect
                                            element.classList.add('bg-blue-50');
                                            setTimeout(() => element.classList.remove('bg-blue-50'), 2000);

                                            // Focus quantity input if possible
                                            const quantityInput = element.querySelector('input[type="number"]') as HTMLInputElement;
                                            if (quantityInput) {
                                                quantityInput.focus();
                                                quantityInput.select();
                                            }
                                        }
                                    }, 300);
                                }}
                                onAddCustom={(newItems, request) => {
                                    const requestId = crypto.randomUUID();
                                    // FORCE Single Group: Use title/query as category for ALL items, ignoring internal categories
                                    const targetCategory = (request?.suggestedTitle || request?.query || 'ITENS ADICIONAIS').toUpperCase();

                                    const itemsWithIds = newItems.map(item => ({
                                        ...item,
                                        id: crypto.randomUUID(),
                                        included: true,
                                        category: targetCategory,
                                        aiRequestId: requestId
                                    }));
                                    setItems(prev => [...itemsWithIds, ...prev]);
                                    if (request) {
                                        setAiRequests(prev => [...prev, { ...request, id: requestId, timestamp: new Date().toISOString() }]);
                                    }
                                    // Auto-expand the target category
                                    setExpandedCategories(prev => ({
                                        ...prev,
                                        [targetCategory]: true
                                    }));
                                }}
                            />
                        </div>



                        {/* Main List Container */}
                        <div className="">
                            <div className="mb-3 px-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                    ✏️ Adicionar manualmente
                                </span>
                            </div>
                            {/* Items List Content - Removed divide-y, using space-y for cleaner separation */}
                            <div className="space-y-2">
                                {categories.map((category) => {
                                    const categoryItems = groupedItems[category];
                                    const categoryIncluded = categoryItems.filter(i => i.included).length;
                                    const isExpanded = expandedCategories[category];

                                    // Calculate Category Total
                                    const categoryTotal = categoryItems.reduce((sum, item) => {
                                        if (!item.included) return sum;
                                        const price = item.manualPrice ?? item.price;
                                        return sum + (price * item.quantity);
                                    }, 0);

                                    return (
                                        <div key={category} className="rounded-lg">
                                            {/* Group Header */}
                                            <div className="flex items-center justify-between px-4 py-3 group cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleCategoryExpansion(category)}>
                                                <div className="flex items-center gap-3">
                                                    <ChevronDown
                                                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`}
                                                    />
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                            {category}
                                                        </h3>
                                                        <span className="text-[10px] text-gray-400 font-normal">
                                                            ({categoryItems.length})
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                    <span className="text-xs font-bold text-gray-700 tabular-nums">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryTotal)}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleCategoryItems(category, categoryIncluded < categoryItems.length)}
                                                        className={`w-4 h-4 border rounded transition-colors flex items-center justify-center ${categoryIncluded > 0 // Show check if ANY item is included
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {categoryIncluded > 0 && <span className="text-[8px] font-bold">✓</span>}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Items List (Accordion Body) */}
                                            {isExpanded && (
                                                <div className="pb-4 pt-1 bg-white border-t border-gray-50">
                                                    {/* Column Headers */}
                                                    <div className="grid grid-cols-12 gap-4 mb-2 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <div className="col-span-1"></div>
                                                        <div className="col-span-4">Descrição</div>
                                                        <div className="col-span-1 text-center">Un.</div>
                                                        <div className="col-span-2 text-center">Qtd</div>
                                                        <div className="col-span-2 text-right">Unit</div>
                                                        <div className="col-span-2 text-right">Total</div>
                                                    </div>
                                                    <div className="space-y-0 text-[11px]">
                                                        {(() => {
                                                            // Sort: Services/Compositions first, then Materials
                                                            const getType = (i: BoqItem) => i.type || 'composition';
                                                            const sorted = [...categoryItems].sort((a, b) => {
                                                                const typeA = getType(a);
                                                                const typeB = getType(b);
                                                                if (typeA === 'material' && typeB !== 'material') return 1;
                                                                if (typeA !== 'material' && typeB === 'material') return -1;
                                                                return 0;
                                                            });

                                                            return sorted.map((item, index) => {
                                                                const currentType = getType(item);
                                                                const prevType = index > 0 ? getType(sorted[index - 1]) : null;
                                                                const showDivider = currentType === 'material' && prevType !== 'material' && index > 0;

                                                                return (
                                                                    <React.Fragment key={item.id}>
                                                                        {showDivider && (
                                                                            <div className="px-4 py-1.5 bg-orange-50/50 border-y border-orange-100/50 text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mt-1 mb-1 flex items-center gap-2">
                                                                                <span className="text-[10px]">🧱</span> Materiais / Insumos
                                                                            </div>
                                                                        )}
                                                                        <div
                                                                            id={`item-${item.id}`}
                                                                            onClick={() => toggleInclude(item.id, true)} // Select on row click
                                                                            className={`grid grid-cols-12 gap-4 px-4 py-1 items-center hover:bg-gray-50 transition-colors group/item cursor-pointer ${!item.included ? 'opacity-50' : ''}`}
                                                                        >
                                                                            {/* Checkbox */}
                                                                            <div className="col-span-1 flex justify-center -ml-4" onClick={(e) => e.stopPropagation()}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={item.included}
                                                                                    onChange={() => toggleInclude(item.id)} // Specific toggle logic
                                                                                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                                />
                                                                            </div>

                                                                            {/* Name & Icon */}
                                                                            <div className="col-span-4 flex items-center gap-2">
                                                                                {/* Type Icon */}
                                                                                <span
                                                                                    title={currentType === 'service' ? 'Serviço (Mão de Obra)' : currentType === 'material' ? 'Material' : 'Composição (Serviço + Material)'}
                                                                                    className="text-[10px] shrink-0 opacity-50 cursor-help select-none"
                                                                                >
                                                                                    {currentType === 'service' ? '🔨' : currentType === 'material' ? '🧱' : '🛠️'}
                                                                                </span>
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.name}
                                                                                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                                                                                    className="w-full bg-transparent border-none p-0 text-[11px] font-medium text-gray-600 focus:text-gray-900 focus:ring-0 placeholder-gray-300 leading-tight"
                                                                                    placeholder="Nome do item"
                                                                                />
                                                                            </div>

                                                                            {/* Unit */}
                                                                            <div className="col-span-1 text-center">
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.unit}
                                                                                    onChange={(e) => handleUnitChange(item.id, e.target.value)}
                                                                                    className="w-full text-center bg-transparent border-none p-0 text-[10px] text-gray-400 uppercase focus:ring-0"
                                                                                />
                                                                            </div>

                                                                            {/* Qty */}
                                                                            <div className="col-span-2 px-2">
                                                                                <input
                                                                                    type="number"
                                                                                    value={item.quantity}
                                                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                                    data-item-id={item.id}
                                                                                    className="w-full text-center bg-gray-50 border-none rounded py-1 text-[11px] text-gray-600 focus:text-gray-900 focus:ring-1 focus:ring-blue-500 hover:bg-gray-100 tabular-nums"
                                                                                    min="0"
                                                                                    step="1"
                                                                                />
                                                                            </div>

                                                                            {/* Unit Price */}
                                                                            <div className="col-span-2 text-right">
                                                                                <input
                                                                                    type="number"
                                                                                    value={item.manualPrice ?? item.price}
                                                                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                                                    className="w-full text-right bg-transparent border-none p-0 text-[11px] text-gray-500 focus:text-gray-900 focus:ring-0 tabular-nums"
                                                                                    min="0"
                                                                                    step="0.01"
                                                                                />
                                                                            </div>

                                                                            {/* Total & Trash */}
                                                                            <div className="col-span-2 text-right flex items-center justify-end gap-2 group/actions relative">
                                                                                <span className="text-[11px] font-bold text-gray-500 tabular-nums">
                                                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                                                        (item.manualPrice ?? item.price) * item.quantity
                                                                                    )}
                                                                                </span>
                                                                                {item.isCustom && (
                                                                                    <button
                                                                                        onClick={() => handleDelete(item.id)}
                                                                                        className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-600 p-1 absolute -right-6 md:static transition-all"
                                                                                        title="Excluir"
                                                                                    >
                                                                                        <Trash2 size={14} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                );
                                                            });
                                                        })()}
                                                    </div>

                                                    {/* Add Button */}
                                                    <div className="mt-4 flex justify-center border-t border-dashed border-gray-100 pt-4 mx-6">
                                                        <button
                                                            onClick={() => handleAddCustomItem(category)}
                                                            className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors py-2 px-4 rounded hover:bg-blue-50"
                                                        >
                                                            <Plus size={12} /> Adicionar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (1/3) */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">

                        {/* Legend Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Legenda</h3>
                            <div className="space-y-2 text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🛠️</span>
                                    <span>Composição (Serviço + Material)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🔨</span>
                                    <span>Mão de Obra (Apenas Execução)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🧱</span>
                                    <span>Material (Insumo Isolado)</span>
                                </div>
                            </div>
                        </div>

                        {/* Totals Summary Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                Resumo do Orçamento
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <span>SUBTOTAL</span>
                                    <span>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>BDI</span>
                                        <div className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-500 font-mono">
                                            <input
                                                type="number"
                                                value={bdi}
                                                onChange={(e) => setBdi(parseFloat(e.target.value) || 0)}
                                                className="w-8 bg-transparent text-center outline-none"
                                                min="0"
                                                max="100"
                                            />
                                            %
                                        </div>
                                    </div>
                                    <span>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}
                                    </span>
                                </div>

                                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-green-600 uppercase">Total Geral</span>
                                    <span className="text-xl font-bold text-green-600 tabular-nums">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Information Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                Informações do Relatório
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Prestador *
                                    </label>
                                    <input
                                        type="text"
                                        value={providerName}
                                        onChange={(e) => setProviderName(e.target.value)}
                                        placeholder="Nome ou empresa"
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                            Telefone Prestador *
                                        </label>
                                        <input
                                            type="tel"
                                            value={providerPhone}
                                            onChange={handlePhoneChange(setProviderPhone)}
                                            placeholder="(00) 00000-0000"
                                            maxLength={15}
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        />
                                        {providerDddInfo && (
                                            <div className="mt-1.5 text-[10px] text-gray-500 flex items-center gap-1.5">
                                                <span className="font-semibold text-blue-600">{providerDddInfo.state}</span>
                                                <span>•</span>
                                                <span>{providerDddInfo.region}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                            Cliente *
                                        </label>
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="Nome completo"
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                            Telefone Cliente *
                                        </label>
                                        <input
                                            type="tel"
                                            value={clientPhone}
                                            onChange={handlePhoneChange(setClientPhone)}
                                            placeholder="(00) 00000-0000"
                                            maxLength={15}
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                        />
                                        {clientDddInfo && (
                                            <div className="mt-1.5 text-[10px] text-gray-500 flex items-center gap-1.5">
                                                <span className="font-semibold text-blue-600">{clientDddInfo.state}</span>
                                                <span>•</span>
                                                <span>{clientDddInfo.region}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                                Cidade da Obra
                                            </label>
                                            <input
                                                type="text"
                                                value={workCity}
                                                onChange={(e) => setWorkCity(e.target.value)}
                                                placeholder="Ex: São Paulo"
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                                UF
                                            </label>
                                            <input
                                                type="text"
                                                value={workState}
                                                onChange={(e) => setWorkState(e.target.value.toUpperCase().slice(0, 2))}
                                                placeholder="UF"
                                                maxLength={2}
                                                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                            Tipo de Obra *
                                        </label>
                                        <select
                                            value={projectType}
                                            onChange={(e) => setProjectType(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-500"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Construção Nova">Construção Nova</option>
                                            <option value="Reforma">Reforma</option>
                                            <option value="Ampliação">Ampliação</option>
                                        </select>
                                    </div>
                                    <div className="pt-6">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                            Prazo Estimado *
                                        </label>
                                        <select
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-500"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="imediato">Imediato (até 30 dias)</option>
                                            <option value="curto">Curto prazo (30 a 90 dias)</option>
                                            <option value="medio">Médio prazo (3 a 6 meses)</option>
                                            <option value="longo">Longo prazo (+6 meses)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>


                        {/* Generate Report Button - Relocated & Restyled */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={isSaving || !isFormValid}
                            className={`w-full mb-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 outline-none focus:outline-none ${isSaving || !isFormValid
                                ? 'bg-green-100 text-green-700 cursor-not-allowed opacity-80'
                                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="font-bold uppercase tracking-widest text-xs">Salvando...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className={`w-5 h-5 ${!isFormValid ? 'text-green-600' : 'text-white'}`} />
                                    <span className="font-bold uppercase tracking-widest text-xs">
                                        {isFormValid ? 'Gerar Relatório' : 'Preencha os Campos *'}
                                    </span>
                                </>
                            )}
                        </button>

                    </div>



                </div>
            </div>
        </div>
    );
}

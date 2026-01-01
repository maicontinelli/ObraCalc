'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, Camera, RefreshCw, AlertCircle, Home, Building2, Hammer, Flag, TrendingUp, CheckCircle2, User, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { SelectionList } from '@/components/SelectionList';

type ReportMode = 'LEIGO' | 'TECNICO';
type ProjectType = 'Residencial' | 'Comercial' | 'Reforma';
type ProjectStage = 'Inicial' | 'Em andamento' | 'Final';

interface ImageData {
    file: File;
    preview: string;
    base64?: string;
}

export default function RelatorioFotograficoPage() {
    const router = useRouter();
    const [images, setImages] = useState<ImageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [clientName, setClientName] = useState('');
    const [projectAddress, setProjectAddress] = useState('');
    const [projectType, setProjectType] = useState<ProjectType>('Residencial');
    const [projectStage, setProjectStage] = useState<ProjectStage>('Em andamento');
    const [mode, setMode] = useState<ReportMode>('LEIGO');
    const [technicalResponsible, setTechnicalResponsible] = useState('');
    const [creaCAU, setCreaCau] = useState('');
    const [builtArea, setBuiltArea] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    const [userObservations, setUserObservations] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);

            // Limit to 10 images to prevent localStorage issues
            if (selectedFiles.length + images.length > 10) {
                setError(`Máximo de 10 imagens permitidas. Você já tem ${images.length} e tentou adicionar ${selectedFiles.length}.`);
                return;
            }

            const validFiles = selectedFiles.filter(file =>
                file.type.startsWith('image/')
            );

            if (validFiles.length !== selectedFiles.length) {
                setError('Alguns arquivos não são imagens válidas e foram ignorados.');
            } else {
                setError(null); // Clear error if all are valid
            }

            if (validFiles.length === 0) {
                return; // No valid files to process
            }

            setIsCompressing(true);

            try {
                // Ultra-aggressive compression for localStorage
                const options = {
                    maxSizeMB: 0.1, // Max 100KB per image (was 200KB)
                    maxWidthOrHeight: 1000, // Reduced from 1200
                    useWebWorker: true,
                    fileType: 'image/jpeg' as const,
                    initialQuality: 0.6 // Lower quality (was 0.7)
                };

                // Compress all images
                const compressedFiles = await Promise.all(
                    validFiles.map(file => imageCompression(file, options))
                );

                const newImages: ImageData[] = compressedFiles.map(file => ({
                    file,
                    preview: URL.createObjectURL(file)
                }));

                setImages(prev => [...prev, ...newImages]);
            } catch (err) {
                console.error('Error processing images:', err);
                setError('Erro ao processar imagens. Tente novamente.');
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const convertImagesToBase64 = async (images: ImageData[]): Promise<ImageData[]> => {
        const promises = images.map(img => {
            return new Promise<ImageData>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        ...img,
                        base64: reader.result as string
                    });
                };
                reader.readAsDataURL(img.file);
            });
        });
        return Promise.all(promises);
    };

    const handleGenerateReport = async () => {
        if (images.length === 0) {
            setError('Por favor, adicione pelo menos uma imagem.');
            return;
        }

        if (!clientName || !projectAddress) {
            setError('Por favor, preencha o nome do cliente e o endereço da obra.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Convert images to base64 for storage and API
            const imagesWithBase64 = await convertImagesToBase64(images);
            const base64Images = imagesWithBase64.map(img => img.base64!);

            // Call AI API to analyze images
            const response = await fetch('/api/analyze-images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: base64Images,
                    mode,
                    projectStage,
                    projectType
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao analisar imagens');
            }

            const { analyses, warning } = await response.json();

            if (warning) {
                setError(warning);
            }

            // Combine base64 images with AI analyses
            const processedImages = imagesWithBase64.map((img, index) => ({
                base64: img.base64,
                caption: analyses[index]?.caption || `Imagem ${String(index + 1).padStart(2, '0')} – Registro fotográfico`,
                analysis: analyses[index]?.analysis || ''
            }));

            // Create report data
            const reportData = {
                clientName,
                projectAddress,
                projectType,
                projectStage,
                mode,
                technicalResponsible,
                creaCAU,
                builtArea,
                inspectionDate: inspectionDate || new Date().toISOString().split('T')[0],
                userObservations,
                images: processedImages,
                createdAt: new Date().toISOString()
            };

            // Save to sessionStorage (has more space than localStorage)
            const reportId = `photo_report_${Date.now()}`;
            console.log('Saving report with ID:', reportId);

            // Calculate approximate size
            const dataString = JSON.stringify(reportData);
            const sizeInMB = (dataString.length / (1024 * 1024)).toFixed(2);
            console.log(`Report size: ${sizeInMB}MB`);

            // Check if data is too large (sessionStorage limit is ~10MB)
            if (dataString.length > 8 * 1024 * 1024) { // 8MB limit for safety
                throw new Error(`Relatório muito grande (${sizeInMB}MB). Use menos imagens (máximo 5-6 recomendado).`);
            }

            try {
                // Use sessionStorage instead of localStorage (more space)
                sessionStorage.setItem(reportId, dataString);
                console.log('Report saved successfully to sessionStorage');

                // Verify it was saved
                const saved = sessionStorage.getItem(reportId);
                if (!saved) {
                    throw new Error('Failed to save to sessionStorage');
                }
                console.log('Verified report in sessionStorage');
            } catch (storageError: any) {
                console.error('Storage error:', storageError);

                // Provide specific error message
                if (storageError.name === 'QuotaExceededError') {
                    throw new Error(`Espaço insuficiente. Reduza para 3-5 imagens ou use imagens menores.`);
                }
                throw new Error('Erro ao salvar relatório. Tente com 3-5 imagens apenas.');
            }

            // Navigate to report page
            console.log('Navigating to:', `/relatorio-fotografico/${reportId}`);
            router.push(`/relatorio-fotografico/${reportId}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao processar as imagens. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#6366F1]/5 via-background to-[#6366F1]/5 border-b border-white/5 pt-16 pb-12">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Relatório Fotográfico de Obra com <span className="text-[#6366F1]">IA</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Envie fotos da obra e a IA gera automaticamente um relatório fotográfico técnico profissional, pronto para entrega ao cliente.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-card rounded-xl shadow-lg border border-white/5 overflow-hidden">

                    {/* Upload Section */}
                    <div className="p-8">
                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${images.length > 0 ? 'border-[#6366F1]/50 bg-[#6366F1]/5' : 'border-input hover:border-[#6366F1] hover:bg-[#6366F1]/5'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />

                            {isCompressing ? (
                                <div className="flex flex-col items-center">
                                    <RefreshCw className="h-12 w-12 text-[#6366F1] mb-4 animate-spin" />
                                    <h3 className="text-lg font-medium text-foreground">Otimizando imagens...</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Reduzindo tamanho para melhor performance</p>
                                </div>
                            ) : images.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="h-12 w-12 text-[#6366F1] mb-4" />
                                    <h3 className="text-lg font-medium text-foreground">{images.length} imagem(ns) selecionada(s)</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {images.length >= 10 ? (
                                            <span className="text-orange-600 font-medium">Limite máximo atingido (10 imagens)</span>
                                        ) : (
                                            `Você pode adicionar até ${10 - images.length} imagens`
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-[#8a8886] mb-4" />
                                    <h3 className="text-lg font-medium text-foreground">Upload de imagens da obra</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                        Arraste ou clique para selecionar fotos da obra (JPG, PNG, etc.)
                                    </p>
                                    <p className="text-xs text-[#8a8886] mt-2">
                                        As imagens serão automaticamente otimizadas
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-white/10"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remover imagem"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="bg-muted dark:bg-[#222120] px-8 py-6 border-t border-border">
                        <h3 className="text-sm font-bold text-[#8a8886] uppercase tracking-wider mb-4">Dados da Obra</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="clientName" className="block text-sm font-medium text-muted-foreground mb-1">Nome do Cliente *</label>
                                    <input
                                        id="clientName"
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Ex: João Silva"
                                        className="w-full rounded-xl border-input bg-background text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-muted-foreground py-3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="projectAddress" className="block text-sm font-medium text-muted-foreground mb-1">Endereço da Obra *</label>
                                    <input
                                        id="projectAddress"
                                        type="text"
                                        value={projectAddress}
                                        onChange={(e) => setProjectAddress(e.target.value)}
                                        placeholder="Ex: Rua das Flores, 123 - São Paulo/SP"
                                        className="w-full rounded-xl border-input bg-background text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-muted-foreground py-3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="inspectionDate" className="block text-sm font-medium text-muted-foreground mb-1">Data da Vistoria</label>
                                    <input
                                        id="inspectionDate"
                                        type="text"
                                        value={inspectionDate}
                                        onChange={(e) => setInspectionDate(e.target.value)}
                                        placeholder="DD/MM/AAAA"
                                        className="w-full rounded-xl border-input bg-background text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] py-3"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <SelectionList
                                    label="Tipo de Obra"
                                    value={projectType}
                                    onChange={(val) => setProjectType(val as ProjectType)}
                                    options={[
                                        { value: 'Residencial', label: 'Residencial', icon: <Home size={18} /> },
                                        { value: 'Comercial', label: 'Comercial', icon: <Building2 size={18} /> },
                                        { value: 'Reforma', label: 'Reforma', icon: <Hammer size={18} /> }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SelectionList
                                label="Etapa da Obra"
                                value={projectStage}
                                onChange={(val) => setProjectStage(val as ProjectStage)}
                                options={[
                                    { value: 'Inicial', label: 'Inicial', icon: <Flag size={18} /> },
                                    { value: 'Em andamento', label: 'Em andamento', icon: <TrendingUp size={18} /> },
                                    { value: 'Final', label: 'Final', icon: <CheckCircle2 size={18} /> }
                                ]}
                            />

                            <SelectionList
                                label="Modo do Relatório"
                                value={mode}
                                onChange={(val) => setMode(val as ReportMode)}
                                options={[
                                    { value: 'LEIGO', label: 'Linguagem Simples (Cliente)', icon: <User size={18} /> },
                                    { value: 'TECNICO', label: 'Linguagem Técnica', icon: <FileText size={18} /> }
                                ]}
                            />
                        </div>

                        {/* Optional Technical Fields */}
                        {mode === 'TECNICO' && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-[#8a8886] uppercase tracking-wider mb-4">Dados Técnicos (Opcional)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="technicalResponsible" className="block text-sm font-medium text-muted-foreground mb-1">Responsável Técnico</label>
                                        <input
                                            id="technicalResponsible"
                                            type="text"
                                            value={technicalResponsible}
                                            onChange={(e) => setTechnicalResponsible(e.target.value)}
                                            placeholder="Ex: Eng. Maria Santos"
                                            className="w-full rounded-md border-input bg-background dark:bg-[#1A1918] text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-muted-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="creaCAU" className="block text-sm font-medium text-muted-foreground mb-1">CREA/CAU</label>
                                        <input
                                            id="creaCAU"
                                            type="text"
                                            value={creaCAU}
                                            onChange={(e) => setCreaCau(e.target.value)}
                                            placeholder="Ex: CREA-SP 123456"
                                            className="w-full rounded-md border-input bg-background dark:bg-[#1A1918] text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-muted-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="builtArea" className="block text-sm font-medium text-muted-foreground mb-1">Área Construída (m²)</label>
                                        <input
                                            id="builtArea"
                                            type="text"
                                            value={builtArea}
                                            onChange={(e) => setBuiltArea(e.target.value)}
                                            placeholder="Ex: 150.00"
                                            className="w-full rounded-md border-input bg-background dark:bg-[#1A1918] text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-muted-foreground"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Observations */}
                        <div className="mt-6">
                            <label htmlFor="userObservations" className="block text-sm font-medium text-muted-foreground mb-1">Observações Adicionais (Opcional)</label>
                            <textarea
                                id="userObservations"
                                value={userObservations}
                                onChange={(e) => setUserObservations(e.target.value)}
                                placeholder="Adicione observações técnicas relevantes sobre a obra..."
                                rows={3}
                                className="w-full rounded-md border-white/10 bg-[#1A1918] text-foreground shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] placeholder-[#8a8886]"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-8 bg-muted dark:bg-[#222120] border-t border-border flex justify-end">
                        <button
                            onClick={handleGenerateReport}
                            disabled={images.length === 0 || !clientName || !projectAddress || isLoading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
                                ${images.length === 0 || !clientName || !projectAddress ? 'bg-gray-400 cursor-not-allowed' :
                                    isLoading ? 'bg-[#6366F1]/80 cursor-wait' :
                                        'bg-[#6366F1] hover:bg-[#4338CA] hover:shadow-lg active:scale-95'}`}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    Processando Imagens...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-5 w-5" />
                                    Gerar Relatório Fotográfico
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto">
                    <p>Relatório gerado automaticamente. Para uso oficial com responsabilidade técnica, recomenda-se a conferência e assinatura com ART ou RRT por profissional habilitado.</p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Printer, ArrowLeft, User, MapPin, Building2, Layers, Calendar } from 'lucide-react';

interface ImageData {
    base64: string;
    caption: string;
    analysis?: string;
}

interface ReportData {
    clientName: string;
    projectAddress: string;
    projectType: string;
    projectStage: string;
    mode: 'LEIGO' | 'TECNICO';
    technicalResponsible?: string;
    creaCAU?: string;
    builtArea?: string;
    inspectionDate: string;
    userObservations?: string;
    images: ImageData[];
    createdAt: string;
}

export default function PhotoReportClient({ reportId }: { reportId: string }) {
    const router = useRouter();
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try sessionStorage first (new), then localStorage (old reports)
        const savedData = sessionStorage.getItem(reportId) || localStorage.getItem(reportId);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(parsed);
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
        setLoading(false);
    }, [reportId]);

    const handlePrint = () => {
        window.print();
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getObjectiveText = () => {
        if (!data) return '';

        const baseText = {
            'Inicial': 'O presente relatório tem como objetivo documentar o estado inicial da obra, registrando as condições do terreno e/ou edificação antes do início das atividades construtivas.',
            'Final': 'O presente relatório tem como objetivo documentar o estado final da obra, registrando a conclusão dos serviços executados e o resultado final da edificação.',
            'Em andamento': 'O presente relatório tem como objetivo documentar o andamento da obra, registrando o estágio atual dos serviços em execução para fins de acompanhamento e prestação de contas.'
        };

        const text = baseText[data.projectStage as keyof typeof baseText];

        return data.mode === 'LEIGO'
            ? text.replace('documentar', 'mostrar').replace('registrando', 'mostrando')
            : text;
    };

    const handleExportHTML = () => {
        if (!data) return;

        // Create images in 2-column grid layout
        const imagesHTML = data.images.map((img, index) => `
            <div class="photo-card">
                <div class="photo-container">
                    <img src="${img.base64}" alt="Imagem ${index + 1}" />
                </div>
                <div class="photo-caption">
                    <p class="caption-title">${img.caption}</p>
                    ${img.analysis ? `<p class="caption-text">${img.analysis}</p>` : ''}
                </div>
            </div>
        `).join('');

        const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Fotográfico - ${data.clientName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f9fafb;
            padding: 40px 20px;
            color: #111827;
            line-height: 1.6;
        }
        .container { 
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 48px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 { 
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
            line-height: 1.3;
        }
        h2 {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            text-transform: uppercase;
            margin-top: 32px;
            margin-bottom: 16px;
            letter-spacing: 0.05em;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .info-item {
            font-size: 13px;
        }
        .info-label {
            font-size: 10px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .info-value {
            color: #111827;
            font-weight: 500;
        }
        .section {
            margin-bottom: 32px;
        }
        .section-content {
            font-size: 14px;
            color: #374151;
            line-height: 1.8;
        }
        .divider {
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 32px 0;
        }
        /* Photo Grid Styles */
        .photos-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 32px;
        }
        .photo-card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
            page-break-inside: avoid;
        }
        .photo-container {
            aspect-ratio: 4 / 3;
            background: #f3f4f6;
            overflow: hidden;
        }
        .photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .photo-caption {
            padding: 12px;
        }
        .caption-title {
            font-size: 11px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }
        .caption-text {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.4;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .photo-card { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>RELATÓRIO FOTOGRÁFICO DE OBRA</h1>
        
        <h2>1. IDENTIFICAÇÃO DA OBRA</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Cliente</div>
                <div class="info-value">${data.clientName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Endereço</div>
                <div class="info-value">${data.projectAddress}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Tipo de Obra</div>
                <div class="info-value">${data.projectType}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Etapa da Obra</div>
                <div class="info-value">${data.projectStage}</div>
            </div>
            ${data.mode === 'TECNICO' && data.builtArea ? `
            <div class="info-item">
                <div class="info-label">Área Construída</div>
                <div class="info-value">${data.builtArea} m²</div>
            </div>
            ` : ''}
            ${data.mode === 'TECNICO' && data.technicalResponsible ? `
            <div class="info-item">
                <div class="info-label">Responsável Técnico</div>
                <div class="info-value">${data.technicalResponsible}</div>
            </div>
            ` : ''}
            ${data.mode === 'TECNICO' && data.creaCAU ? `
            <div class="info-item">
                <div class="info-label">CREA/CAU</div>
                <div class="info-value">${data.creaCAU}</div>
            </div>
            ` : ''}
        </div>

        <hr class="divider" />

        <div class="section">
            <h2>2. OBJETIVO DO RELATÓRIO</h2>
            <div class="section-content">
                ${getObjectiveText()}
            </div>
        </div>

        <hr class="divider" />

        <div class="section">
            <h2>3. METODOLOGIA</h2>
            <div class="section-content">
                O presente relatório foi elaborado com base em vistoria visual e registros fotográficos fornecidos, não contemplando ensaios, testes destrutivos ou análises laboratoriais.
            </div>
        </div>

        <hr class="divider" />

        <div class="section">
            <h2>4. REGISTRO FOTOGRÁFICO COMENTADO</h2>
            <div class="photos-grid">
                ${imagesHTML}
            </div>
        </div>

        ${data.userObservations ? `
        <hr class="divider" />
        <div class="section">
            <h2>5. CONSIDERAÇÕES TÉCNICAS</h2>
            <div class="section-content">
                ${data.userObservations}
            </div>
        </div>
        ` : ''}

        <hr class="divider" />

        <div class="section">
            <h2>${data.userObservations ? '6' : '5'}. CONCLUSÃO</h2>
            <div class="section-content">
                ${data.mode === 'LEIGO'
                ? 'Este relatório apresenta o registro fotográfico da obra na data da vistoria, servindo como documento de acompanhamento. As informações aqui contidas têm caráter informativo e não substituem análises técnicas especializadas.'
                : 'O presente relatório apresenta o registro fotográfico da obra na data da vistoria, servindo como documento de acompanhamento e controle. As informações aqui contidas possuem caráter documental e não substituem laudos técnicos ou periciais.'}
            </div>
        </div>

        <hr class="divider" />

        <div class="section">
            <h2>${data.userObservations ? '7' : '6'}. RESPONSABILIDADE TÉCNICA</h2>
            <div class="section-content">
                ${!data.technicalResponsible
                ? 'Este relatório possui caráter informativo e documental, não constituindo laudo técnico ou pericial.'
                : `Responsável Técnico: ${data.technicalResponsible}${data.creaCAU ? `<br/>Registro: ${data.creaCAU}` : ''}<br/><br/>Este relatório foi elaborado para fins de acompanhamento e documentação, não constituindo laudo pericial.`}
            </div>
        </div>

        <div style="margin-top: 64px; padding-top: 32px; border-top: 1px solid #e5e7eb; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
                <img src="/logo-custom.png" alt="ObraCalc" style="height: 32px; opacity: 0.6;" />
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: #374151; margin: 0;">ObraCalc</p>
                    <p style="font-size: 10px; color: #6b7280; margin: 0; max-width: 400px;">
                        Fluxo completo de documentação por IA — do orçamento ao relatório técnico.
                    </p>
                </div>
            </div>
            <p style="font-size: 9px; color: #9ca3af; margin: 0;">
                Relatório gerado em ${formatDate(data.createdAt)} • ${data.projectAddress.split(',')[0] || 'Local da Obra'}
            </p>
        </div>
    </div>
</body>
</html>`;

        const newWindow = window.open('', '_blank');
        if (newWindow && !newWindow.closed) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_fotografico_${data.clientName.replace(/\s+/g, '_')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando relatório...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-xl mb-6 text-gray-800">Relatório não encontrado</p>
                    <button onClick={() => router.push('/relatorio-fotografico')} className="btn btn-primary">
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white print:min-h-0 print:h-auto">
            <style jsx global>{`
                @media print {
                    @page { 
                        margin: 15mm;
                        size: A4;
                    }
                    body { 
                        margin: 0; 
                        background: white !important; 
                    }
                    /* Hide all non-content elements */
                    nav, .no-print, footer, header,
                    [class*="background"], [class*="Background"],
                    [class*="blob"], [class*="decoration"],
                    .absolute, [style*="background-image"] { 
                        display: none !important; 
                    }
                    .print-content { 
                        box-shadow: none !important; 
                        background: white !important; 
                    }
                    /* Grid layout for photos in print */
                    .grid {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 20px !important;
                    }
                    /* Prevent page breaks inside images */
                    .photo-card {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    /* Aspect ratio container */
                    .aspect-\\[4\\/3\\] {
                        aspect-ratio: 4 / 3 !important;
                    }
                    /* Image cover */
                    .object-cover {
                        object-fit: cover !important;
                    }
                    /* Force page break before if needed */
                    .photo-card:nth-child(odd) {
                        page-break-after: auto;
                    }
                    /* Prevent orphan pages */
                    * {
                        page-break-after: auto !important;
                    }
                    /* Ensure content ends cleanly */
                    .print-content > *:last-child {
                        page-break-after: avoid !important;
                    }
                }
            `}</style>

            {/* Toolbar */}
            <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center gap-4">
                    <button
                        onClick={() => router.push('/relatorio-fotografico')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} /> Voltar
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleExportHTML}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                        >
                            <FileText size={18} /> HTML
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                        >
                            <Printer size={18} /> PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div id="report-content" className="max-w-[1600px] mx-auto p-6 lg:p-8 print-content">
                {/* Header - Matching Budget Report Style */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6" style={{ breakInside: 'avoid' }}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Relatório Fotográfico de Obra
                    </h1>

                    {/* Info Grid - Two columns with inline icons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-16 gap-y-0 text-sm">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">CLIENTE:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{data.clientName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">ENDEREÇO:</span>
                                    <span className="text-gray-900 dark:text-white">{data.projectAddress}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">TIPO DE OBRA:</span>
                                    <span className="text-gray-900 dark:text-white">{data.projectType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">ETAPA:</span>
                                    <span className="text-gray-900 dark:text-white">{data.projectStage}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">DATA:</span>
                                    <span className="text-gray-900 dark:text-white">{formatDate(data.inspectionDate)}</span>
                                </div>
                            </div>

                            {data.mode === 'TECNICO' && data.technicalResponsible && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">RESPONSÁVEL:</span>
                                        <span className="text-900 dark:text-white">{data.technicalResponsible}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Objective */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        2. Objetivo do Relatório
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {getObjectiveText()}
                    </p>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Methodology */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        3. Metodologia
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        O presente relatório foi elaborado com base em vistoria visual e registros fotográficos fornecidos, não contemplando ensaios, testes destrutivos ou análises laboratoriais.
                    </p>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Photographic Record */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                        4. Registro Fotográfico Comentado
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.images.map((img, index) => (
                            <div key={index} className="photo-card bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ breakInside: 'avoid' }}>
                                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                                    <img
                                        src={img.base64}
                                        alt={`Imagem ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{img.caption}</p>
                                    {img.analysis && (
                                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">{img.analysis}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {data.userObservations && (
                    <>
                        <hr className="my-8 border-gray-200" />
                        <div className="mb-8">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                5. Considerações Técnicas
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {data.userObservations}
                            </p>
                        </div>
                    </>
                )}

                <hr className="my-8 border-gray-200" />

                {/* Conclusion */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        {data.userObservations ? '6' : '5'}. Conclusão
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {data.mode === 'LEIGO'
                            ? 'Este relatório apresenta o registro fotográfico da obra na data da vistoria, servindo como documento de acompanhamento. As informações aqui contidas têm caráter informativo e não substituem análises técnicas especializadas.'
                            : 'O presente relatório apresenta o registro fotográfico da obra na data da vistoria, servindo como documento de acompanhamento e controle. As informações aqui contidas possuem caráter documental e não substituem laudos técnicos ou periciais.'}
                    </p>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Technical Responsibility */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        {data.userObservations ? '7' : '6'}. Responsabilidade Técnica
                    </h2>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {!data.technicalResponsible ? (
                            <p>Este relatório possui caráter informativo e documental, não constituindo laudo técnico ou pericial.</p>
                        ) : (
                            <>
                                <p><strong>Responsável Técnico:</strong> {data.technicalResponsible}</p>
                                {data.creaCAU && <p><strong>Registro:</strong> {data.creaCAU}</p>}
                                <p className="mt-4">Este relatório foi elaborado para fins de acompanhamento e documentação, não constituindo laudo pericial.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Platform Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo-custom.png"
                                alt="ObraCalc"
                                className="h-8 w-auto opacity-60"
                            />
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">ObraCalc</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-md">
                                    Fluxo completo de documentação por IA — do orçamento ao relatório técnico.
                                </p>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500">
                            Relatório gerado em {formatDate(data.createdAt)} • {data.projectAddress.split(',')[0] || 'Local da Obra'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

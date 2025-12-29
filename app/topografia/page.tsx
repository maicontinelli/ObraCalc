'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, CheckCircle, Map as MapIcon, RefreshCw, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { parseKMZ, processMemorialData, MemorialData, ddToDms } from '@/lib/memorial-utils';

export default function MemorialPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MemorialData | null>(null);

    // Form fields
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [startPoint, setStartPoint] = useState('A1');
    const [isClockwise, setIsClockwise] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.toLowerCase().endsWith('.kmz')) {
                setError('Por favor, envie um arquivo .KMZ válido.');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setData(null);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const polygon = await parseKMZ(file);
            const result = processMemorialData(polygon, 0, isClockwise);
            setData(result);

            // Simulating auto-detect (placeholder) or could use simple logic if we had maps
            // defaulting to empty for user to fill
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao processar o arquivo. Verifique se é um KMZ válido exportado do Google Earth.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateMemorialText = () => {
        if (!data) return '';

        const date = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

        let text = `MEMORIAL DESCRITIVO\n\n`;
        text += `IMÓVEL: Terreno Urbano\n`;
        text += `MUNICÍPIO: ${city || '________________'} - ${state || '___'}\n`;
        text += `ÁREA: ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.area)} m²\n`;
        text += `PERÍMETRO: ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.perimeter)} m\n\n`;
        text += `DESCRIÇÃO PERIMÉTRICA:\n\n`;

        // Build the main text
        const firstPoint = data.points[0];

        text += `Inicia-se a descrição deste perímetro no vértice ${firstPoint.id}, de coordenadas N=${firstPoint.n.toFixed(3)}m e E=${firstPoint.e.toFixed(3)}m, situado no limite com Via Pública (ou definir confrontante).\n\n`; // Assuming A1 is on street as requested

        data.segments.forEach((seg, index) => {
            const destPoint = data.points[(index + 1) % data.points.length];
            text += `Deste, segue confrontando com ${seg.confrontante}, com azimute de ${seg.azimuth} e distância de ${seg.distance.toFixed(2)} m, até o vértice ${destPoint.id} (N=${destPoint.n.toFixed(3)}m e E=${destPoint.e.toFixed(3)}m).\n`;
        });

        text += `\nFechando-se assim o polígono acima descrito.\n`;
        text += `\nTodas as coordenadas estão georreferenciadas ao Sistema Geodésico Brasileiro, e encontram-se representadas no Sistema UTM, referenciadas ao Meridiano Central nº ___ (Zona ${data.utmZone}), tendo como datum o SIRGAS2000. Todos os azimutes e distâncias, área e perímetro foram calculados no plano de projeção UTM.\n\n`;

        text += `${city || 'Município'}, ${date}.\n\n`;
        text += `__________________________________________\nResponsável Técnico`;

        return text;
    };

    const downloadExcel = () => {
        if (!data) return;

        const wb = XLSX.utils.book_new();

        // Prepare data for sheet
        const tableData = data.segments.map(seg => ({
            'Ponto Inicial': seg.from,
            'Ponto Final': seg.to,
            'Azimute': seg.azimuth,
            'Distância (m)': parseFloat(seg.distance.toFixed(3)),
            'Norte (Y)': parseFloat(seg.startN.toFixed(3)),
            'Este (X)': parseFloat(seg.startE.toFixed(3)),
            'Confrontante': seg.confrontante
        }));

        // Add coordinates of the last point to close the table logically if needed, 
        // but standard segment table is usually enough. Often table includes coordinate columns for points.
        // Let's match requested columns: Trecho, Azimute, Distância (m), N Inicial, E Inicial, N Final, E Final

        const refinedData = data.segments.map(seg => ({
            'Trecho': `${seg.from}-${seg.to}`,
            'Azimute': seg.azimuth,
            'Distância (m)': parseFloat(seg.distance.toFixed(3)),
            'N Inicial': parseFloat(seg.startN.toFixed(3)),
            'E Inicial': parseFloat(seg.startE.toFixed(3)),
            'N Final': parseFloat(seg.endN.toFixed(3)),
            'E Final': parseFloat(seg.endE.toFixed(3))
        }));

        const ws = XLSX.utils.json_to_sheet(refinedData);
        XLSX.utils.book_append_sheet(wb, ws, "Tabela Perimétrica");
        XLSX.writeFile(wb, "memorial_descritivo.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#C2410C]/5 via-white to-[#C2410C]/5 border-b border-gray-200 pt-16 pb-12">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C2410C]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C2410C]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Memorial Descritivo de <span className="text-[#C2410C]">Topografia</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Envie o arquivo KMZ do Google Earth e a IA cria automaticamente o memorial descritivo técnico + planilha em Excel pronta para prefeitura e cartório.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Upload Section */}
                    <div className="p-8">
                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${file ? 'border-[#C2410C]/50 bg-[#C2410C]/5' : 'border-gray-300 hover:border-[#C2410C] hover:bg-gray-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".kmz"
                                className="hidden"
                            />

                            {file ? (
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="h-12 w-12 text-[#C2410C] mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Pronto para processar</p>
                                    <button
                                        className="mt-4 text-sm text-[#C2410C] font-medium hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setData(null);
                                        }}
                                    >
                                        Trocar arquivo
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">Upload de arquivo KMZ</h3>
                                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                        Exporte seu terreno do Google Earth como KMZ e arraste ou clique aqui.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Configurações do Documento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Ex: São Paulo"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C2410C] focus:ring-[#C2410C]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="Ex: SP"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C2410C] focus:ring-[#C2410C]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de Coordenadas</label>
                                <select disabled className="w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 shadow-sm cursor-not-allowed">
                                    <option>SIRGAS 2000 / UTM (Automático)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sentido do Perímetro</label>
                                <select
                                    value={isClockwise ? 'horario' : 'anti'}
                                    onChange={(e) => setIsClockwise(e.target.value === 'horario')}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C2410C] focus:ring-[#C2410C]"
                                >
                                    <option value="horario">Horário (Padrão)</option>
                                    <option value="anti">Anti-horário</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleProcess}
                            disabled={!file || isLoading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
                                ${!file ? 'bg-gray-400 cursor-not-allowed' :
                                    isLoading ? 'bg-[#C2410C]/80 cursor-wait' :
                                        'bg-[#C2410C] hover:bg-[#9A3412] hover:shadow-lg active:scale-95'}`}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <MapIcon className="h-5 w-5" />
                                    Gerar Memorial Descritivo
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {data && (
                    <div className="mt-10 space-y-8 animate-slideUp">

                        {/* Memorial Text */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-[#C2410C]" />
                                    Memorial Descritivo
                                </h2>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generateMemorialText())}
                                    className="text-sm font-medium text-[#C2410C] hover:bg-[#C2410C]/10 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Copiar Texto
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-700 max-h-[400px] overflow-y-auto">
                                {generateMemorialText()}
                            </div>
                        </div>

                        {/* Technical Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Download className="h-6 w-6 text-[#C2410C]" />
                                    Tabela Técnica
                                </h2>
                                <button
                                    onClick={downloadExcel}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#C2410C] text-white text-sm font-bold rounded-lg hover:bg-[#9A3412] transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar Excel (.xlsx)
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trecho</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Azimute</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Distância (m)</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">N Inicial</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">E Inicial</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.segments.map((seg, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seg.from}-{seg.to}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seg.azimuth}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seg.distance.toFixed(3)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seg.startN.toFixed(3)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seg.startE.toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
                            <p>Documento gerado automaticamente. Para uso oficial, recomenda-se a conferência e assinatura com ART ou RRT por profissional habilitado.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

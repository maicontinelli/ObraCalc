'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, ArrowLeft } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function NovoDiagnostico() {
    const router = useRouter();
    const [step, setStep] = useState<'upload' | 'form'>('upload');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Form fields com valores padrão
    const [formData, setFormData] = useState({
        objetivo: 'revitalizacao',
        padrao: 'basico',
        instalacoes: 'nao',
        ocupacao: 'desocupado',
        area: '12', // Área fixa padrão
        observacoes: ''
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setStep('form');
                setLoading(false);
            };
            reader.readAsDataURL(compressed);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!image) return;

        setLoading(true);

        try {
            console.log('📤 Enviando para análise...');
            const response = await fetch('/api/diagnostico-visual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image,
                    formData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ Erro na API:', data);
                alert(data.error || 'Erro ao gerar diagnóstico. Tente novamente.');
                setLoading(false);
                return;
            }

            console.log('✅ Diagnóstico recebido:', data);

            // Save to localStorage and redirect to editor
            const diagnosticId = crypto.randomUUID();
            const diagnosticData = {
                id: diagnosticId,
                image,
                formData,
                resultado: data,
                createdAt: new Date().toISOString()
            };

            console.log('💾 Salvando diagnóstico:', diagnosticId);
            localStorage.setItem(`diagnostic_${diagnosticId}`, JSON.stringify(diagnosticData));

            // Verificar se salvou corretamente
            const saved = localStorage.getItem(`diagnostic_${diagnosticId}`);
            if (!saved) {
                console.error('❌ Falha ao salvar no localStorage');
                alert('Erro ao salvar diagnóstico. Tente novamente.');
                setLoading(false);
                return;
            }

            console.log('🚀 Redirecionando para editor...');
            router.push(`/editor-diagnostico/${diagnosticId}`);
        } catch (error) {
            console.error('❌ Erro inesperado:', error);
            alert('Erro inesperado. Verifique sua conexão e tente novamente.');
            setLoading(false);
        }
    };

    // Verificar se há imagem pendente do upload da home
    useEffect(() => {
        const pendingImage = sessionStorage.getItem('pendingDiagnosticImage');
        if (pendingImage) {
            setImage(pendingImage);
            setStep('form');
            sessionStorage.removeItem('pendingDiagnosticImage');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Diagnóstico Visual
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Faça upload de uma foto do ambiente e responda algumas perguntas
                    </p>
                </div>

                {/* Upload Step */}
                {step === 'upload' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-center">
                            <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                Envie uma foto do ambiente
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Tire ou selecione uma foto clara do ambiente a ser reformado
                            </p>

                            <label className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer transition-colors font-medium">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Selecionar Foto
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {/* Form Step */}
                {step === 'form' && image && (
                    <div className="space-y-6">
                        {/* Image Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                        </div>

                        {/* Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                Conte-nos mais sobre o projeto
                            </h3>

                            <div className="space-y-6">
                                {/* Pergunta 1 */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        1. Qual o objetivo da reforma?
                                    </label>
                                    <div className="space-y-1.5">
                                        {[
                                            { value: 'revitalizacao', label: 'Revitalização estética' },
                                            { value: 'correcao', label: 'Correção de problemas' },
                                            { value: 'ampliacao', label: 'Ampliação/Modificação' },
                                            { value: 'modernizacao', label: 'Modernização' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="objetivo"
                                                    value={option.value}
                                                    checked={formData.objetivo === option.value}
                                                    onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Pergunta 2 */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        2. Qual padrão de acabamento desejado?
                                    </label>
                                    <div className="space-y-1.5">
                                        {[
                                            { value: 'basico', label: 'Básico' },
                                            { value: 'medio', label: 'Médio' },
                                            { value: 'alto', label: 'Alto' },
                                            { value: 'luxo', label: 'Luxo' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="padrao"
                                                    value={option.value}
                                                    checked={formData.padrao === option.value}
                                                    onChange={(e) => setFormData({ ...formData, padrao: e.target.value })}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Pergunta 3 */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        3. Será necessário mexer em instalações?
                                    </label>
                                    <div className="space-y-1.5">
                                        {[
                                            { value: 'nao', label: 'Não' },
                                            { value: 'eletrica', label: 'Apenas elétrica' },
                                            { value: 'hidraulica', label: 'Apenas hidráulica' },
                                            { value: 'ambas', label: 'Elétrica e hidráulica' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="instalacoes"
                                                    value={option.value}
                                                    checked={formData.instalacoes === option.value}
                                                    onChange={(e) => setFormData({ ...formData, instalacoes: e.target.value })}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Pergunta 4 */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        4. O ambiente estará ocupado durante a obra?
                                    </label>
                                    <div className="space-y-1.5">
                                        {[
                                            { value: 'desocupado', label: 'Desocupado' },
                                            { value: 'parcialmente', label: 'Parcialmente ocupado' },
                                            { value: 'totalmente', label: 'Totalmente ocupado' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="ocupacao"
                                                    value={option.value}
                                                    checked={formData.ocupacao === option.value}
                                                    onChange={(e) => setFormData({ ...formData, ocupacao: e.target.value })}
                                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Pergunta 5 - Área */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        5. Qual a área aproximada do ambiente? (m²)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        placeholder="12"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Observações */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
                                        Observações adicionais
                                        <span className="text-xs font-normal text-gray-500 ml-2">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={formData.observacoes}
                                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                        placeholder="Ex: Quero trocar essa janela por um blindex e pintar tudo de branco"
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-8 px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Analisando...
                                    </>
                                ) : (
                                    'Gerar Diagnóstico'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

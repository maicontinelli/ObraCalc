'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, ArrowLeft, CheckCircle2, RotateCw, Wrench, Hammer, Sparkles, Trophy, Zap, Droplets, User, UserCheck } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { SelectionList } from '@/components/SelectionList';

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
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>
                    <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">
                        Diagnóstico Visual
                    </h1>
                    <p className="text-muted-foreground">
                        Faça upload de uma foto do ambiente e responda algumas perguntas
                    </p>
                </div>

                {/* Upload Step */}
                {step === 'upload' && (
                    <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                        <div className="text-center">
                            <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Envie uma foto do ambiente
                            </h3>
                            <p className="text-muted-foreground mb-6">
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
                        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
                            <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                        </div>

                        {/* Form */}
                        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                            <h3 className="text-2xl font-bold mb-6 text-foreground font-heading">
                                Conte-nos mais sobre o projeto
                            </h3>

                            <div className="space-y-6">
                                {/* Pergunta 1 */}
                                <div>
                                    <SelectionList
                                        label="1. Qual o objetivo da reforma?"
                                        value={formData.objetivo}
                                        onChange={(val) => setFormData({ ...formData, objetivo: val })}
                                        options={[
                                            { value: 'revitalizacao', label: 'Revitalização estética', icon: <Sparkles size={18} /> },
                                            { value: 'correcao', label: 'Correção de problemas', icon: <Wrench size={18} /> },
                                            { value: 'ampliacao', label: 'Ampliação/Modificação', icon: <Hammer size={18} /> },
                                            { value: 'modernizacao', label: 'Modernização', icon: <RotateCw size={18} /> }
                                        ]}
                                    />
                                </div>

                                {/* Pergunta 2 */}
                                <div>
                                    <SelectionList
                                        label="2. Qual padrão de acabamento desejado?"
                                        value={formData.padrao}
                                        onChange={(val) => setFormData({ ...formData, padrao: val })}
                                        options={[
                                            { value: 'basico', label: 'Básico', icon: <Trophy size={18} className="text-gray-400" /> },
                                            { value: 'medio', label: 'Médio', icon: <Trophy size={18} className="text-yellow-600" /> },
                                            { value: 'alto', label: 'Alto', icon: <Trophy size={18} className="text-yellow-400" /> },
                                            { value: 'luxo', label: 'Luxo', icon: <Sparkles size={18} className="text-purple-400" /> }
                                        ]}
                                    />
                                </div>

                                {/* Pergunta 3 */}
                                <div>
                                    <SelectionList
                                        label="3. Será necessário mexer em instalações?"
                                        value={formData.instalacoes}
                                        onChange={(val) => setFormData({ ...formData, instalacoes: val })}
                                        options={[
                                            { value: 'nao', label: 'Não será necessário', icon: <CheckCircle2 size={18} /> },
                                            { value: 'eletrica', label: 'Apenas elétrica', icon: <Zap size={18} /> },
                                            { value: 'hidraulica', label: 'Apenas hidráulica', icon: <Droplets size={18} /> },
                                            { value: 'ambas', label: 'Elétrica e Hidráulica', icon: <Wrench size={18} /> }
                                        ]}
                                    />
                                </div>

                                {/* Pergunta 4 */}
                                <div>
                                    <SelectionList
                                        label="4. O ambiente estará ocupado durante a obra?"
                                        value={formData.ocupacao}
                                        onChange={(val) => setFormData({ ...formData, ocupacao: val })}
                                        options={[
                                            { value: 'desocupado', label: 'Desocupado', icon: <UserCheck size={18} /> },
                                            { value: 'parcialmente', label: 'Parcialmente', icon: <User size={18} /> },
                                            { value: 'totalmente', label: 'Totalmente', icon: <User size={18} className="text-red-400" /> }
                                        ]}
                                    />
                                </div>

                                {/* Pergunta 5 - Área */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-foreground">
                                        5. Qual a área aproximada do ambiente? (m²)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        placeholder="12"
                                        className="w-full px-4 py-3 text-base rounded-xl border border-input bg-background text-foreground resize-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-muted-foreground transition-all outline-none"
                                    />
                                </div>

                                {/* Observações */}
                                <div>
                                    <label className="block text-base font-semibold mb-3 text-foreground">
                                        Observações adicionais
                                        <span className="text-xs font-normal text-gray-500 ml-2">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={formData.observacoes}
                                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                        placeholder="Ex: Quero trocar essa janela por um blindex e pintar tudo de branco"
                                        rows={3}
                                        className="w-full px-4 py-3 text-base rounded-xl border border-input bg-background text-foreground resize-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-muted-foreground transition-all outline-none"
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

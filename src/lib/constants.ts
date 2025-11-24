export const BOQ_TEMPLATES = {
    obra_nova: [
        {
            id: 'cat_preliminares',
            name: 'Serviços Preliminares',
            items: [
                { id: 'item_placa', name: 'Placa de Obra em Chapa Galvanizada', unit: 'm²', price: 350.00, quantity: 1 },
                { id: 'item_tapume', name: 'Tapume de Chapa Compensada (h=2.20m)', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_barracao', name: 'Barracão de Obra / Escritório', unit: 'm²', price: 250.00, quantity: 0 },
                { id: 'item_locacao', name: 'Locação da Obra (Gabarito)', unit: 'm²', price: 18.00, quantity: 0 },
                { id: 'item_lig_prov', name: 'Ligação Provisória (Água/Luz)', unit: 'vb', price: 1500.00, quantity: 1 },
                { id: 'item_limpeza_terreno', name: 'Limpeza Mecanizada de Terreno', unit: 'm²', price: 5.50, quantity: 0 },
                { id: 'item_movimento_terra', name: 'Movimento de Terra com Trator', unit: 'm³', price: 35.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_fundacao',
            name: 'Fundação e Estrutura',
            items: [
                { id: 'item_escavacao', name: 'Escavação Manual de Valas', unit: 'm³', price: 65.00, quantity: 0 },
                { id: 'item_reaterro', name: 'Reaterro Compactado', unit: 'm³', price: 45.00, quantity: 0 },
                { id: 'item_concreto_magro', name: 'Lastro de Concreto Magro', unit: 'm³', price: 450.00, quantity: 0 },
                { id: 'item_sapata', name: 'Concreto Armado FCK 25MPa (Sapatas)', unit: 'm³', price: 1800.00, quantity: 0 },
                { id: 'item_viga_baldrame', name: 'Viga Baldrame (Forma + Armação + Concreto)', unit: 'm³', price: 2100.00, quantity: 0 },
                { id: 'item_pilar', name: 'Pilar em Concreto Armado', unit: 'm³', price: 2500.00, quantity: 0 },
                { id: 'item_viga', name: 'Viga Aérea em Concreto Armado', unit: 'm³', price: 2400.00, quantity: 0 },
                { id: 'item_laje', name: 'Laje Pré-moldada (Fornecimento + Montagem)', unit: 'm²', price: 120.00, quantity: 0 },
                { id: 'item_impermeabilizacao', name: 'Impermeabilização com Manta Asfáltica', unit: 'm²', price: 82.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_alvenaria',
            name: 'Alvenaria e Vedação',
            items: [
                { id: 'item_alvenaria_tijolo', name: 'Alvenaria Tijolo Cerâmico Furado 9x19x19', unit: 'm²', price: 85.00, quantity: 0 },
                { id: 'item_alvenaria_bloco', name: 'Alvenaria Bloco de Concreto 14x19x39', unit: 'm²', price: 95.00, quantity: 0 },
                { id: 'item_alvenaria_bloco_19', name: 'Alvenaria Bloco Cerâmico 19x19x39', unit: 'm²', price: 93.00, quantity: 0 },
                { id: 'item_verga', name: 'Vergas e Contravergas', unit: 'm', price: 45.00, quantity: 0 },
                { id: 'item_chapisco', name: 'Chapisco Traço 1:3', unit: 'm²', price: 12.00, quantity: 0 },
                { id: 'item_emboco', name: 'Emboço/Reboco Paulista', unit: 'm²', price: 35.00, quantity: 0 },
                { id: 'item_massa_corrida', name: 'Massa Corrida (2 demãos)', unit: 'm²', price: 28.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_cobertura',
            name: 'Cobertura',
            items: [
                { id: 'item_madeiramento', name: 'Estrutura de Madeira para Telhado', unit: 'm²', price: 110.00, quantity: 0 },
                { id: 'item_telha_ceramica', name: 'Telhamento com Telha Cerâmica', unit: 'm²', price: 65.00, quantity: 0 },
                { id: 'item_telha_fibro', name: 'Telhamento com Telha Fibrocimento 6mm', unit: 'm²', price: 55.00, quantity: 0 },
                { id: 'item_telha_metalica', name: 'Telhamento com Telha Metálica', unit: 'm²', price: 75.00, quantity: 0 },
                { id: 'item_calha', name: 'Calha em Chapa Galvanizada', unit: 'm', price: 85.00, quantity: 0 },
                { id: 'item_rufo', name: 'Rufo em Chapa Galvanizada', unit: 'm', price: 75.00, quantity: 0 },
                { id: 'item_forro_pvc', name: 'Forro em PVC', unit: 'm²', price: 45.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_instalacoes',
            name: 'Instalações',
            items: [
                { id: 'item_eletrica_ponto', name: 'Ponto de Elétrica (Tomada/Interruptor)', unit: 'un', price: 180.00, quantity: 0 },
                { id: 'item_tomada_simples', name: 'Instalação de Tomada Simples', unit: 'un', price: 40.00, quantity: 0 },
                { id: 'item_interruptor', name: 'Instalação de Interruptor Simples', unit: 'un', price: 50.00, quantity: 0 },
                { id: 'item_chuveiro_eletrico', name: 'Instalação de Chuveiro Elétrico', unit: 'un', price: 90.00, quantity: 0 },
                { id: 'item_luminaria', name: 'Instalação de Luminária/Pendente', unit: 'un', price: 70.00, quantity: 0 },
                { id: 'item_quadro', name: 'Quadro de Distribuição Montado', unit: 'un', price: 850.00, quantity: 1 },
                { id: 'item_hidraulica_ponto', name: 'Ponto de Hidráulica (Água Fria)', unit: 'un', price: 220.00, quantity: 0 },
                { id: 'item_esgoto_ponto', name: 'Ponto de Esgoto', unit: 'un', price: 250.00, quantity: 0 },
                { id: 'item_caixa_dagua', name: 'Instalação Caixa d\'Água 1000L', unit: 'un', price: 650.00, quantity: 1 },
                { id: 'item_registro', name: 'Instalação de Registro', unit: 'un', price: 80.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_acabamentos',
            name: 'Acabamentos',
            items: [
                { id: 'item_contrapiso', name: 'Contrapiso Regularizado', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_piso_ceramico', name: 'Piso Cerâmico PEI-4', unit: 'm²', price: 120.00, quantity: 0 },
                { id: 'item_porcelanato', name: 'Porcelanato Polido', unit: 'm²', price: 250.00, quantity: 0 },
                { id: 'item_azulejo', name: 'Revestimento Cerâmico Parede', unit: 'm²', price: 110.00, quantity: 0 },
                { id: 'item_pintura_latex', name: 'Pintura Látex Acrílico (2 demãos)', unit: 'm²', price: 38.00, quantity: 0 },
                { id: 'item_pintura_textura', name: 'Pintura Texturizada', unit: 'm²', price: 55.00, quantity: 0 },
                { id: 'item_pintura_esmalte', name: 'Pintura Esmalte (2 demãos)', unit: 'm²', price: 50.00, quantity: 0 },
                { id: 'item_forro_gesso', name: 'Forro em Placas de Gesso', unit: 'm²', price: 56.00, quantity: 0 },
                { id: 'item_forro_drywall', name: 'Forro em Drywall', unit: 'm²', price: 84.00, quantity: 0 },
                { id: 'item_rodape_ceramico', name: 'Rodapé Cerâmico 7cm', unit: 'm', price: 12.00, quantity: 0 },
                { id: 'item_rodape_madeira', name: 'Rodapé em Madeira 7cm', unit: 'm', price: 27.00, quantity: 0 },
                { id: 'item_soleira_granito', name: 'Soleira em Granito 15cm', unit: 'm', price: 87.00, quantity: 0 },
                { id: 'item_peitoril_granito', name: 'Peitoril em Granito 15cm', unit: 'm', price: 104.00, quantity: 0 },
                { id: 'item_porta_madeira', name: 'Kit Porta Madeira Completa', unit: 'un', price: 950.00, quantity: 0 },
                { id: 'item_janela_alum', name: 'Janela de Alumínio 1.20x1.00', unit: 'un', price: 650.00, quantity: 0 },
                { id: 'item_box_vidro', name: 'Box de Vidro Temperado', unit: 'm²', price: 450.00, quantity: 0 },
            ]
        }
    ],
    reforma: [
        {
            id: 'cat_demolicao',
            name: 'Demolições e Retiradas',
            items: [
                { id: 'item_demolicao_alvenaria', name: 'Demolição de Alvenaria', unit: 'm³', price: 150.00, quantity: 0 },
                { id: 'item_retirada_piso', name: 'Retirada de Piso Cerâmico', unit: 'm²', price: 35.00, quantity: 0 },
                { id: 'item_retirada_azulejo', name: 'Retirada de Azulejo', unit: 'm²', price: 30.00, quantity: 0 },
                { id: 'item_retirada_portas', name: 'Retirada de Portas/Janelas', unit: 'un', price: 80.00, quantity: 0 },
                { id: 'item_retirada_forro', name: 'Retirada de Forro', unit: 'm²', price: 25.00, quantity: 0 },
                { id: 'item_demolicao_concreto', name: 'Demolição de Concreto', unit: 'm³', price: 280.00, quantity: 0 },
                { id: 'item_bota_fora', name: 'Carga e Bota-fora de Entulho', unit: 'm³', price: 180.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_reparos',
            name: 'Reparos e Construção',
            items: [
                { id: 'item_fechamento_rasgo', name: 'Fechamento de Rasgos em Alvenaria', unit: 'm', price: 25.00, quantity: 0 },
                { id: 'item_alvenaria_nova', name: 'Alvenaria de Vedação (Pequenos trechos)', unit: 'm²', price: 110.00, quantity: 0 },
                { id: 'item_regularizacao', name: 'Regularização de Piso/Parede', unit: 'm²', price: 40.00, quantity: 0 },
                { id: 'item_reboco_parede', name: 'Reboco de Parede', unit: 'm²', price: 35.00, quantity: 0 },
                { id: 'item_massa_corrida_ref', name: 'Aplicação de Massa Corrida', unit: 'm²', price: 28.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_instalacoes_ref',
            name: 'Instalações (Adequação)',
            items: [
                { id: 'item_troca_fiacao', name: 'Troca de Fiação Elétrica', unit: 'pt', price: 150.00, quantity: 0 },
                { id: 'item_troca_tomada', name: 'Troca de Tomada/Interruptor', unit: 'un', price: 45.00, quantity: 0 },
                { id: 'item_troca_chuveiro', name: 'Troca de Chuveiro Elétrico', unit: 'un', price: 90.00, quantity: 0 },
                { id: 'item_troca_loucas', name: 'Instalação de Louças (Vaso/Pia)', unit: 'un', price: 180.00, quantity: 0 },
                { id: 'item_troca_metais', name: 'Instalação de Metais (Torneiras)', unit: 'un', price: 80.00, quantity: 0 },
                { id: 'item_troca_registro', name: 'Troca de Registro', unit: 'un', price: 85.00, quantity: 0 },
                { id: 'item_desentupimento', name: 'Desentupimento de Tubulação', unit: 'un', price: 120.00, quantity: 0 },
            ]
        },
        {
            id: 'cat_acabamentos_ref',
            name: 'Acabamentos',
            items: [
                { id: 'item_piso_sobre_piso', name: 'Assentamento Piso sobre Piso', unit: 'm²', price: 90.00, quantity: 0 },
                { id: 'item_piso_laminado', name: 'Instalação de Piso Laminado', unit: 'm²', price: 75.00, quantity: 0 },
                { id: 'item_pintura_repintura', name: 'Repintura (Lixamento + Tinta)', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_pintura_latex_ref', name: 'Pintura Látex Acrílico Premium', unit: 'm²', price: 38.00, quantity: 0 },
                { id: 'item_gesso', name: 'Forro de Gesso Acartonado', unit: 'm²', price: 85.00, quantity: 0 },
                { id: 'item_sanca', name: 'Sanca de Gesso', unit: 'm', price: 65.00, quantity: 0 },
                { id: 'item_moldura_gesso', name: 'Moldura de Gesso', unit: 'm', price: 33.00, quantity: 0 },
                { id: 'item_rodape_ref', name: 'Instalação de Rodapé', unit: 'm', price: 18.00, quantity: 0 },
                { id: 'item_troca_porta', name: 'Troca de Porta Completa', unit: 'un', price: 850.00, quantity: 0 },
                { id: 'item_troca_janela', name: 'Troca de Janela', unit: 'un', price: 550.00, quantity: 0 },
            ]
        }
    ]
};

export const DEFAULT_BOQ_CATEGORIES = BOQ_TEMPLATES.obra_nova;

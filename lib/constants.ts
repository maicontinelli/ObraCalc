export const BOQ_TEMPLATES = {
    obra_nova: [
        {
            id: 'cat_preliminares',
            name: 'Serviços Preliminares',
            items: [
                { id: 'item_levantamento_topografico', name: 'Levantamento topográfico', unit: 'vb', price: 1800.00, quantity: 1 },
                { id: 'item_sondagem_solo', name: 'Sondagem do solo (SPT)', unit: 'vb', price: 2500.00, quantity: 1 },
                { id: 'item_projeto_arquitetonico', name: 'Projeto arquitetônico e complementares', unit: 'vb', price: 6500.00, quantity: 1 },
                { id: 'item_mobilizacao', name: 'Mobilização de equipe e equipamentos', unit: 'vb', price: 2000.00, quantity: 1 },
                { id: 'item_tapumes_fechamento', name: 'Tapumes e fechamento de obra', unit: 'm²', price: 85.00, quantity: 0 },
                { id: 'item_instalacao_canteiro', name: 'Instalação de canteiro (banheiros, escritório)', unit: 'm²', price: 450.00, quantity: 0 },
                { id: 'item_ligacoes_provisorias', name: 'Ligações provisórias (água, luz)', unit: 'vb', price: 1200.00, quantity: 1 },
                { id: 'item_placa_obra', name: 'Placa de obra', unit: 'un', price: 450.00, quantity: 1 },
                { id: 'item_demolicoes_diversas', name: 'Demolições diversas (paredes, pisos, lajes)', unit: 'm³', price: 90.00, quantity: 0 },
                { id: 'item_remocao_entulho', name: 'Remoção de entulho / caçamba', unit: 'un', price: 450.00, quantity: 0 },
                { id: 'item_limpeza_inicial', name: 'Limpeza inicial do terreno (capina, raspagem)', unit: 'm²', price: 6.50, quantity: 0 }
            ]
        },
        {
            id: 'cat_terraplenagem',
            name: 'Terraplenagem e Escavações',
            items: [
                { id: 'item_limpeza_terreno', name: 'Limpeza do terreno', unit: 'm²', price: 6.50, quantity: 0 },
                { id: 'item_corte_aterro', name: 'Corte e aterro mecanizado', unit: 'm³', price: 45.00, quantity: 0 },
                { id: 'item_escavacao_fundacoes', name: 'Escavação manual para fundações', unit: 'm³', price: 95.00, quantity: 0 },
                { id: 'item_compactacao_solo', name: 'Compactação de aterro', unit: 'm³', price: 35.00, quantity: 0 },
                { id: 'item_transporte_terra', name: 'Transporte de terra (bota-fora)', unit: 'm³', price: 55.00, quantity: 0 },
                { id: 'item_aterros_estruturais', name: 'Aterro estrutural (material importado)', unit: 'm³', price: 120.00, quantity: 0 },
                { id: 'item_escavacao_mecanica', name: 'Escavação mecânica para grandes volumes', unit: 'm³', price: 10.00, quantity: 0 },
                { id: 'item_regularizacao_nivelamento', name: 'Regularização do terreno e nivelamento', unit: 'm²', price: 1.50, quantity: 0 }
            ]
        },
        {
            id: 'cat_fundacoes',
            name: 'Fundações',
            items: [
                { id: 'item_fundacoes_rasas', name: 'Concreto para sapatas/radier (c/ forma e aço)', unit: 'm³', price: 2200.00, quantity: 0 },
                { id: 'item_fundacoes_profundas', name: 'Estaca escavada/broca (concreto + aço)', unit: 'm', price: 140.00, quantity: 0 },
                { id: 'item_vigas_baldrame', name: 'Vigas baldrame (concreto, forma, aço)', unit: 'm³', price: 2500.00, quantity: 0 },
                { id: 'item_impermeabilizacao_baldrame', name: 'Impermeabilização de baldrame (tinta asfáltica)', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_camada_protecao_mecanica', name: 'Lastro de concreto magro (5cm)', unit: 'm²', price: 38.00, quantity: 0 },
                { id: 'item_reaterro_compactado', name: 'Reaterro interno de valas', unit: 'm³', price: 40.00, quantity: 0 },
                { id: 'item_estacas_pre_moldadas', name: 'Estacas pré-moldadas / estacas cravadas', unit: 'm', price: 100.00, quantity: 0 },
                { id: 'item_blocos_coroamento', name: 'Blocos de coroamento (para estacas)', unit: 'm³', price: 1500.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_confinacoes',
            name: 'Contenções e Muros',
            items: [
                { id: 'item_muros_arrimo', name: 'Muro de arrimo (bloco estrutural cheio)', unit: 'm²', price: 350.00, quantity: 0 },
                { id: 'item_drenagem_profunda', name: 'Drenagem de muro (tubo + brita + manta)', unit: 'm', price: 85.00, quantity: 0 },
                { id: 'item_gabioes', name: 'Gabiões', unit: 'm³', price: 850.00, quantity: 0 },
                { id: 'item_taludes_vegetal', name: 'Taludes com contenção vegetal', unit: 'm²', price: 10.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_estrutura',
            name: 'Estrutura',
            items: [
                { id: 'item_pilares', name: 'Pilares em concreto armado (completo)', unit: 'm³', price: 3200.00, quantity: 0 },
                { id: 'item_vigas', name: 'Vigas em concreto armado (completo)', unit: 'm³', price: 3200.00, quantity: 0 },
                { id: 'item_lajes', name: 'Laje pré-moldada (fornecimento e montagem)', unit: 'm²', price: 160.00, quantity: 0 },
                { id: 'item_escadas_estruturais', name: 'Escada em concreto armado', unit: 'm³', price: 3500.00, quantity: 0 },
                { id: 'item_tercas_caibros', name: 'Estrutura de madeira para telhado', unit: 'm²', price: 120.00, quantity: 0 },
                { id: 'item_laje_macica', name: 'Laje maciça moldada in loco', unit: 'm³', price: 2500.00, quantity: 0 },
                { id: 'item_estrutura_metalica', name: 'Estrutura metálica (vigas e pilares)', unit: 'kg', price: 25.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_alvenarias',
            name: 'Alvenarias',
            items: [
                { id: 'item_alvenaria_vedacao', name: 'Alvenaria bloco cerâmico (c/ argamassa)', unit: 'm²', price: 110.00, quantity: 0 },
                { id: 'item_vergas_contravergas', name: 'Vergas e contravergas (concreto)', unit: 'm', price: 45.00, quantity: 0 },
                { id: 'item_amarracoes_cintas', name: 'Cintas de amarração', unit: 'm', price: 65.00, quantity: 0 },
                { id: 'item_alvenaria_bloco_concreto', name: 'Alvenaria bloco de concreto', unit: 'm²', price: 140.00, quantity: 0 },
                { id: 'item_divisorias_drywall', name: 'Divisórias internas leves (drywall)', unit: 'm²', price: 120.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_impermeabilizacoes',
            name: 'Impermeabilizações',
            items: [
                { id: 'item_banheiros', name: 'Impermeabilização áreas úmidas (argamassa polimérica)', unit: 'm²', price: 65.00, quantity: 0 },
                { id: 'item_lajes_expostas', name: 'Impermeabilização lajes (manta asfáltica)', unit: 'm²', price: 140.00, quantity: 0 },
                { id: 'item_reservatorios', name: 'Impermeabilização reservatórios', unit: 'm²', price: 90.00, quantity: 0 },
                { id: 'item_impermeabilizacao_fundacoes', name: 'Impermeabilização de fundações (manta + primer)', unit: 'm²', price: 65.00, quantity: 0 },
                { id: 'item_drenagem_subsolo', name: 'Drenagem de subsolo', unit: 'm', price: 85.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_hidraulicas',
            name: 'Instalações Hidráulicas',
            items: [
                { id: 'item_agua_fria', name: 'Ponto de água fria (tubo + conexões)', unit: 'pt', price: 250.00, quantity: 0 },
                { id: 'item_agua_quente', name: 'Ponto de água quente (CPVC/PPR)', unit: 'pt', price: 380.00, quantity: 0 },
                { id: 'item_esgoto_ventilacao', name: 'Ponto de esgoto/ventilação', unit: 'pt', price: 280.00, quantity: 0 },
                { id: 'item_reservatorios_superiores', name: 'Caixa d\'água 1000L (instalada)', unit: 'un', price: 1200.00, quantity: 0 },
                { id: 'item_caixa_gordura', name: 'Caixa de gordura/inspeção (PVC)', unit: 'un', price: 450.00, quantity: 0 },
                { id: 'item_drenagem_pluvial', name: 'Drenagem pluvial (caleiras, tubos, ralos)', unit: 'm', price: 60.00, quantity: 0 },
                { id: 'item_pressurizador', name: 'Pressurizador / bomba (infraestrutura)', unit: 'un', price: 1500.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_eletricas',
            name: 'Instalações Elétricas',
            items: [
                { id: 'item_entrada_energia', name: 'Padrão de entrada (monofásico/bifásico)', unit: 'un', price: 1800.00, quantity: 0 },
                { id: 'item_quadro_geral', name: 'Quadro de distribuição (montado)', unit: 'un', price: 1500.00, quantity: 0 },
                { id: 'item_infra_tomadas', name: 'Ponto de tomada/interruptor (eletroduto + fio + caixa)', unit: 'pt', price: 190.00, quantity: 0 },
                { id: 'item_infra_iluminacao', name: 'Ponto de iluminação (caixa no teto)', unit: 'pt', price: 160.00, quantity: 0 },
                { id: 'item_aterramento_spda', name: 'Haste de aterramento', unit: 'un', price: 120.00, quantity: 0 },
                { id: 'item_cabeamento_estruturado', name: 'Cabeamento estruturado (internet e redes)', unit: 'pt', price: 250.00, quantity: 0 },
                { id: 'item_infra_cftv', name: 'Infraestrutura para CFTV / alarmes', unit: 'pt', price: 280.00, quantity: 0 },
                { id: 'item_spda', name: 'SPDA (Sistema de Proteção contra Descargas Atmosféricas)', unit: 'vb', price: 4500.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_climatizacao',
            name: 'Climatização',
            items: [
                { id: 'item_ar_condicionado', name: 'Infraestrutura para Ar Condicionado (dreno + cobre)', unit: 'pt', price: 850.00, quantity: 0 },
                { id: 'item_ponto_eletrico_ac', name: 'Ponto elétrico reforçado para AC', unit: 'un', price: 180.00, quantity: 0 },
                { id: 'item_exaustores', name: 'Instalação de exaustores / ventilação mecânica', unit: 'un', price: 450.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_esquadrias',
            name: 'Esquadrias',
            items: [
                { id: 'item_portas_madeira', name: 'Porta interna madeira (completa)', unit: 'un', price: 1350.00, quantity: 0 },
                { id: 'item_portas_janelas_aluminio', name: 'Janela/Porta alumínio e vidro', unit: 'm²', price: 950.00, quantity: 0 },
                { id: 'item_portoes', name: 'Portão garagem (alumínio/ferro)', unit: 'm²', price: 750.00, quantity: 0 },
                { id: 'item_portas_externas_metalicas', name: 'Portas externas metálicas', unit: 'un', price: 1200.00, quantity: 0 },
                { id: 'item_gradis_metalicos', name: 'Gradis e guarda-corpos metálicos', unit: 'm²', price: 450.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_coberturas',
            name: 'Coberturas',
            items: [
                { id: 'item_telhas', name: 'Telhamento (cerâmica/concreto)', unit: 'm²', price: 95.00, quantity: 0 },
                { id: 'item_rufos_calhas', name: 'Rufos e calhas (chapa galvanizada)', unit: 'm', price: 85.00, quantity: 0 },
                { id: 'item_telhas_metalicas', name: 'Telhas metálicas/sanduíche', unit: 'm²', price: 280.00, quantity: 0 },
                { id: 'item_cumeeiras', name: 'Cumeeiras e arremates', unit: 'm', price: 55.00, quantity: 0 },
                { id: 'item_forro_cobertura', name: 'Forro de madeira / PVC / drywall em áreas de cobertura', unit: 'm²', price: 100.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_revestimentos_internos',
            name: 'Revestimentos',
            items: [
                { id: 'item_chapisco', name: 'Chapisco', unit: 'm²', price: 12.00, quantity: 0 },
                { id: 'item_emboco', name: 'Emboço/Reboco', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_contrapiso', name: 'Contrapiso (3-5cm)', unit: 'm²', price: 48.00, quantity: 0 },
                { id: 'item_piso_porcelanato', name: 'Porcelanato (fornecimento + assentamento)', unit: 'm²', price: 210.00, quantity: 0 },
                { id: 'item_revestimento_ceramico', name: 'Revestimento cerâmico parede', unit: 'm²', price: 160.00, quantity: 0 },
                { id: 'item_rodapes', name: 'Rodapé', unit: 'm', price: 35.00, quantity: 0 },
                { id: 'item_gesso_liso', name: 'Gesso liso / massa corrida avançada', unit: 'm²', price: 50.00, quantity: 0 },
                { id: 'item_piso_laminado', name: 'Piso laminado / vinílico', unit: 'm²', price: 100.00, quantity: 0 },
                { id: 'item_revestimento_3d', name: 'Revestimento 3D / pedras decorativas', unit: 'm²', price: 120.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_pintura',
            name: 'Pintura',
            items: [
                { id: 'item_massa_corrida', name: 'Massa corrida (2 demãos)', unit: 'm²', price: 28.00, quantity: 0 },
                { id: 'item_pintura_interna_externa', name: 'Pintura Látex Acrílico (2 demãos)', unit: 'm²', price: 32.00, quantity: 0 },
                { id: 'item_texturas_grafiato', name: 'Textura/Grafiato', unit: 'm²', price: 45.00, quantity: 0 },
                { id: 'item_pintura_esmalte', name: 'Pintura esmalte (portas, estruturas metálicas)', unit: 'm²', price: 42.00, quantity: 0 },
                { id: 'item_pintura_epoxi', name: 'Pintura epóxi (garagens, áreas técnicas)', unit: 'm²', price: 85.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_loucas_metais',
            name: 'Louças e Metais',
            items: [
                { id: 'item_instalacao_bacias', name: 'Vaso sanitário com caixa acoplada (médio)', unit: 'un', price: 850.00, quantity: 0 },
                { id: 'item_instalacao_cubas', name: 'Cuba/Lavatório', unit: 'un', price: 450.00, quantity: 0 },
                { id: 'item_instalacao_torneiras', name: 'Torneira/Misturador (médio)', unit: 'un', price: 350.00, quantity: 0 },
                { id: 'item_instalacao_chuveiros', name: 'Chuveiro elétrico', unit: 'un', price: 180.00, quantity: 0 },
                { id: 'item_ralo_linear', name: 'Ralo linear', unit: 'un', price: 350.00, quantity: 0 },
                { id: 'item_acessorios_banheiro', name: 'Acessórios de banheiro (suporte toalha, papeleira)', unit: 'jg', price: 250.00, quantity: 0 }
            ]
        },
        {
            id: 'cat_limpeza',
            name: 'Finalização',
            items: [
                { id: 'item_limpeza_pos_obra', name: 'Limpeza fina pós-obra', unit: 'm²', price: 25.00, quantity: 0 },
                { id: 'item_comissionamento', name: 'Teste e comissionamento das instalações', unit: 'vb', price: 2500.00, quantity: 0 },
                { id: 'item_entrega_tecnica', name: 'Entrega técnica / manual do proprietário', unit: 'vb', price: 1500.00, quantity: 0 }
            ]
        }
    ]
};

export const DEFAULT_BOQ_CATEGORIES = BOQ_TEMPLATES.obra_nova;

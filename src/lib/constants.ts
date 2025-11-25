export const BOQ_TEMPLATES = {
    obra_nova: [
        {
            id: 'cat_preliminares',
            name: 'Serviços Preliminares',
            items: [
                { id: 'item_levantamento_topografico', name: 'Levantamento topográfico', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_sondagem_solo', name: 'Sondagem do solo (SPT)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_projeto_arquitetonico', name: 'Projeto arquitetônico e complementares', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_mobilizacao', name: 'Mobilização de equipe e equipamentos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_tapumes_fechamento', name: 'Tapumes e fechamento de obra', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_canteiro', name: 'Instalação de canteiro (banheiros, escritório, almoxarifado)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_ligacoes_provisorias', name: 'Ligações provisórias (água, luz, internet)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_placa_obra', name: 'Placa de obra', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_terraplenagem',
            name: 'Terraplenagem e Escavações',
            items: [
                { id: 'item_limpeza_terreno', name: 'Limpeza do terreno', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_corte_aterro', name: 'Corte e aterro', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_escavacao_fundacoes', name: 'Escavação para fundações', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_compactacao_solo', name: 'Compactação de solo', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_transporte_terra', name: 'Transporte de terra', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_aterros_estruturais', name: 'Aterros estruturais', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_fundacoes',
            name: 'Fundações',
            items: [
                { id: 'item_fundacoes_rasas', name: 'Fundações rasas (sapatas, radier, bloco)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_fundacoes_profundas', name: 'Fundações profundas (estacas hélice, broca, estaca cravada)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_vigas_baldrame', name: 'Vigas baldrame', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_impermeabilizacao_baldrame', name: 'Impermeabilização de baldrame', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_camada_protecao_mecanica', name: 'Camada de proteção mecânica', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_reaterro_compactado', name: 'Reaterro compactado', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_confinacoes',
            name: 'Contenções e Muros Estruturais',
            items: [
                { id: 'item_muros_arrimo', name: 'Muros de arrimo', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_gabioes', name: 'Gabiões', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_cortinas_atirantadas', name: 'Cortinas atirantadas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_drenagem_profunda', name: 'Drenagem profunda (barbacãs, drenos horizontais)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_estrutura',
            name: 'Estrutura',
            items: [
                // Concreto armado
                { id: 'item_pilares', name: 'Pilares', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_vigas', name: 'Vigas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_lajes', name: 'Lajes (maciças, nervuradas, steel deck)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_escadas_estruturais', name: 'Escadas estruturais', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_paineis_estruturais', name: 'Painéis estruturais', unit: 'un', price: 0, quantity: 0 },
                // Estrutura metálica
                { id: 'item_mezaninos', name: 'Mezaninos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pergolados', name: 'Pergolados', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_estruturas_especiais', name: 'Estruturas especiais', unit: 'un', price: 0, quantity: 0 },
                // Madeiramento
                { id: 'item_tercas_caibros', name: 'Terças, caibros, vigas e pontaletes', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_alvenarias',
            name: 'Alvenarias',
            items: [
                { id: 'item_alvenaria_vedacao', name: 'Alvenaria de vedação (bloco cerâmico, bloco concreto, drywall)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_elevacao_paredes', name: 'Elevação de paredes internas e externas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_vergas_contravergas', name: 'Vergas e contravergas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_amarracoes_cintas', name: 'Amarrações e cintas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_rebaixo_portas_janelas', name: 'Rebaixo de portas e janelas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_shaft_tecnicos', name: 'Shafts técnicos', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_impermeabilizacoes',
            name: 'Impermeabilizações',
            items: [
                { id: 'item_baldrame', name: 'Baldrame', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_banheiros', name: 'Banheiros', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_varandas', name: 'Varandas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_lajes_expostas', name: 'Lajes expostas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_piscina', name: 'Piscina', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_areas_frias', name: 'Áreas frias em geral', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_reservatorios', name: 'Reservatórios', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_poroes', name: 'Porões e subsolos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_jardineiras', name: 'Jardineiras', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_hidraulicas',
            name: 'Instalações Hidráulicas e Sanitárias',
            items: [
                { id: 'item_agua_fria', name: 'Água fria', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_agua_quente', name: 'Água quente (cobre, pex, pp-r)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_esgoto_ventilacao', name: 'Esgoto e ventilação', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_drenagem_pluvial', name: 'Drenagem de águas pluviais', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_infra_reuso', name: 'Infra de reuso (se houver)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_reservatorios_superiores', name: 'Reservatórios superiores e inferiores', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pressurizacao_agua', name: 'Pressurização de água', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_aquecedor_solar', name: 'Infra de aquecedor solar ou gás', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_caixa_gordura', name: 'Caixa de gordura, fossa, filtro, sumidouro (se não houver rede pública)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_eletricas',
            name: 'Instalações Elétricas',
            items: [
                { id: 'item_entrada_energia', name: 'Entrada de energia (padrão)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_quadro_geral', name: 'Quadro geral de distribuição (QDG)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_quadros_secundarios', name: 'Quadros secundários', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_passagem_eletrodutos', name: 'Passagem de eletrodutos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_infra_iluminacao', name: 'Infra de iluminação', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_infra_tomadas', name: 'Infra de tomadas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_circuitos_dedicados', name: 'Circuitos dedicados', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_aterramento_spda', name: 'Aterramento e SPDA (para-raios)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_automacao_residencial', name: 'Infra para automação residencial', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_nobreak_gerador', name: 'Instalação de nobreak, gerador (se houver)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_comunicacoes',
            name: 'Instalações de Comunicação / Tecnologia',
            items: [
                { id: 'item_rede_estruturada', name: 'Rede estruturada (internet e dados)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_telefonia', name: 'Telefonia', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_cftv', name: 'CFTV / câmeras', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_alarme_sensores', name: 'Alarme e sensores', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_fechaduras_eletronicas', name: 'Fechaduras eletrônicas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_som_ambiente', name: 'Som ambiente / home theater', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_automacao_luz_persianas', name: 'Automação (luz, persianas, climatização)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_climatizacao',
            name: 'Climatização e Exaustão',
            items: [
                { id: 'item_ar_condicionado', name: 'Infra e instalação de ar-condicionado', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_exaustores_coifas', name: 'Exaustores e coifas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_ventilacao_banheiros', name: 'Ventilação mecânica de banheiros', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_casa_maquinas', name: 'Casa de máquinas (se houver)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_esquadrias',
            name: 'Esquadrias',
            items: [
                // Externas
                { id: 'item_portas_janelas_aluminio', name: 'Portas e janelas de alumínio', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_portoes', name: 'Portões', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_fachadas_envidracadas', name: 'Fachadas envidraçadas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_claraboias', name: 'Claraboias', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_guarda_corpos', name: 'Guarda-corpos', unit: 'un', price: 0, quantity: 0 },
                // Internas
                { id: 'item_portas_madeira', name: 'Portas de madeira', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_marcos_guarnições', name: 'Marcos e guarnições', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_fechaduras_ferragens', name: 'Fechaduras e ferragens', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_coberturas',
            name: 'Coberturas',
            items: [
                { id: 'item_estrutura_telhado', name: 'Estrutura de telhado (madeira, metálica, steel frame)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_telhas', name: 'Telhas (cerâmica, concreto, metálica, shingle, policarbonato)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_rufos_calhas', name: 'Rufos e calhas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_drenagem_pluvial', name: 'Drenagem pluvial (condutores)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_isolamento_termico', name: 'Isolamento térmico / manta térmica', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_revestimentos_internos',
            name: 'Revestimentos internos',
            items: [
                // Paredes
                { id: 'item_chapisco', name: 'Chapisco', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_emboco', name: 'Emboço', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_reboco_masseamento', name: 'Reboco/masseamento', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_drywall', name: 'Drywall', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pintura_seladora', name: 'Pintura seladora', unit: 'un', price: 0, quantity: 0 },
                // Pisos e paredes
                { id: 'item_contrapiso', name: 'Contrapiso', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_camada_nivelamento', name: 'Camada de nivelamento', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_piso_porcelanato', name: 'Piso porcelanato', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_piso_vinilico', name: 'Piso vinílico / madeira', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_granito_marmore', name: 'Granito / mármore', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pastilhas', name: 'Pastilhas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_revestimento_ceramico', name: 'Revestimento cerâmico', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_pintura',
            name: 'Pintura Geral',
            items: [
                { id: 'item_preparacao_superficies', name: 'Preparação de superfícies', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_massa_corrida', name: 'Massa corrida', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_lixamento', name: 'Lixamento', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pintura_interna_externa', name: 'Pintura interna e externa', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pintura_portas_metais', name: 'Pintura em portas e metais', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_texturas_grafiato', name: 'Texturas, grafiato, efeitos especiais', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_loucas_metais',
            name: 'Louças e Metais',
            items: [
                { id: 'item_instalacao_bacias', name: 'Instalação de bacias', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_cubas', name: 'Cubas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_torneiras', name: 'Torneiras', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_misturadores', name: 'Misturadores', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_chuveiros', name: 'Chuveiros', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_ralos', name: 'Ralos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_acessorios', name: 'Acessórios', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_piscina_lazer',
            name: 'Piscina e Área de Lazer',
            items: [
                { id: 'item_escavacao_piscina', name: 'Escavação', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_estrutura_piscina', name: 'Estrutura (alvenaria ou concreto)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_revestimento_piscina', name: 'Revestimento (vinil, cerâmica, pedra)', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_casa_maquinas_piscina', name: 'Casa de máquinas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacoes_hidraulicas_piscina', name: 'Instalações hidráulicas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_deck', name: 'Deck', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_iluminacao_piscina', name: 'Iluminação da piscina', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_aquecimento_piscina', name: 'Aquecimento (solar, bomba de calor ou gás)', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_paisagismo',
            name: 'Paisagismo e Urbanização',
            items: [
                { id: 'item_jardim', name: 'Jardim', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_irrigacao_automatica', name: 'Irrigação automática', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_iluminacao_externa', name: 'Iluminação externa', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_calcadas', name: 'Calçadas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_pergolados', name: 'Pergolados', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_muros_cercas', name: 'Muros e cercas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_acessos_rampas', name: 'Acessos e rampas', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_seguranca',
            name: 'Segurança e Automação',
            items: [
                { id: 'item_alarme', name: 'Alarmes', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_cameras', name: 'Câmeras', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_automacao_iluminacao', name: 'Automação de iluminação', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_controle_acesso', name: 'Controle de acesso', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_fechaduras_digitais', name: 'Fechaduras digitais', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_sensores_movimento', name: 'Sensores de movimento', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_portoes_automaticos', name: 'Portões automáticos', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_acabamentos_finais',
            name: 'Acabamentos Finais e Montagens',
            items: [
                { id: 'item_mobiliario_planejado', name: 'Instalação de móveis planejados', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_bancadas_pedra', name: 'Bancadas de pedra', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_guarda_corpos_internos', name: 'Guarda-corpos internos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_espelhos', name: 'Instalação de espelhos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_instalacao_vidros', name: 'Instalação de vidros', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_rodapes', name: 'Rodapés', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_cubas_esculpidas', name: 'Cubas esculpidas', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_lareiras', name: 'Lareiras', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_loucas_metais_finais', name: 'Louças e metais finais', unit: 'un', price: 0, quantity: 0 }
            ]
        },
        {
            id: 'cat_limpeza',
            name: 'Limpeza e Entrega',
            items: [
                { id: 'item_limpeza_pos_obra', name: 'Limpeza pós-obra', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_testes_hidraulicos_eletricos', name: 'Testes hidráulicos e elétricos', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_entrega_tecnica', name: 'Entrega técnica', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_manual_proprietario', name: 'Manual do proprietário', unit: 'un', price: 0, quantity: 0 },
                { id: 'item_ajustes_finais', name: 'Ajustes finais (punch list)', unit: 'un', price: 0, quantity: 0 }
            ]
        }
    ]
};

export const DEFAULT_BOQ_CATEGORIES = BOQ_TEMPLATES.obra_nova;

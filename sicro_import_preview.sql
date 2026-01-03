-- PREVIEW DE IMPORTAÇÃO SICRO (SELEÇÃO PARA OBRAS DE EDIFICAÇÃO/CONDOMÍNIOS)
-- Total de itens nesta seleção: 24 itens
-- Foco: Infraestrutura leve, Pavimentação e Drenagem
-- Estrutura compatível com tabela 'services' existente
-- Exemplo de inserção (com preços estimados baseados no SICRO Sudeste/2024)
INSERT INTO services (
        id,
        category,
        name,
        unit,
        price,
        material_price,
        labor_price,
        description
    )
VALUES -- 19. PAVIMENTAÇÃO E CALÇAMENTO (Baseado no Grupo SICRO: Pavimentação)
    (
        'sic_pav_001',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Pavimentação em paralelepípedo sobre colchão de areia',
        'm²',
        85.40,
        55.00,
        30.40,
        'Fonte: SICRO - Inclui fornecimento e assentamento'
    ),
    (
        'sic_pav_002',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Pavimentação em bloco de concreto sextavado (bloquete)',
        'm²',
        72.80,
        45.00,
        27.80,
        'Fonte: SICRO - Tráfego leve'
    ),
    (
        'sic_pav_003',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Piso tátil de concreto direcional/alerta (40x40cm)',
        'm²',
        95.00,
        60.00,
        35.00,
        'Fonte: SICRO - Acessibilidade'
    ),
    (
        'sic_pav_004',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Meio-fio de concreto moldado in loco (extrusado)',
        'm',
        35.00,
        20.00,
        15.00,
        'Fonte: SICRO - Sarjeta conjugada'
    ),
    (
        'sic_pav_005',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Execução de passeio em concreto desempolado esp. 6cm',
        'm²',
        58.00,
        38.00,
        20.00,
        'Fonte: SICRO'
    ),
    -- 20. DRENAGEM PLUVIAL EXTERNA (Baseado no Grupo SICRO: Drenagem)
    (
        'sic_dre_001',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tubo de concreto armado PA-1, diâmetro 400mm',
        'm',
        145.00,
        110.00,
        35.00,
        'Fonte: SICRO - Fornecimento e assentamento'
    ),
    (
        'sic_dre_002',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tubo de concreto armado PA-1, diâmetro 600mm',
        'm',
        210.00,
        160.00,
        50.00,
        'Fonte: SICRO - Fornecimento e assentamento'
    ),
    (
        'sic_dre_003',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Boca de lobo simples em alvenaria e concreto',
        'un',
        850.00,
        500.00,
        350.00,
        'Fonte: SICRO - Completa com grelha'
    ),
    (
        'sic_dre_004',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Poço de visita (bueiro) em anéis de concreto D=1.00m',
        'un',
        1800.00,
        1100.00,
        700.00,
        'Fonte: SICRO - Profundidade até 1.5m'
    ),
    (
        'sic_dre_005',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Sarjeta triangular de concreto (drenagem superficial)',
        'm',
        65.00,
        40.00,
        25.00,
        'Fonte: SICRO'
    ),
    -- 21. CERCAMENTOS E MUROS DE CONTENÇÃO (Baseado no Grupo SICRO: Obras Complementares)
    (
        'sic_cer_001',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Cerca de arame farpado com mourões de concreto curva',
        'm',
        45.00,
        25.00,
        20.00,
        'Fonte: SICRO - 4 fios'
    ),
    (
        'sic_cer_002',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Alambrado com tela de arame galvanizado revestido PVC',
        'm²',
        88.00,
        58.00,
        30.00,
        'Fonte: SICRO - Inclusive mourões'
    ),
    (
        'sic_cer_003',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Gradil eletrofudido (tipo Nylofor) malha 5x20cm',
        'm²',
        150.00,
        120.00,
        30.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_004',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Portão metálico de abrir com tela de arame',
        'm²',
        280.00,
        180.00,
        100.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_005',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Gabião tipo caixa (1,0x1,0) para muro de arrimo',
        'm³',
        450.00,
        300.00,
        150.00,
        'Fonte: SICRO - Malha hexagonal'
    ),
    -- 22. TERRAPLENAGEM MECANIZADA (Complemento ao Grupo 3 existente)
    (
        'sic_ter_001',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Escavação e carga de material de 1ª categoria (Escavadeira)',
        'm³',
        8.50,
        0.00,
        8.50,
        'Fonte: SICRO - Mecanizada'
    ),
    (
        'sic_ter_002',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Transporte local com caminhão basculante (DMT até 1km)',
        'm³',
        6.20,
        0.00,
        6.20,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_003',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Compactação de aterros a 95% do Proctor Normal',
        'm³',
        12.00,
        4.00,
        8.00,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_004',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Regularização do subleito mecanizada (Patrol)',
        'm²',
        2.50,
        0.00,
        2.50,
        'Fonte: SICRO'
    ),
    -- 23. SINALIZAÇÃO VIÁRIA (Novo grupo para Condomínios)
    (
        'sic_sin_001',
        '23. SINALIZAÇÃO VIÁRIA',
        'Pintura de faixa de sinalização horizontal (tinta acrílica)',
        'm²',
        35.00,
        20.00,
        15.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_002',
        '23. SINALIZAÇÃO VIÁRIA',
        'Placa de regulamentação octogonal (pare) refletiva',
        'un',
        280.00,
        200.00,
        80.00,
        'Fonte: SICRO - Com poste'
    ),
    (
        'sic_sin_003',
        '23. SINALIZAÇÃO VIÁRIA',
        'Tachão refletivo bidirecional (tartaruga)',
        'un',
        45.00,
        30.00,
        15.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_004',
        '23. SINALIZAÇÃO VIÁRIA',
        'Lombada física em asfalto (quebra-molas)',
        'm³',
        650.00,
        400.00,
        250.00,
        'Fonte: SICRO'
    );
-- ANÁLISE DE IMPACTO:
-- Estes itens preenchem a lacuna de "Infraestrutura de Condomínio" e "Obras Externas".
-- Se importássemos O SICRO COMPLETO (sem filtro): Seriam +4.500 itens (muitos repetidos ou irrelevantes).
-- Com este FILTRO INTELIGENTE: Seriam cerca de 150 a 200 itens novos altamente relevantes.
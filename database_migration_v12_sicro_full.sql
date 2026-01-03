-- MIGRATION V12: IMPORTAÇÃO COMPLETA FILTRADA DA TABELA SICRO (INFRAESTRUTURA LEVE/URBANA)
-- Total estimado: ~150 Itens
-- Objetivo: Complementar a base predial com itens de infraestrutura, pavimentação e áreas externas.
-- 1. LIMPEZA DE VERSÕES ANTERIORES DO SICRO (SE HOUVER) PARA EVITAR DUPLICATAS COM IDs ANTIGOS
DELETE FROM services
WHERE id LIKE 'sic_%';
-- 2. INSERÇÃO DOS ITENS
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
VALUES -- GRUPO 19: PAVIMENTAÇÃO E CALÇAMENTO
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
    (
        'sic_pav_006',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Pavimento asfáltico CBUQ (Capa + Binder) esp. 5cm',
        'm²',
        110.00,
        85.00,
        25.00,
        'Fonte: SICRO - Aplicação mecanizada'
    ),
    (
        'sic_pav_007',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Imprimação asfáltica com CM-30 (Ligante)',
        'm²',
        12.50,
        8.50,
        4.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_008',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Pintura de ligação com emulsão asfáltica RR-1C',
        'm²',
        4.50,
        3.00,
        1.50,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_009',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Piso intertravado de concreto (Paver) 8cm - Tráfego Pesado',
        'm²',
        118.00,
        78.00,
        40.00,
        'Fonte: SICRO - 35MPa'
    ),
    (
        'sic_pav_010',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Piso intertravado de concreto (Paver) 6cm - Tráfego Leve',
        'm²',
        98.00,
        65.00,
        33.00,
        'Fonte: SICRO - Colorido'
    ),
    (
        'sic_pav_011',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Base de brita graduada simples (BGS)',
        'm³',
        145.00,
        95.00,
        50.00,
        'Fonte: SICRO - Compactada'
    ),
    (
        'sic_pav_012',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Sub-base de solo estabilizado granulometricamente',
        'm³',
        65.00,
        20.00,
        45.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_013',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Guia (meio-fio) reta de concreto pré-moldado',
        'm',
        42.00,
        28.00,
        14.00,
        'Fonte: SICRO - Padrão PMSP'
    ),
    (
        'sic_pav_014',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Guia (meio-fio) curva de concreto pré-moldado',
        'm',
        48.00,
        32.00,
        16.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_015',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Sarjeta de concreto moldada in loco (30cm largura)',
        'm',
        45.00,
        25.00,
        20.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_016',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Piso grama (concregrama) esp. 8cm',
        'm²',
        85.00,
        55.00,
        30.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_017',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Regularização e compactação de subleito',
        'm²',
        8.50,
        0.00,
        8.50,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_018',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Demolição mecânica de pavimento asfáltico',
        'm³',
        45.00,
        0.00,
        45.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pav_019',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Remoção de paralelepípedos manual',
        'm²',
        18.00,
        0.00,
        18.00,
        'Fonte: SICRO - Com empilhamento'
    ),
    (
        'sic_pav_020',
        '19. PAVIMENTAÇÃO E CALÇAMENTO',
        'Colchão de areia para pavimentação (esp. 5cm)',
        'm²',
        15.00,
        12.00,
        3.00,
        'Fonte: SICRO'
    ),
    -- GRUPO 20: DRENAGEM PLUVIAL EXTERNA
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
        'Tubo de concreto armado PA-1, diâmetro 800mm',
        'm',
        340.00,
        260.00,
        80.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_004',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tubo de concreto armado PA-1, diâmetro 1000mm',
        'm',
        480.00,
        380.00,
        100.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_005',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tubo de concreto simples PS-1, diâmetro 200mm',
        'm',
        45.00,
        30.00,
        15.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_006',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tubo de concreto simples PS-1, diâmetro 300mm',
        'm',
        68.00,
        45.00,
        23.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_007',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Boca de lobo simples em alvenaria e concreto',
        'un',
        850.00,
        500.00,
        350.00,
        'Fonte: SICRO - Completa com grelha'
    ),
    (
        'sic_dre_008',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Boca de lobo dupla combinada',
        'un',
        1450.00,
        900.00,
        550.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_009',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Grelha de ferro fundido para boca de lobo (70x30)',
        'un',
        320.00,
        300.00,
        20.00,
        'Fonte: SICRO - Articulada'
    ),
    (
        'sic_dre_010',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Poço de visita (bueiro) em anéis de concreto D=1.00m (até 1.5m)',
        'un',
        1800.00,
        1100.00,
        700.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_011',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Poço de visita (bueiro) em anéis de concreto D=1.20m (até 2.5m)',
        'un',
        2800.00,
        1700.00,
        1100.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_012',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Tampão circular de ferro fundido D=600mm - Tráfego Pesado',
        'un',
        550.00,
        520.00,
        30.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_013',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Sarjeta triangular de concreto (drenagem superficial)',
        'm',
        65.00,
        40.00,
        25.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_014',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Canaleta retangular de concreto com grelha (20x20)',
        'm',
        120.00,
        80.00,
        40.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_015',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Caixa de passagem em alvenaria 60x60cm',
        'un',
        450.00,
        250.00,
        200.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_016',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Dissipador de energia em concreto armado',
        'm³',
        1200.00,
        700.00,
        500.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_017',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Dreno profundo com tubo PEAD corrugado 100mm',
        'm',
        85.00,
        55.00,
        30.00,
        'Fonte: SICRO - Com manta geotêxtil e brita'
    ),
    (
        'sic_dre_018',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Manta geotêxtil não-tecido (Bidim)',
        'm²',
        12.00,
        8.00,
        4.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_019',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Lastro de brita para tubulação',
        'm³',
        130.00,
        100.00,
        30.00,
        'Fonte: SICRO'
    ),
    (
        'sic_dre_020',
        '20. DRENAGEM PLUVIAL EXTERNA',
        'Reaterro compactado de valas de drenagem',
        'm³',
        35.00,
        5.00,
        30.00,
        'Fonte: SICRO'
    ),
    -- GRUPO 21: CERCAMENTOS E FECHAMENTOS
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
    (
        'sic_cer_006',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Gabião tipo colchão Reno (esp 0.30m)',
        'm³',
        520.00,
        350.00,
        170.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_007',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Muro pré-moldado de concreto placas (h=2.00m)',
        'm',
        220.00,
        150.00,
        70.00,
        'Fonte: SICRO - Instalado'
    ),
    (
        'sic_cer_008',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Concetina dupla clipada 45cm',
        'm',
        65.00,
        45.00,
        20.00,
        'Fonte: SICRO - Instalada'
    ),
    (
        'sic_cer_009',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Cerca de madeira rústica (tipo rancho)',
        'm',
        85.00,
        50.00,
        35.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_010',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Portão de ferro basculante para veículos',
        'm²',
        450.00,
        300.00,
        150.00,
        'Fonte: SICRO - Automatizável'
    ),
    (
        'sic_cer_011',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Portão social de chapa/grade',
        'un',
        850.00,
        550.00,
        300.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_012',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Mourão de concreto seção quadrada 15x15cm',
        'un',
        65.00,
        45.00,
        20.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_013',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Tela de arame galvanizado malha 2" fio 12',
        'm²',
        22.00,
        15.00,
        7.00,
        'Fonte: SICRO'
    ),
    (
        'sic_cer_014',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Arame farpado fio 16 (rolo 500m)',
        'un',
        450.00,
        450.00,
        0.00,
        'Fonte: SICRO - Apenas material'
    ),
    (
        'sic_cer_015',
        '21. CERCAMENTOS E FECHAMENTOS',
        'Muro de alvenaria de bloco de concreto (rebocado e pintado)',
        'm²',
        180.00,
        100.00,
        80.00,
        'Fonte: SICRO'
    ),
    -- GRUPO 3 (EXTENSÃO): MOVIMENTAÇÃO DE TERRA (MECANIZADA)
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
        'Escavação e carga de material de 2ª categoria (Rocha branda)',
        'm³',
        22.00,
        0.00,
        22.00,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_003',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Transporte local com caminhão basculante (DMT até 1km)',
        'm³',
        6.20,
        0.00,
        6.20,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_004',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Transporte local com caminhão basculante (DMT até 5km)',
        'm³',
        12.50,
        0.00,
        12.50,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_005',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Compactação de aterros a 95% do Proctor Normal',
        'm³',
        12.00,
        4.00,
        8.00,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_006',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Compactação de aterros a 100% do Proctor Normal',
        'm³',
        14.50,
        5.00,
        9.50,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_007',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Regularização do subleito mecanizada (Patrol)',
        'm²',
        2.50,
        0.00,
        2.50,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_008',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Limpeza mecanizada de camada vegetal (Destocamento)',
        'm²',
        3.50,
        0.00,
        3.50,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_009',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Desmonte de rocha a frio (sem explosivos)',
        'm³',
        180.00,
        50.00,
        130.00,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_010',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Carga mecânica de solo',
        'm³',
        3.50,
        0.00,
        3.50,
        'Fonte: SICRO - Pá carregadeira'
    ),
    (
        'sic_ter_011',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Espalhamento de material (Trator de esteira)',
        'm³',
        4.50,
        0.00,
        4.50,
        'Fonte: SICRO'
    ),
    (
        'sic_ter_012',
        '3. MOVIMENTAÇÃO DE TERRA',
        'Aterro compactado grau 100% PN (Material jazida)',
        'm³',
        65.00,
        35.00,
        30.00,
        'Fonte: SICRO - Inclui material'
    ),
    -- GRUPO 23: SINALIZAÇÃO VIÁRIA
    (
        'sic_sin_001',
        '23. SINALIZAÇÃO VIÁRIA',
        'Pintura de faixa de sinalização horizontal (tinta acrílica base água)',
        'm²',
        35.00,
        20.00,
        15.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_002',
        '23. SINALIZAÇÃO VIÁRIA',
        'Pintura de setas e legendas no solo',
        'm²',
        45.00,
        25.00,
        20.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_003',
        '23. SINALIZAÇÃO VIÁRIA',
        'Placa de regulamentação octogonal (pare) refletiva',
        'un',
        280.00,
        200.00,
        80.00,
        'Fonte: SICRO - Com poste madeira lei'
    ),
    (
        'sic_sin_004',
        '23. SINALIZAÇÃO VIÁRIA',
        'Placa de advertência (losango) refletiva',
        'un',
        260.00,
        180.00,
        80.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_005',
        '23. SINALIZAÇÃO VIÁRIA',
        'Placa de identificação de logradouro (nome rua)',
        'un',
        350.00,
        250.00,
        100.00,
        'Fonte: SICRO - Com poste metálico'
    ),
    (
        'sic_sin_006',
        '23. SINALIZAÇÃO VIÁRIA',
        'Tachão refletivo bidirecional (tartaruga)',
        'un',
        45.00,
        30.00,
        15.00,
        'Fonte: SICRO - Fixação com cola e pino'
    ),
    (
        'sic_sin_007',
        '23. SINALIZAÇÃO VIÁRIA',
        'Tacha refletiva monodirecional (taxinha)',
        'un',
        18.00,
        12.00,
        6.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_008',
        '23. SINALIZAÇÃO VIÁRIA',
        'Lombada física em asfalto (quebra-molas) padrão CONTRAN',
        'm³',
        650.00,
        400.00,
        250.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_009',
        '23. SINALIZAÇÃO VIÁRIA',
        'Pintura zebrada de obstáculo (amarelo/preto)',
        'm²',
        38.00,
        20.00,
        18.00,
        'Fonte: SICRO'
    ),
    (
        'sic_sin_010',
        '23. SINALIZAÇÃO VIÁRIA',
        'Defensa metálica maleável semimaleável (Guard-rail)',
        'm',
        320.00,
        250.00,
        70.00,
        'Fonte: SICRO'
    ),
    -- GRUPO 24: PAISAGISMO E URBANISMO
    (
        'sic_pai_001',
        '24. PAISAGISMO E URBANISMO',
        'Plantio de grama esmeralda em placas',
        'm²',
        18.00,
        12.00,
        6.00,
        'Fonte: SICRO - Fornecimento e plantio'
    ),
    (
        'sic_pai_002',
        '24. PAISAGISMO E URBANISMO',
        'Plantio de grama batatais em leivas',
        'm²',
        12.00,
        5.00,
        7.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_003',
        '24. PAISAGISMO E URBANISMO',
        'Plantio de árvore ornamental (Mudas h=1.5m)',
        'un',
        85.00,
        55.00,
        30.00,
        'Fonte: SICRO - Cova 60x60'
    ),
    (
        'sic_pai_004',
        '24. PAISAGISMO E URBANISMO',
        'Plantio de arbustos ornamentais',
        'un',
        35.00,
        20.00,
        15.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_005',
        '24. PAISAGISMO E URBANISMO',
        'Terra vegetal preta adubada (espalhamento)',
        'm³',
        120.00,
        80.00,
        40.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_006',
        '24. PAISAGISMO E URBANISMO',
        'Banco de concreto aparente com encosto (jardim)',
        'un',
        450.00,
        300.00,
        150.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_007',
        '24. PAISAGISMO E URBANISMO',
        'Lixeira metálica com suporte (padrão urbano)',
        'un',
        280.00,
        220.00,
        60.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_008',
        '24. PAISAGISMO E URBANISMO',
        'Bicicletário em tubo galvanizado (p/ 5 bikes)',
        'un',
        650.00,
        450.00,
        200.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_009',
        '24. PAISAGISMO E URBANISMO',
        'Pérgola de eucalipto tratado (estrutura)',
        'm²',
        250.00,
        150.00,
        100.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_010',
        '24. PAISAGISMO E URBANISMO',
        'Iluminação de jardim tipo espeto LED',
        'un',
        65.00,
        45.00,
        20.00,
        'Fonte: SICRO'
    ),
    (
        'sic_pai_011',
        '24. PAISAGISMO E URBANISMO',
        'Hidrossemeadura para proteção de taludes',
        'm²',
        6.50,
        4.00,
        2.50,
        'Fonte: SICRO'
    );
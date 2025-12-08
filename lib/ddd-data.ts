// Dados de DDD do Brasil
export type DddInfo = {
    ddd: string;
    state: string;
    region: string;
    cities: string[];
};

export const DDD_DATA: Record<string, DddInfo> = {
    // Região Norte
    '68': { ddd: '68', state: 'AC', region: 'Rio Branco e região', cities: ['Rio Branco'] },
    '82': { ddd: '82', state: 'AL', region: 'Maceió e região', cities: ['Maceió'] },
    '92': { ddd: '92', state: 'AM', region: 'Manaus e região', cities: ['Manaus'] },
    '97': { ddd: '97', state: 'AM', region: 'Interior do Amazonas', cities: ['Tefé', 'Coari'] },
    '96': { ddd: '96', state: 'AP', region: 'Macapá e região', cities: ['Macapá'] },

    // Região Nordeste
    '71': { ddd: '71', state: 'BA', region: 'Salvador e região', cities: ['Salvador'] },
    '73': { ddd: '73', state: 'BA', region: 'Ilhéus e região', cities: ['Ilhéus', 'Itabuna'] },
    '74': { ddd: '74', state: 'BA', region: 'Juazeiro e região', cities: ['Juazeiro'] },
    '75': { ddd: '75', state: 'BA', region: 'Feira de Santana e região', cities: ['Feira de Santana'] },
    '77': { ddd: '77', state: 'BA', region: 'Vitória da Conquista e região', cities: ['Vitória da Conquista'] },
    '85': { ddd: '85', state: 'CE', region: 'Fortaleza e região', cities: ['Fortaleza'] },
    '88': { ddd: '88', state: 'CE', region: 'Juazeiro do Norte e região', cities: ['Juazeiro do Norte'] },
    '98': { ddd: '98', state: 'MA', region: 'São Luís e região', cities: ['São Luís'] },
    '99': { ddd: '99', state: 'MA', region: 'Imperatriz e região', cities: ['Imperatriz'] },
    '83': { ddd: '83', state: 'PB', region: 'João Pessoa e região', cities: ['João Pessoa'] },
    '81': { ddd: '81', state: 'PE', region: 'Recife e região', cities: ['Recife'] },
    '87': { ddd: '87', state: 'PE', region: 'Petrolina e região', cities: ['Petrolina'] },
    '86': { ddd: '86', state: 'PI', region: 'Teresina e região', cities: ['Teresina'] },
    '89': { ddd: '89', state: 'PI', region: 'Picos e região', cities: ['Picos'] },
    '84': { ddd: '84', state: 'RN', region: 'Natal e região', cities: ['Natal'] },
    '69': { ddd: '69', state: 'RO', region: 'Porto Velho e região', cities: ['Porto Velho'] },
    '95': { ddd: '95', state: 'RR', region: 'Boa Vista e região', cities: ['Boa Vista'] },
    '79': { ddd: '79', state: 'SE', region: 'Aracaju e região', cities: ['Aracaju'] },
    '63': { ddd: '63', state: 'TO', region: 'Palmas e região', cities: ['Palmas'] },

    // Região Centro-Oeste
    '61': { ddd: '61', state: 'DF', region: 'Brasília e região', cities: ['Brasília'] },
    '62': { ddd: '62', state: 'GO', region: 'Goiânia e região', cities: ['Goiânia'] },
    '64': { ddd: '64', state: 'GO', region: 'Rio Verde e região', cities: ['Rio Verde'] },
    '65': { ddd: '65', state: 'MT', region: 'Cuiabá e região', cities: ['Cuiabá'] },
    '66': { ddd: '66', state: 'MT', region: 'Rondonópolis e região', cities: ['Rondonópolis'] },
    '67': { ddd: '67', state: 'MS', region: 'Campo Grande e região', cities: ['Campo Grande'] },

    // Região Sudeste
    '27': { ddd: '27', state: 'ES', region: 'Vitória e região', cities: ['Vitória'] },
    '28': { ddd: '28', state: 'ES', region: 'Cachoeiro de Itapemirim e região', cities: ['Cachoeiro de Itapemirim'] },
    '21': { ddd: '21', state: 'RJ', region: 'Rio de Janeiro e região', cities: ['Rio de Janeiro'] },
    '22': { ddd: '22', state: 'RJ', region: 'Campos dos Goytacazes e região', cities: ['Campos dos Goytacazes'] },
    '24': { ddd: '24', state: 'RJ', region: 'Volta Redonda e região', cities: ['Volta Redonda'] },
    '11': { ddd: '11', state: 'SP', region: 'São Paulo e região', cities: ['São Paulo'] },
    '12': { ddd: '12', state: 'SP', region: 'São José dos Campos e região', cities: ['São José dos Campos'] },
    '13': { ddd: '13', state: 'SP', region: 'Santos e região', cities: ['Santos'] },
    '14': { ddd: '14', state: 'SP', region: 'Bauru e região', cities: ['Bauru'] },
    '15': { ddd: '15', state: 'SP', region: 'Sorocaba e região', cities: ['Sorocaba'] },
    '16': { ddd: '16', state: 'SP', region: 'Ribeirão Preto e região', cities: ['Ribeirão Preto'] },
    '17': { ddd: '17', state: 'SP', region: 'São José do Rio Preto e região', cities: ['São José do Rio Preto'] },
    '18': { ddd: '18', state: 'SP', region: 'Presidente Prudente e região', cities: ['Presidente Prudente'] },
    '19': { ddd: '19', state: 'SP', region: 'Campinas e região', cities: ['Campinas'] },
    '31': { ddd: '31', state: 'MG', region: 'Belo Horizonte e região', cities: ['Belo Horizonte'] },
    '32': { ddd: '32', state: 'MG', region: 'Juiz de Fora e região', cities: ['Juiz de Fora'] },
    '33': { ddd: '33', state: 'MG', region: 'Governador Valadares e região', cities: ['Governador Valadares'] },
    '34': { ddd: '34', state: 'MG', region: 'Uberlândia e região', cities: ['Uberlândia'] },
    '35': { ddd: '35', state: 'MG', region: 'Poços de Caldas e região', cities: ['Poços de Caldas'] },
    '37': { ddd: '37', state: 'MG', region: 'Divinópolis e região', cities: ['Divinópolis'] },
    '38': { ddd: '38', state: 'MG', region: 'Montes Claros e região', cities: ['Montes Claros'] },

    // Região Sul
    '41': { ddd: '41', state: 'PR', region: 'Curitiba e região', cities: ['Curitiba'] },
    '42': { ddd: '42', state: 'PR', region: 'Ponta Grossa e região', cities: ['Ponta Grossa'] },
    '43': { ddd: '43', state: 'PR', region: 'Londrina e região', cities: ['Londrina'] },
    '44': { ddd: '44', state: 'PR', region: 'Maringá e região', cities: ['Maringá'] },
    '45': { ddd: '45', state: 'PR', region: 'Foz do Iguaçu e região', cities: ['Foz do Iguaçu'] },
    '46': { ddd: '46', state: 'PR', region: 'Francisco Beltrão e região', cities: ['Francisco Beltrão'] },
    '47': { ddd: '47', state: 'SC', region: 'Joinville e região', cities: ['Joinville'] },
    '48': { ddd: '48', state: 'SC', region: 'Florianópolis e região', cities: ['Florianópolis'] },
    '49': { ddd: '49', state: 'SC', region: 'Chapecó e região', cities: ['Chapecó'] },
    '51': { ddd: '51', state: 'RS', region: 'Porto Alegre e região', cities: ['Porto Alegre'] },
    '53': { ddd: '53', state: 'RS', region: 'Pelotas e região', cities: ['Pelotas'] },
    '54': { ddd: '54', state: 'RS', region: 'Caxias do Sul e região', cities: ['Caxias do Sul'] },
    '55': { ddd: '55', state: 'RS', region: 'Santa Maria e região', cities: ['Santa Maria'] },
};

export function getDddInfo(phone: string): DddInfo | null {
    // Extract DDD from phone number (first 2 digits after removing non-numeric characters)
    const numericPhone = phone.replace(/\D/g, '');

    if (numericPhone.length < 2) return null;

    const ddd = numericPhone.substring(0, 2);
    return DDD_DATA[ddd] || null;
}

export function formatPhoneNumber(phone: string): string {
    const numericPhone = phone.replace(/\D/g, '');

    if (numericPhone.length <= 2) {
        return numericPhone;
    } else if (numericPhone.length <= 6) {
        return `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2)}`;
    } else if (numericPhone.length <= 10) {
        return `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2, 6)}-${numericPhone.substring(6)}`;
    } else {
        return `(${numericPhone.substring(0, 2)}) ${numericPhone.substring(2, 7)}-${numericPhone.substring(7, 11)}`;
    }
}

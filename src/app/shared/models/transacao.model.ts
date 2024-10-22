export interface Transacao {
    id: string;
    accountId: string;
    uniqueId: string;
    status: string;
    tipo_transacao: string;
    preco: number;
    data: string;
    ano: number,
    mes: number,
    descricao: string;
    categoria: string;
    transacao_fixa: boolean;
    transacao_repetida: boolean;
    quantidade_repeticao: number;
    intervalo: string;
}
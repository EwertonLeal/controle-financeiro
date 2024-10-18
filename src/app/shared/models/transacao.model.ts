export interface Transacao {
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
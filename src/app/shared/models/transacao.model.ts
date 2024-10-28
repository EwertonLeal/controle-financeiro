export interface Transacao {
    id: string;
    ativo: boolean;
    accountId: string;
    parentId: string | null;
    status: string;
    tipo_transacao: string;
    preco: number;
    data: string;
    dataExclusao?: string;
    ano: number,
    mes: number,
    descricao: string;
    categoria: string;
    transacao_fixa: boolean;
    transacao_repetida: boolean;
    quantidade_repeticao: number;
    intervalo: string;
}
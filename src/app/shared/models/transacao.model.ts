import { TipoTransacao } from "../enums/tipo-transacao.enum";
import { TagTransacao } from "./tag-transacao.model";

export interface Transacao {
    tipo: TipoTransacao;
    preco: string;
    data: Date;
    descricao: string;
    tag: TagTransacao;
    despesa_fixa: boolean;
}

export const tagsReceita: TagTransacao[] = [
    { icone: 'fas fa-chart-line', nome: 'Investimentos' },
    { icone: 'fas fa-star', nome: 'Prêmios' },
    { icone: 'fas fa-gift', nome: 'Presentes' },
    { icone: 'fas fa-moeny-bill', nome: 'Salário' },
    { icone: 'fas fa-ellipsis-h', nome: 'Outros' },
];

export const tagsDespesa: TagTransacao[] = [
    { icone: 'fas fa-utensils', nome: 'Alimentação' },
    { icone: 'fas fa-university', nome: 'Educação' },
    { icone: 'fas fa-umbrella-beach', nome: 'Lazer' },
    { icone: 'fas fa-home', nome: 'Moradia' },
    { icone: 'fas fa-receipt', nome: 'Pagamentos' },
    { icone: 'fas fa-tshirt', nome: 'Roupa' },
    { icone: 'fas fa-medkit', nome: 'Saúde' },
    { icone: 'fas fa-bus-alt', nome: 'Transporte' },
    { icone: 'fas fa-ellipsis-h', nome: 'Outros' },
];
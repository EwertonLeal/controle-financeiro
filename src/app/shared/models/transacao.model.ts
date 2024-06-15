import { Periodo } from "../enums/periodos.enum";
import { TipoTransacao } from "../enums/tipo-transacao.enum";
import { TagTransacao } from "./tag-transacao.model";

export interface Transacao {
    tipo: TipoTransacao;
    preco: string;
    data: Date;
    descricao: string;
    tag: TagTransacao;
    despesa_fixa: boolean;
    recorrente: boolean;
    quantidade: number;
    periodo: Periodo;
}

export const tags: TagTransacao[] = [
    { icone: 'fas fa-chart-line', nome: 'Investimentos' },
    { icone: 'fas fa-star', nome: 'Prêmios' },
    { icone: 'fas fa-gift', nome: 'Presentes' },
    { icone: 'fas fa-moeny-bill', nome: 'Salário' },
];

export const Periodos = [
    { value: Periodo.Dias },
    { value: Periodo.Semanas },
    { value: Periodo.Meses },
    { value: Periodo.Anos }
]
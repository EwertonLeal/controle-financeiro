import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ReceitasModalComponent } from './receitas-modal/receitas-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IDate } from 'src/app/shared/interface/date.interface';
import { takeUntil } from 'rxjs';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent extends OnDestroyService implements OnInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  listaTransacoes: Transacao[] = [];
  todasTransacoes: Transacao[] = [];
  lastVisibleItem!: Transacao;
  startIndex:number = 5;
  endIndex:number = 10;
  pageIndex: number = 0;
  pageSize: number = 5;
  totalPerMonth: number = 0;
  totalConcludedPerMonth: number = 0;
  totalPendingPerMonth: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
    private _transactionService: TransactionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('pt-br');
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth);
  }

  openDialog(): void {
    this.dialog.open(ReceitasModalComponent, {
      width: '50%',
      height: '90%'
    });
  }

  getFinancialIncomeByDate(year: number, month: number) {
    this._transactionService.getFinancialIncomeTransactions(year, month, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe(({ transacoes, lastItem }) => {
      this.todasTransacoes = this.generateRepeatedTransactions(transacoes, this.pageSize);
      
      this.totalPerMonth = this.todasTransacoes.reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
      
      this.totalConcludedPerMonth = this.todasTransacoes
        .filter((transacoes) => transacoes.status == 'Concluído')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
      
        this.totalPendingPerMonth = this.todasTransacoes
        .filter((transacoes) => transacoes.status == 'Pendente')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);

      this.lastVisibleItem = lastItem;
      this.updatePaginatedList(this.pageIndex, this.pageSize);
    });
  }

  changeYear(newYear: number) {
    this.currentYear = newYear;

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth);

    if (this.paginator) {
      this.paginator.firstPage();
    }

  }

  changeMonth(newMonth: IDate) {
    this.listaTransacoes = [];
    this.currentMonth = newMonth.index;
    
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth);
    
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  nextMonth(newMonth: IDate) {
    this.listaTransacoes = [];
    this.currentMonth = newMonth.index;
    
    if(newMonth.previousIndex == 11) {
      this.currentYear = this.currentYear + 1;
    }

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth);

    if (this.paginator) {
      this.paginator.firstPage();
    }
    
  }

  previousMonth(newMonth: IDate) {
    this.listaTransacoes = [];
    this.currentMonth = newMonth.index;

    if(newMonth.previousIndex == 0) {
      this.currentYear = this.currentYear - 1;
    }

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize;
    this.updatePaginatedList(this.pageIndex, this.pageSize);
  }

  private generateRepeatedTransactions(transacoes: Transacao[], itemsPerPage: number): Transacao[] {
    const allTransactions: Transacao[] = [];
  
    transacoes.forEach((transacao: Transacao) => {
      if (transacao.transacao_repetida) {
        switch (transacao.intervalo) {
          case "dias":
            let transacoesRepetidasDias: Transacao[] = [];
          
            for (let i = 0; i < transacao.quantidade_repeticao; i++) {
              
              let newDate: any = new Date(transacao.data);
              newDate = newDate.setDate(newDate.getDate() + i);
  
              const newTransction: Transacao = { 
                ...transacao,
                status: new Date(newDate) <= new Date() ? 'Concluído' : 'Pendente',
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };

              transacoesRepetidasDias.push(newTransction)

            }
            transacoesRepetidasDias = transacoesRepetidasDias.filter(transacaoRepetida => transacaoRepetida.ano == this.currentYear && transacaoRepetida.mes == this.currentMonth );
            allTransactions.push(...transacoesRepetidasDias);

            break;
  
          case "semanas":
            let transacoesRepetidasSemanas: Transacao[] = [];

            for (let i = 0; i <= transacao.quantidade_repeticao; i++) {
              
              let newDate: any = new Date(transacao.data);
              newDate = newDate.setDate(newDate.getDate() + (7 * i));
  
              const newTransction: Transacao = { 
                ...transacao,
                status: new Date(newDate) <= new Date() ? 'Concluído' : 'Pendente',
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };
              
              transacoesRepetidasSemanas.push(newTransction)
            }

            transacoesRepetidasSemanas = transacoesRepetidasSemanas.filter(transacaoRepetida => transacaoRepetida.ano == this.currentYear && transacaoRepetida.mes == this.currentMonth );
            allTransactions.push(...transacoesRepetidasSemanas);

            break;
  
          case "meses":
            let transacoesRepetidas: Transacao[] = [];

            for (let i = 0; i <= transacao.quantidade_repeticao; i++) {
              let newDate: any = new Date(transacao.data);
              newDate = newDate.setMonth(newDate.getMonth() + i);

              const novaTransacao = {
                ...transacao,
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };

              transacoesRepetidas.push(novaTransacao)
            }

            transacoesRepetidas = transacoesRepetidas.filter(transacaoRepetida => transacaoRepetida.ano == this.currentYear && transacaoRepetida.mes == this.currentMonth );

            allTransactions.push(...transacoesRepetidas)

          break;
        }

        return;
      }

      if(transacao.transacao_fixa) {

        let newDate: any = new Date(transacao.data);
        const currentDate = new Date(this.currentYear, this.currentMonth, new Date().getDate());

        if(currentDate >= newDate) {
          newDate = newDate.setFullYear(this.currentYear, this.currentMonth, newDate.getDate())

          const novaTransacao = {
            ...transacao,
            data: new Date(newDate).toISOString(),
            ano: new Date(newDate).getFullYear(),
            mes: new Date(newDate).getMonth()
          };
  
          allTransactions.push(novaTransacao)
        }
      }
    });
  
    return allTransactions;
  }

  private updatePaginatedList(pageIndex: number, pageSize: number) {
    this.startIndex = pageIndex * pageSize;
    this.endIndex = this.startIndex + pageSize;
    this.listaTransacoes = this.todasTransacoes.slice(this.startIndex, this.endIndex);
  }
}

import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ReceitasModalComponent } from './receitas-modal/receitas-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IDate } from 'src/app/shared/models/date.interface';
import { takeUntil } from 'rxjs';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

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
  lastVisibleItem: any = null;
  totalCount: number = 0;
  startIndex:number = 5;
  endIndex:number = 10;
  pageIndex: number = 0;
  pageSize: number = 5;
  totalPerMonth: number = 0;
  totalConcludedPerMonth: number = 0;
  totalPendingPerMonth: number = 0;
  user:IUser| null = this._authService.user.value;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
    private _transactionService: TransactionsService,
    private _authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('pt-br');
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);
  }

  openDialog(): void {
    this.dialog.open(ReceitasModalComponent, {
      width: '50%',
      height: '90%'
    });
  }

  editTransaction(transacao: Transacao) {
    this.dialog.open(ReceitasModalComponent, {
      width: '50%',
      height: '90%',
      data: transacao
    });

  }

  removeTransaction(transacao: Transacao) {
    this._transactionService.deleteTransaction(transacao);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);

    if(this.todasTransacoes.length == 0) {
      this.paginator.previousPage();
    }
  }

  getFinancialIncomeByDate(year: number, month: number, accountId: string, lastVisibleItem: any) {
    this._transactionService.getFinancialIncomeTransactions(year, month, this.pageSize, accountId, lastVisibleItem).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.todasTransacoes = data.transacoes;
      this.lastVisibleItem = data.lastItem;
      
      this._transactionService.getTotalCount(this.currentMonth, this.currentYear).then(x => {
        this.totalCount = x;
      });

      this.totalPerMonth = this.todasTransacoes.reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
      this.totalConcludedPerMonth = this.todasTransacoes
        .filter((transacoes) => transacoes.status == 'Concluído')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
      this.totalPendingPerMonth = this.todasTransacoes
        .filter((transacoes) => transacoes.status == 'Pendente')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
    });
  }

  changeYear(newYear: number) {
    this.currentYear = newYear;

    this.gerarTransacoesFixas(this.currentMonth, this.currentYear);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);

    if (this.paginator) {
      this.paginator.firstPage();
    }

  }

  changeMonth(newMonth: IDate) {
    this.listaTransacoes = [];
    this.currentMonth = newMonth.index;
    
    this.gerarTransacoesFixas(this.currentMonth, this.currentYear);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);
    
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

    this.gerarTransacoesFixas(this.currentMonth, this.currentYear);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);

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

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize;

    if(this.pageIndex == 0) {
      this.lastVisibleItem = null;
      this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), null);
      return;
    }

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), this.lastVisibleItem);

  }

  private gerarTransacoesFixas(mes: number, ano: number) {
    const transacoesFixas = this.todasTransacoes.filter((transacao: Transacao) => transacao.transacao_fixa );

    if(transacoesFixas.length == 0) {
      return;
    }

    transacoesFixas.forEach((transacaoFixa: Transacao) => {
      let newDate: any = new Date(transacaoFixa.data);
      const currentDate = new Date(this.currentYear, this.currentMonth, new Date().getDate());
  
      if(currentDate >= newDate) {
        newDate = newDate.setFullYear(this.currentYear, this.currentMonth, newDate.getDate())

        this._transactionService.getTransactionsById(transacaoFixa.id, new Date(newDate).getMonth(), new Date(newDate).getFullYear()).pipe(takeUntil(this.destroy$)).subscribe(transacao => {
          if(transacao.length == 0) {
            const transacao: Transacao = {
              ...transacaoFixa,
              data: new Date(newDate).toISOString(),
              ano: new Date(newDate).getFullYear(),
              mes: new Date(newDate).getMonth(),
              uniqueId: uuidv4()
            }
            
            this._transactionService.createTransaction(transacao);
          }
          
        });
      }
    });

  }
}

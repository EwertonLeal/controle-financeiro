import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { IDate } from 'src/app/shared/models/date.interface';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IUser } from 'src/app/shared/models/user.model';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';
import { v4 as uuidv4 } from 'uuid';
import { SaidasModalComponent } from './saidas-modal/saidas-modal.component';

@Component({
  selector: 'app-saidas',
  templateUrl: './saidas.component.html',
  styleUrls: ['./saidas.component.scss']
})
export class SaidasComponent extends OnDestroyService implements OnInit {
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
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);
  }

  openDialog(): void {
    this.dialog.open(SaidasModalComponent, {
      width: '50%',
      height: '90%'
    });
  }

  editTransaction(transacao: Transacao) {
    this.dialog.open(SaidasModalComponent, {
      width: '50%',
      height: '90%',
      data: transacao
    });

  }

  removeTransaction(transacao: Transacao) {
    if(transacao.transacao_fixa) {
      let deletedTransaction: Transacao = {...transacao, ativo: false };
      this._transactionService.updateTransaction(deletedTransaction);
    } else {
      this._transactionService.deleteTransaction(transacao);
    }

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);

    if(this.todasTransacoes.length == 0) {
      this.paginator.previousPage();
    }
  }

  getFinancialIncomeByDate(year: number, month: number, accountId: string, transactionType: string, lastVisibleItem: any) {
    this._transactionService.getFinancialIncomeTransactions(year, month, this.pageSize, accountId, transactionType, lastVisibleItem).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.todasTransacoes = data.transacoes;
      this.lastVisibleItem = data.lastItem;
      
      this._transactionService.getTotalCount(this.currentMonth, this.currentYear, transactionType).then(x => {
        this.totalCount = x;
      });

      this.getTotalOfMonth()
    });
  }

  changeYear(newYear: number) {
    this.currentYear = newYear;

    this._transactionService.generateFixedTransactions("saída", String(this.user?.id), this.currentYear, this.currentMonth);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);

    if (this.paginator) {
      this.paginator.firstPage();
    }

  }

  changeMonth(newMonth: IDate) {
    this.listaTransacoes = [];
    this.currentMonth = newMonth.index;
    
    this._transactionService.generateFixedTransactions("saída", String(this.user?.id), this.currentYear, this.currentMonth);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);
    
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

    this._transactionService.generateFixedTransactions("saída", String(this.user?.id), this.currentYear, this.currentMonth);
    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);

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

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize;

    if(this.pageIndex == 0) {
      this.lastVisibleItem = null;
      this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", null);
      return;
    }

    this.getFinancialIncomeByDate(this.currentYear, this.currentMonth, String(this.user?.id), "saída", this.lastVisibleItem);

  }

  getTotalOfMonth() {
    this._transactionService.getPriceAndStatusOfTransactions(this.currentMonth, this.currentYear, String(this.user?.id), "saída")
    .pipe(takeUntil(this.destroy$)).subscribe((res: any[]) => {
      this.totalPerMonth = res.reduce((acc: number, cur: any) => acc + cur.preco, 0);
      
      this.totalConcludedPerMonth = res
        .filter((transacoes) => transacoes.status == 'Concluído')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
        
      this.totalPendingPerMonth = res
        .filter((transacoes) => transacoes.status == 'Pendente')
        .reduce((acc: number, cur: Transacao) => acc + cur.preco, 0);
    })
  }

}

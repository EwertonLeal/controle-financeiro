import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { GraphData } from 'src/app/shared/models/graphData.model';
import { MonthAndYear } from 'src/app/shared/models/month-year.model';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IUser } from 'src/app/shared/models/user.model';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';
import { selectMonthAndYear } from 'src/app/state/month-year/month-year.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends OnDestroyService implements OnInit {
  
  currentDate: Date = new Date();
  user:IUser| null = this._authService.user.value;
  entradas!: GraphData[];
  saidas!: GraphData[];
  totalEntradas!: number;
  totalSaidas!: number;
  total!: number;
  monthAndYear$!: Observable<MonthAndYear | null>;


  constructor(
    private _transactionService: TransactionsService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private store: Store
  ) {
    super();
    this.monthAndYear$ = this.store.select(selectMonthAndYear);
  }
  
  ngOnInit(): void {
    this.monthAndYear$.pipe(takeUntil(this.destroy$)).subscribe((monthAndYear: MonthAndYear | null) => {
      
      if(monthAndYear == null) {
        this.setSumOfTransactions(this.route.snapshot.data['graphData']);
        return;
      }

      this._transactionService.getAllTransactionsOfAccountByDate(monthAndYear.month, monthAndYear.year, String(this.user?.id))
      .pipe(take(1)).subscribe((graphData: GraphData[]) => {
        this.setSumOfTransactions(graphData);
      })

    });
  }

  private setSumOfTransactions(graphData: GraphData[]) {
    this.entradas = graphData.filter(transacao => transacao.type === "receita");
    this.totalEntradas = this.entradas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.saidas = graphData.filter(transacao => transacao.type === "saída");
    this.totalSaidas = this.saidas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.total = this.totalEntradas - this.totalSaidas;
  }

}

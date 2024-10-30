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
  transactions!: GraphData[];
  entradas!: GraphData[];
  saidas!: GraphData[];
  totalEntradas!: number;
  totalSaidas!: number;
  total!: number;
  monthAndYear$!: Observable<MonthAndYear | null>;

  basicData: any;

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
        this.transactions = this.route.snapshot.data['graphData'];
        this.setSumOfTransactions(this.route.snapshot.data['graphData']);
        return;
      }

      this._transactionService.getAllTransactionsOfAccountByDate(monthAndYear.month, monthAndYear.year, String(this.user?.id))
      .pipe(takeUntil(this.destroy$)).subscribe((graphData: GraphData[]) => {
        this.transactions = graphData;
        this.setSumOfTransactions(this.transactions);
      })

    });

    this.setDataInGraph(this.entradas);
  }

  changeGraphSelection(eventValue: string) {
    switch (eventValue) {
      case 'saídas':
          this.setDataInGraph(this.saidas);
        break;

      case 'comparar':
          this.compareDataByType(this.transactions);
        break;
    
      default:
          this.setDataInGraph(this.entradas);
        break;
    }
  }

  private setDataInGraph(dataSource: GraphData[]) {

    const aggregatedData = Object.values(dataSource.reduce((acc, curr) => {
      const key = curr.category;
  
      if (!acc[key]) {
          acc[key] = { ...curr };
      } else {
          acc[key].preco += curr.preco;
      }
  
      return acc;
    }, {} as Record<string, GraphData>));

    this.basicData = {
      labels: [...aggregatedData.map(data => data.category)],
      datasets: [
          {
              data: [...aggregatedData.map(data => data.preco)],
              borderWidth: 1
          }
      ]
    };
  }

  private compareDataByType(dataSource: GraphData[]) {

    const aggregatedData = Object.values(dataSource.reduce((acc, curr) => {
      const key = curr.type;
  
      if (!acc[key]) {
          acc[key] = { ...curr };
      } else {
          acc[key].preco += curr.preco;
      }
  
      return acc;
    }, {} as Record<string, GraphData>));

    this.basicData = {
      labels: [...aggregatedData.map(data => data.type)],
      datasets: [
          {
              data: [...aggregatedData.map(data => data.preco)],
              borderWidth: 1
          }
      ]
    };

  }

  private setSumOfTransactions(graphData: GraphData[]) {
    this.entradas = graphData.filter(transacao => transacao.type === "receita");
    this.totalEntradas = this.entradas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.saidas = graphData.filter(transacao => transacao.type === "saída");
    this.totalSaidas = this.saidas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.total = this.totalEntradas - this.totalSaidas;
  }
}

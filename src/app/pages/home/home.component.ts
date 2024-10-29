import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { GraphData } from 'src/app/shared/models/graphData.model';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  currentDate: Date = new Date();
  user:IUser| null = this._authService.user.value;
  transacoes!: GraphData[];
  entradas!: GraphData[];
  saidas!: GraphData[];
  totalEntradas!: number;
  totalSaidas!: number;
  total!: number;

  constructor(
    private _transactionService: TransactionsService,
    private _authService: AuthService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.transacoes = this.route.snapshot.data['graphData'];

    this.entradas = this.transacoes.filter(transacao => transacao.type === "receita");
    this.totalEntradas = this.entradas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.saidas = this.transacoes.filter(transacao => transacao.type === "saída");
    this.totalSaidas = this.saidas.reduce((acc: number, transacao: GraphData) => acc + transacao.preco, 0);

    this.total = this.totalEntradas - this.totalSaidas;
  }



}

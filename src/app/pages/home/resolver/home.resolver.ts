// exemplo-resolver.service.ts
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { GraphData } from 'src/app/shared/models/graphData.model';
import { IUser } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<any> {

  currentDate: Date = new Date();
  user:IUser| null = this._authService.user.value;

  constructor(
    private _transactionService: TransactionsService,
    private _authService: AuthService
  ) {}

  resolve(): Observable<GraphData[]> {
    return this._transactionService.getAllTransactionsOfAccountByDate(
        this.currentDate.getMonth(), 
        this.currentDate.getFullYear(), 
        String(this.user?.id)
      ).pipe(take(1))
  }
}

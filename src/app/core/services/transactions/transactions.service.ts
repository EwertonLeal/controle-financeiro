import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService extends OnDestroyService {

  private dbPath = 'transacoes';
  private lastVisible: any = null;

  constructor(
    private db: AngularFireDatabase,
    private fireStore: AngularFirestore
  ) {
    super();
  }

  createTransaction(transacao: Transacao) {
    this.fireStore.collection(this.dbPath).doc().set(transacao);
  }

  getFinancialIncomeTransactions(ano: number, mes: number, itemsPerPage: number, accountId: string, lastVisibleItem: any): Observable<any> {
    const query = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        .where('accountId', '==', accountId)
        .orderBy('data', 'asc')
        .limit(itemsPerPage);
  
      if (lastVisibleItem) {
        queryRef = queryRef.startAfter(lastVisibleItem)
      }
  
      return queryRef;
    }).snapshotChanges();
  

    return combineLatest([
      query.pipe(
        map((result: DocumentChangeAction<unknown>[]) => result.map(x => x.payload)
      ),
      map(payloads => {
        const transacoes: Transacao[] = payloads.map(payload => payload.doc.data() as Transacao);
        const lastItem =  payloads[payloads.length - 1].doc;

        return {
          transacoes,
          lastItem
        }
      }),
    ),

    this.getTotalCount(),

    ]).pipe(
      map(([{transacoes, lastItem}, total]) => ({ transacoes, lastItem,  total }))
    );

  }

  getTransactionsById(id: string, mes: number, ano: number) {
    const query = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('id', '==', id)
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        .orderBy('data', 'asc');
  
      return queryRef;
    }).snapshotChanges();

    return query.pipe(
      map((change: DocumentChangeAction<unknown>[]) => {
        return change.map(x => x.payload.doc.data() as Transacao)
      })
    );
  }

  getTotalCount(): Observable<number> {
    return this.fireStore.collection(this.dbPath).get().pipe(
      map(snapshot => snapshot.size)
    );
  }
}

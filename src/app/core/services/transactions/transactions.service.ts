import { Injectable } from '@angular/core';
import { combineLatest, from, map, Observable, tap } from 'rxjs';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private dbPath = 'transacoes';

  constructor(
    private db: AngularFireDatabase,
    private fireStore: AngularFirestore
  ) { }

  createTransaction(transacao: Transacao) {
    this.fireStore.collection(this.dbPath).doc(this.fireStore.createId()).set(transacao);
  }

  getFinancialIncomeTransactions(ano: number, mes: number, itemsPerPage: number, lastVisibleItem?: any ): Observable<any> {
    const query1 = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        .orderBy('data', 'asc')
        .limit(itemsPerPage);
  
      if (lastVisibleItem) {
        queryRef = queryRef.startAfter(lastVisibleItem);
      }
  
      return queryRef;
    }).snapshotChanges();
  
    // Consulta para transações fixas
    const query2 = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('transacao_fixa', '==', true)
        .orderBy('data', 'asc')
        .limit(itemsPerPage);
  
      if (lastVisibleItem) {
        queryRef = queryRef.startAfter(lastVisibleItem);
      }
  
      return queryRef;
    }).snapshotChanges();

    // Consulta para transacoes repetidas
    const query3 = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('intervalo', 'in', ['dias', 'semanas', 'meses'])
        .orderBy('data', 'asc')
        .limit(itemsPerPage);
  
      if (lastVisibleItem) {
        queryRef = queryRef.startAfter(lastVisibleItem);
      }
  
      return queryRef;
    }).snapshotChanges();
  
    return combineLatest([query1, query2, query3]).pipe(
      map(([result1, result2, result3]: [DocumentChangeAction<unknown>[], DocumentChangeAction<unknown>[], DocumentChangeAction<unknown>[]]) => {
        const combinedResults = [...result1, ...result2, ...result3];
        const lastItem = combinedResults[combinedResults.length - 1]?.payload.doc.data() as Transacao;
        let transacoes = combinedResults.map(change => change.payload.doc.data() as Transacao);

        transacoes = transacoes.reduce((acc: Transacao[], current: Transacao) => {
          const chaveUnica = `${current.descricao}-${current.data}-${current.preco}-${current.categoria}`;
          const jaExiste = acc.some(transacao => 
            `${transacao.descricao}-${transacao.data}-${transacao.preco}-${transacao.categoria}` === chaveUnica
          );
      
          if (!jaExiste) {
            acc.push(current);
          }
      
          return acc;
        }, []);
  
        return {
          transacoes,
          lastItem
        };
      })
    );
  }

}

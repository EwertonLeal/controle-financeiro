import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, takeUntil, tap } from 'rxjs';
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

  updateTransaction(transacao: Transacao) {
    this.fireStore.collection(this.dbPath, ref => ref.where('uniqueId', '==', transacao.uniqueId))
    .get().pipe(takeUntil(this.destroy$)).subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update(transacao)
          .then(() => console.log('Documento atualizado com sucesso'))
          .catch(error => console.error('Erro ao atualizar documento:', error))
      })
    })
  }

  deleteTransaction(transacao: Transacao) {
    this.fireStore.collection(this.dbPath, ref => ref.where('uniqueId', '==', transacao.uniqueId))
    .get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete()
          .then(() => console.log('Documento deletado com sucesso'))
          .catch(error => console.error('Erro ao deletar documento:', error));
      });
    });
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

        const transacoes: Transacao[] = payloads.length > 0 ? payloads.map(payload => payload.doc.data() as Transacao) : [];
        const lastItem =  payloads.length > 0 ? payloads[payloads.length - 1].doc : null;
        return {
          transacoes,
          lastItem
        }
      }),
    )
    ]).pipe(
      map(([{transacoes, lastItem}]) => ({ transacoes, lastItem }))
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

  async getTotalCount(mes: number, ano: number): Promise<number> {
    const snapshot = await this.fireStore.collection(this.dbPath, ref => {
      const queryRef = ref
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        
        return queryRef;
    }).get().toPromise();
    
    if(snapshot) {
      return snapshot.size;
    }

    return 0
  }
}

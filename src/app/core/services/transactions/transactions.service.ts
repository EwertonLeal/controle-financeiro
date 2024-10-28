import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, take, takeUntil, tap } from 'rxjs';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { OnDestroyService } from 'src/app/shared/service/onDestroy/on-destroy.service';
import { v4 as uuidv4 } from 'uuid';

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
    this.fireStore.collection(this.dbPath, ref => ref.where('id', '==', transacao.id))
      .get().pipe(take(1)).subscribe(querySnapshot => {
        if (querySnapshot.empty) {
          console.error(`Nenhum documento encontrado para o uniqueId: ${transacao.id}`);
          return;
        }
        
        const docRef = querySnapshot.docs[0].ref;
        docRef.update(transacao)
          .then(() => console.log('Documento atualizado com sucesso'))
          .catch(error => console.error('Erro ao atualizar documento:', error));
    });
  }

  deleteTransaction(transacao: Transacao) {
    this.fireStore.collection(this.dbPath, ref => ref.where('id', '==', transacao.id))
    .get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete()
          .then(() => console.log('Documento deletado com sucesso'))
          .catch(error => console.error('Erro ao deletar documento:', error));
      });
    });
  }

  getFinancialIncomeTransactions(ano: number, mes: number, itemsPerPage: number, accountId: string, type: string, lastVisibleItem: any): Observable<any> {
    const query = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        .where('accountId', '==', accountId)
        .where('tipo_transacao', '==', type)
        .where('ativo', '==', true)
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

  getFixedTransactionByParentId(id: string, mes: number, ano: number) {
    const query = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('parentId', '==', id)
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

  async getTotalCount(mes: number, ano: number, type: string): Promise<number> {
    const snapshot = await this.fireStore.collection(this.dbPath, ref => {
      const queryRef = ref
        .where('ano', '==', ano)
        .where('mes', '==', mes)
        .where('tipo_transacao', '==', type)
        .where('ativo', '==', true)
        
        return queryRef;
    }).get().toPromise();
    
    if(snapshot) {
      return snapshot.size;
    }

    return 0
  }

  public generateFixedTransactions(type: string, userId: string, year: number, month: number) {
    this.getAllFixedTransaction(userId, type)
    .pipe(take(1)).subscribe((transacoesFixas: Transacao[]) => {

      if(transacoesFixas.length == 0) {
        return;
      }
  
      transacoesFixas.forEach((transacaoFixa: Transacao) => {
        let newDate: any = new Date(transacaoFixa.data);
        const currentDate = new Date(year, month, new Date().getDate());
    
        if(currentDate >= newDate) {
          newDate = newDate.setFullYear(year, month, newDate.getDate())
  
          this.getFixedTransactionByParentId(transacaoFixa.id, new Date(newDate).getMonth(), new Date(newDate).getFullYear()).pipe(take(1)).subscribe(transacao => {
            if(transacao.length == 0) {
              const transacao: Transacao = {
                ...transacaoFixa,
                id: uuidv4(),
                parentId: transacaoFixa.id,
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth(),
                ativo: true,
                transacao_fixa: false
              }
              
              this.createTransaction(transacao);
            }
            
          });
        }
      });

    });
  }

  private getAllFixedTransaction(accountId: string, type: string) {
    const query = this.fireStore.collection(this.dbPath, ref => {
      let queryRef = ref
        .where('accountId', '==', accountId)
        .where('ativo', '==', true)
        .where('transacao_fixa', '==', true)
        .where('tipo_transacao', '==', type)
        .orderBy('data', 'asc');
    
      return queryRef;
    }).snapshotChanges();
    
    return query.pipe(
      map((change: DocumentChangeAction<unknown>[]) => {
        return change.map(x => x.payload.doc.data() as Transacao);
      })
    );
    
  }

}

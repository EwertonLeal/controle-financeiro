import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Intervalo } from 'src/app/shared/models/intervalo.model';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'receitas-modal',
  templateUrl: './receitas-modal.component.html',
  styleUrls: ['./receitas-modal.component.scss']
})
export class ReceitasModalComponent implements OnInit {

  receita_form!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredCategorys: Observable<string[]>;
  selectedCategory: string[] = [];
  categoryName: string[] = [];
  intervals: Intervalo[] = [];
  receitaFixa: boolean = false;
  repetirReceita: boolean = false;

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
  public user:IUser| null = this._authService.user.value;

  constructor(
    public dialogRef: MatDialogRef<ReceitasModalComponent>,
    private fb: FormBuilder,
    private _transactionService: TransactionsService,
    private _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public _transacao: Transacao

  ) {
    this.filteredCategorys = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => (category ? this._filter(category) : this.categoryName.slice())),
    );
  }
  ngOnInit(): void {
    this.categoryName = [
      "Investimento",
      "Presente",
      "Prêmios",
      "Salário",
      "Outros"
    ];
  
    this.selectedCategory = [this.categoryName[0]];

    this.intervals = [
      { value: 'dias', viewValue: 'Dia(s)' },
      { value: 'semanas', viewValue: 'Semana(s)' },
      { value: 'meses', viewValue: 'Mese(s)' },
    ];

    this.receita_form = this.fb.group({
      valor_receita: [ this._transacao ? this._transacao.preco.toString() : '', Validators.required],
      data_receita: [ this._transacao ? new Date(this._transacao.data) : new Date(), Validators.required],
      descricao_receita: [ this._transacao ? this._transacao.descricao : '' ],
      tipo_receita: [ this._transacao ? this._transacao.categoria : this.selectedCategory[0], Validators.required],
      receita_fixa: [ this._transacao ? this._transacao.transacao_fixa : false],
      repetir_receita: [ this._transacao ? this._transacao.transacao_repetida : false],
      quantidade_receita: [
        this._transacao ? { value: this._transacao.quantidade_repeticao, disabled: true } :
        { value: '', disabled: true }
      ],
      intervalo_receita: [
        this._transacao ? { value: this._transacao.intervalo, disabled: true } :
        { value: '', disabled: true }
      ]
    });

    this.receita_form.get('repetir_receita')?.valueChanges.subscribe((isRepetirReceita: boolean) => {
      this.toggleRepetirReceitaFields(isRepetirReceita);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedCategory = [value];
    }

    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);
  }

  remove(): void {
    this.selectedCategory = [];
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategory = [event.option.viewValue]
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
    this.receita_form.controls['tipo_receita'].setValue(this.selectedCategory[0]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categoryName.filter((category: string) => category.toLowerCase().includes(filterValue));
  }

  onReceitaFixa(event: any) {
    if(event.checked && this.receita_form.get('repetir_receita')?.value) {
      this.receita_form.get('repetir_receita')?.setValue(false, { emitEvent: false });
    }

    this.receita_form.get('receita_fixa')?.setValue(event.checked, { emitEvent: false })
  }

  onRepetirReceita(event: any) {
    if(event.checked && this.receita_form.get('receita_fixa')?.value) {
      this.receita_form.get('receita_fixa')?.setValue(false, { emitEvent: false });
    }

    this.receita_form.get('repetir_receita')?.setValue(event.checked, { emitEvent: false })
  }

  toggleRepetirReceitaFields(isRepetirReceita: boolean): void {
    if (isRepetirReceita) {
      this.receita_form.get('quantidade_receita')?.enable({ emitEvent: false });
      this.receita_form.get('intervalo_receita')?.enable({ emitEvent: false });
    } else {
      this.receita_form.get('quantidade_receita')?.disable({ emitEvent: false });
      this.receita_form.get('intervalo_receita')?.disable({ emitEvent: false });
    }
  }

  criarTransacao() {

    const receita: Transacao = {
      id: this._transacao ? this._transacao.id : uuidv4(),
      accountId: String(this.user?.id),
      uniqueId: this._transacao ? this._transacao.uniqueId : uuidv4(),
      status: new Date(this.receita_form.get('data_receita')?.value) <= new Date() ? 'Concluído' : 'Pendente',
      tipo_transacao: "receita",
      preco: Number(this.receita_form.get('valor_receita')?.value),
      data: new Date(this.receita_form.get('data_receita')?.value).toISOString(),
      ano: new Date(this.receita_form.get('data_receita')?.value).getFullYear(),
      mes: new Date(this.receita_form.get('data_receita')?.value).getMonth(),
      descricao: this.receita_form.get('descricao_receita')?.value,
      categoria: this.receita_form.get('tipo_receita')?.value,
      transacao_fixa: this.receita_form.get('receita_fixa')?.value,
      transacao_repetida: this.receita_form.get('repetir_receita')?.value,
      quantidade_repeticao: this.receita_form.get('quantidade_receita')?.value,
      intervalo: this.receita_form.get('intervalo_receita')?.value
    }

    if(receita.transacao_repetida) {
      
      switch (receita.intervalo) {
        case "dias":
          for (let i = 0; i < receita.quantidade_repeticao; i++) {
            
            let newDate: any = new Date(receita.data);
            newDate = newDate.setDate(newDate.getDate() + i);

            if( i == 0 && this._transacao) {
              receita.descricao + `[${i+1} / ${receita.quantidade_repeticao}]`
              this._transactionService.updateTransaction(receita);
            } else {
              const newTransction: Transacao = { 
                ...receita,
                uniqueId: uuidv4(),
                quantidade_repeticao: 0,
                descricao: receita.descricao + `[${i+1} / ${receita.quantidade_repeticao}]`,
                status: new Date(newDate) <= new Date() ? 'Concluído' : 'Pendente',
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };

              this._transactionService.createTransaction(newTransction);
            }

          }

          break;

        case "semanas":
          for (let i = 0; i <= receita.quantidade_repeticao; i++) {
            
            let newDate: any = new Date(receita.data);
            newDate = newDate.setDate(newDate.getDate() + (7 * i));

            if( i == 0 && this._transacao) {
              receita.descricao + `[${i+1} / ${receita.quantidade_repeticao}]`
              this._transactionService.updateTransaction(receita);
            } else {
              const newTransction: Transacao = { 
                ...receita,
                uniqueId: uuidv4(),
                quantidade_repeticao: 0,
                status: new Date(newDate) <= new Date() ? 'Concluído' : 'Pendente',
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };
              
              this._transactionService.createTransaction(newTransction);
            }

          }
          break;

        case "meses":
          for (let i = 0; i <= receita.quantidade_repeticao; i++) {
            let newDate: any = new Date(receita.data);
            newDate = newDate.setMonth(newDate.getMonth() + i);

            if( i == 0 && this._transacao) {
              receita.descricao + `[${i+1} / ${receita.quantidade_repeticao}]`
              this._transactionService.updateTransaction(receita);
            } else {
              const newTransction = {
                ...receita,
                uniqueId: uuidv4(),
                status: new Date(newDate) <= new Date() ? 'Concluído' : 'Pendente',
                data: new Date(newDate).toISOString(),
                ano: new Date(newDate).getFullYear(),
                mes: new Date(newDate).getMonth()
              };
  
              this._transactionService.createTransaction(newTransction);
            }
          }
        break;
      }
      return;
    }

    if(this._transacao) {
      this._transactionService.updateTransaction(receita);
      return;
    }
    
    this._transactionService.createTransaction(receita);
  }

}

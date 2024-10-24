import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { Intervalo } from 'src/app/shared/models/intervalo.model';
import { Transacao } from 'src/app/shared/models/transacao.model';
import { IUser } from 'src/app/shared/models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-saidas-modal',
  templateUrl: './saidas-modal.component.html',
  styleUrls: ['./saidas-modal.component.scss']
})
export class SaidasModalComponent implements OnInit {

  saida_form!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredCategorys: Observable<string[]>;
  selectedCategory: string[] = [];
  categoryName: string[] = [];
  intervals: Intervalo[] = [];
  saidaFixa: boolean = false;
  repetirSaida: boolean = false;

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
  public user:IUser| null = this._authService.user.value;

  constructor(
    public dialogRef: MatDialogRef<SaidasModalComponent>,
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

    this.saida_form = this.fb.group({
      valor_saida: [ this._transacao ? this._transacao.preco.toString() : '', Validators.required],
      data_saida: [ this._transacao ? new Date(this._transacao.data) : new Date(), Validators.required],
      descricao_saida: [ this._transacao ? this._transacao.descricao : '' ],
      tipo_saida: [ this._transacao ? this._transacao.categoria : this.selectedCategory[0], Validators.required],
      saida_fixa: [ this._transacao ? this._transacao.transacao_fixa : false],
      repetir_saida: [ this._transacao ? this._transacao.transacao_repetida : false],
      quantidade_saida: [
        this._transacao ? { value: this._transacao.quantidade_repeticao, disabled: true } :
        { value: '', disabled: true }
      ],
      intervalo_saida: [
        this._transacao ? { value: this._transacao.intervalo, disabled: true } :
        { value: '', disabled: true }
      ]
    });

    this.saida_form.get('repetir_saida')?.valueChanges.subscribe((isRepetirSaida: boolean) => {
      this.toggleRepetirSaidaFields(isRepetirSaida);
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
    this.saida_form.controls['tipo_saida'].setValue(this.selectedCategory[0]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categoryName.filter((category: string) => category.toLowerCase().includes(filterValue));
  }

  onSaidaFixa(event: any) {
    if(event.checked && this.saida_form.get('repetir_saida')?.value) {
      this.saida_form.get('repetir_saida')?.setValue(false, { emitEvent: false });
    }

    this.saida_form.get('saida_fixa')?.setValue(event.checked, { emitEvent: false })
  }

  onRepetirSaida(event: any) {
    if(event.checked && this.saida_form.get('saida_fixa')?.value) {
      this.saida_form.get('saida_fixa')?.setValue(false, { emitEvent: false });
    }

    this.saida_form.get('repetir_saida')?.setValue(event.checked, { emitEvent: false })
  }

  toggleRepetirSaidaFields(isRepetirSaida: boolean): void {
    if (isRepetirSaida) {
      this.saida_form.get('quantidade_saida')?.enable({ emitEvent: false });
      this.saida_form.get('intervalo_saida')?.enable({ emitEvent: false });
    } else {
      this.saida_form.get('quantidade_saida')?.disable({ emitEvent: false });
      this.saida_form.get('intervalo_saida')?.disable({ emitEvent: false });
    }
  }

  criarTransacao() {

    const saida: Transacao = {
      id: this._transacao ? this._transacao.id : uuidv4(),
      accountId: String(this.user?.id),
      uniqueId: this._transacao ? this._transacao.uniqueId : uuidv4(),
      status: new Date(this.saida_form.get('data_saida')?.value) <= new Date() ? 'Concluído' : 'Pendente',
      tipo_transacao: "saída",
      preco: Number(this.saida_form.get('valor_saida')?.value),
      data: new Date(this.saida_form.get('data_saida')?.value).toISOString(),
      ano: new Date(this.saida_form.get('data_saida')?.value).getFullYear(),
      mes: new Date(this.saida_form.get('data_saida')?.value).getMonth(),
      descricao: this.saida_form.get('descricao_saida')?.value,
      categoria: this.saida_form.get('tipo_saida')?.value,
      transacao_fixa: this.saida_form.get('saida_fixa')?.value,
      transacao_repetida: this.saida_form.get('repetir_saida')?.value,
      quantidade_repeticao: this.saida_form.get('quantidade_saida')?.value,
      intervalo: this.saida_form.get('intervalo_saida')?.value
    }

    if(saida.transacao_repetida) {
      
      switch (saida.intervalo) {
        case "dias":
          for (let i = 0; i < saida.quantidade_repeticao; i++) {
            
            let newDate: any = new Date(saida.data);
            newDate = newDate.setDate(newDate.getDate() + i);

            if( i == 0 && this._transacao) {
              saida.descricao + `[${i+1} / ${saida.quantidade_repeticao}]`
              this._transactionService.updateTransaction(saida);
            } else {
              const newTransction: Transacao = { 
                ...saida,
                uniqueId: uuidv4(),
                quantidade_repeticao: 0,
                descricao: saida.descricao + `[${i+1} / ${saida.quantidade_repeticao}]`,
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
          for (let i = 0; i <= saida.quantidade_repeticao; i++) {
            
            let newDate: any = new Date(saida.data);
            newDate = newDate.setDate(newDate.getDate() + (7 * i));

            if( i == 0 && this._transacao) {
              saida.descricao + `[${i+1} / ${saida.quantidade_repeticao}]`
              this._transactionService.updateTransaction(saida);
            } else {
              const newTransction: Transacao = { 
                ...saida,
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
          for (let i = 0; i <= saida.quantidade_repeticao; i++) {
            let newDate: any = new Date(saida.data);
            newDate = newDate.setMonth(newDate.getMonth() + i);

            if( i == 0 && this._transacao) {
              saida.descricao + `[${i+1} / ${saida.quantidade_repeticao}]`
              this._transactionService.updateTransaction(saida);
            } else {
              const newTransction = {
                ...saida,
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
      this._transactionService.updateTransaction(saida);
      return;
    }
    
    this._transactionService.createTransaction(saida);
  }

}

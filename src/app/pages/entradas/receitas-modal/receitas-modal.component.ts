import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Intervalo } from 'src/app/shared/models/intervalo.model';
import { TransactionsService } from 'src/app/core/services/transactions/transactions.service';
import { Transacao } from 'src/app/shared/models/transacao.model';

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

  constructor(
    public dialogRef: MatDialogRef<ReceitasModalComponent>,
    private fb: FormBuilder,
    private _transactionService: TransactionsService
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
      valor_receita: ['', Validators.required],
      data_receita: ['', Validators.required],
      descricao_receita: [''],
      tipo_receita: [this.selectedCategory[0], Validators.required],
      receita_fixa: [false],
      repetir_receita: [false],
      quantidade_receita: [{ value: '', disabled: true }],
      intervalo_receita: [{ value: '', disabled: true }]
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

    // Add our fruit
    if (value) {
      this.selectedCategory = [value];
    }

    // Clear the input value
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
      tipo_transacao: "receita",
      preco: this.receita_form.get('valor_receita')?.value,
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

    this._transactionService.createTransaction(receita);
  }

}

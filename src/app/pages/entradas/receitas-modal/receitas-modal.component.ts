import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Intervalo } from 'src/app/shared/models/intervalo.model';

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
      { value: 'dias-0', viewValue: 'Dia(s)' },
      { value: 'semanas-0', viewValue: 'Semana(s)' },
      { value: 'meses-0', viewValue: 'Mese(s)' },
    ];

    this.receita_form = this.fb.group({
      valor_receita: ['', Validators.required],
      data_receita: ['', Validators.required],
      descricao_receita: [''],
      tipo_receita: ['', Validators.required],
      receita_fixa: [false, Validators.requiredTrue],
      repetir_receita: [false, Validators.requiredTrue],
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
}

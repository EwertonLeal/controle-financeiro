import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReceitasModalComponent } from './receitas-modal/receitas-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';

export interface PeriodicElement {
  data: Date;
  name: string;
  descricao: string;
  categoria: string;
  valor: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {data: new Date(), name: "Compra 1", descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac porta dui, vitae dapibus erat. Aliquam scelerisque ex eget erat ultrices, sed sagittis ante vehicula. Curabitur in lorem eu turpis auctor consectetur. Curabitur ut lacus eu metus efficitur accumsan. Sed sit amet elit quis justo dignissim efficitur nec id libero. Etiam fringilla faucibus leo vel facilisis. Pellentesque consequat dui in pellentesque euismod. In hac habitasse platea dictumst. Cras posuere urna sapien, ut vestibulum dui dignissim sed. Cras tempor aliquet felis non dapibus. Suspendisse mollis hendrerit ligula, vel ultrices libero tincidunt vel. Morbi ultrices pellentesque ligula non pulvinar.", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 2", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 3", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 4", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 5", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 6", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 7", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 8", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 9", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
  {data: new Date(), name: "Compra 10", descricao: "lorem ipsum dolor sit amet", categoria: 'Outros', valor: 19.90},
];

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["data", "name", "descricao", "categoria", "valor"];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit(): void {
    this.dateAdapter.setLocale('pt-br');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    this.dialog.open(ReceitasModalComponent, {
      width: '50%',
      height: '90%'
    });
  }

}

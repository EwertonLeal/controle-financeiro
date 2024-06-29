import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoTransacao } from '../../enums/tipo-transacao.enum';
import { TagTransacao } from '../../models/tag-transacao.model';
import { tagsDespesa, tagsReceita } from '../../models/transacao.model';

@Component({
  selector: 'cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  styleUrls: ['./cadastro-modal.component.scss']
})
export class CadastroModalComponent implements OnInit {

  @ViewChild('content', { static: true }) contentRef: any;

  public tipoDeTransacao!: TipoTransacao;
  public transacoes!: TagTransacao[];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(tipoTransacao: TipoTransacao) {
    this.tipoDeTransacao = tipoTransacao;

    if(this.tipoDeTransacao == 'Despesa') {
      this.transacoes = tagsDespesa;
    } else {
      this.transacoes = tagsReceita;
    }

		this.modalService.open(this.contentRef);
  }

  //  

}

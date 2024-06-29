import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables  } from 'chart.js';
import { BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CadastroModalComponent } from 'src/app/shared/components/cadastro-modal/cadastro-modal.component';
import { TipoTransacao } from 'src/app/shared/enums/tipo-transacao.enum';

interface Country {
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('cadastroModal') cadastroModal!: CadastroModalComponent

  constructor() { }

	public countries = COUNTRIES;
  public page = 4;

	getPageSymbol(current: number) {
		return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
	}

	selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

  ngOnInit(): void {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend
    );
  }

  ngAfterViewInit(): void {
    this.createAndInjectBarChartInCanvaElement();
  }

  async createAndInjectBarChartInCanvaElement() {
    const canva = await <HTMLCanvasElement>document.querySelector('#barChart');
    const context: any = canva.getContext('2d');
    const chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });

    return chart;
  }

  public cadastrarGastos() {
    const tipoDeTransacao = TipoTransacao.despesa;
    this.cadastroModal.open(tipoDeTransacao);
  }

  public cadastrarReceitas() {
    const tipoDeTransacao = TipoTransacao.receita;
    this.cadastroModal.open(tipoDeTransacao);
  }

}

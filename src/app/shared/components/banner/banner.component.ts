import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() imagePath!: string;
  @Input() imageAlt!: string;

  constructor() { }

  ngOnInit(): void {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-gif',
  templateUrl: './display-gif.component.html',
  styleUrls: ['./display-gif.component.scss'],
})
export class DisplayGifComponent implements OnInit {
  @Input() seletedGif: any
  constructor() { }

  ngOnInit() { }

}

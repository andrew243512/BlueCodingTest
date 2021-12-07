import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: any[];
  constructor() { }

  ngOnInit() {
    this.history = JSON.parse(localStorage.getItem(environment.DB_TABLE));
  }

  removeWord(id: any){
    const history = this.history.filter((data: any) => data.id !== id)
    localStorage.setItem(environment.DB_TABLE, JSON.stringify(history))
    this.history = history;
  }

}

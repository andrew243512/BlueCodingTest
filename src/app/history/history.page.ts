import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetHistoryGIF, RemoveGIF } from '../shared/actions/gift.actions';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: any[];
  constructor(
    private store: Store
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new GetHistoryGIF())
    this.store.select(state => state.gifs.history).subscribe((res : any) => {
      this.history = res;
    })
  }

  removeWord(id: any){
    this.store.dispatch(new RemoveGIF(id))
  }

}

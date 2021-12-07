import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DisplayGifComponent } from '../components/display-gif/display-gif.component';
import { GiphyApiService } from '../services/giphy-api/giphy-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subscriptionHandler: Subscription;
  gifList = [];
  searchForm: FormGroup;
  constructor(
    private api: GiphyApiService,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) { }


  ngOnInit() {
    this.searchForm = this.buildForm();
  }

  ngOnDestroy() {
    if (this.subscriptionHandler) {
      this.subscriptionHandler.unsubscribe();
    }
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  searchGIF() {
    if (this.searchForm && this.searchForm.valid) {
      const searchKey = this.searchForm.controls && this.searchForm.controls['name'] && this.searchForm.controls['name'].value;
      if (searchKey) {
        this.subscriptionHandler = this.api.searchGIF(searchKey).subscribe(data => {
          this.gifList = data.map(res=>{
            res.gif = res.images && res.images.original && res.images.original.url
            ? res.images.original.url
            : 'https://developers.giphy.com/branch/master/static/header-logo-0fec0225d189bc0eae27dac3e3770582.gif';
            return res;
          });
          let historyList = [];
          const searchesHistory = localStorage.getItem(environment.DB_TABLE);
          if (searchesHistory && searchesHistory.length) {
            historyList = JSON.parse(searchesHistory)
          }
          historyList.push({searchKey, id: (Math.random()).toString()});
          localStorage.setItem(environment.DB_TABLE, JSON.stringify(historyList))
          console.log(this.gifList)
        }, err => {
          console.log(err)
        });
      }
    }
  }

  openGifDetail(seletedGif: any) {
    this.presentModal(seletedGif);
  }

  async presentModal(seletedGif: any) {
    const modal = await this.modalController.create({
      component: DisplayGifComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        seletedGif,
      }
    });
    return await modal.present();
  }
}

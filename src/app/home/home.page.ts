import { SearchGIF } from './../shared/actions/gift.actions';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { DisplayGifComponent } from '../components/display-gif/display-gif.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subscriptionHandler: Subscription;
  gifList = [];
  searchForm: FormGroup;
  private loading: any;
  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private store: Store,
    public loadingController: LoadingController
  ) { }


  ngOnInit() {
    this.searchForm = this.buildForm();
    this.store.select(state => state.gifs.gifs).subscribe((res : any) => {
      if(!!res){
        this.gifList = res;
      }
      this.dismissLoader();
    }, error => {
      this.dismissLoader();
    });
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
        this.presentLoading();
        this.store.dispatch(new SearchGIF(searchKey))
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circular',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  public async dismissLoader(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}

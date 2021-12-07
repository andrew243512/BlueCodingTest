import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GiphyApiService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  public searchGIF(q: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.httpClient.get(`https://${environment.URL_BACKEND}gifs/search`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          params: { api_key: environment.GIPHY_API_KEY, q, offset: '0', limit: '50' }
        }).subscribe((res: any) => {
          console.log(res)
          if (res && res.data) {
            observer.next(res.data);
          } else {
            observer.error('There is not data for that request, please try again.');
          }
        }, error => {
          observer.error(error);
        });
    });
  }
}

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GiphyApiService } from 'src/app/services/giphy-api/giphy-api.service';
import { GetHistoryGIF, RemoveGIF, SearchGIF } from '../actions/gift.actions';
import { map, first, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class GifStateModel {
    gifs: any[];
    history: any[];
}

@State<GifStateModel>({
    name: 'gifs',
    defaults: {
        gifs: [],
        history: []
    }
})
@Injectable()
export class GifState {
    constructor(
        private giftService?: GiphyApiService,
    ) { }


    @Selector()
    static getGif(state: GifStateModel) {
        return state.gifs;
    }

    @Selector()
    static getHistory(state: GifStateModel) {
        return state.history;
    }

    @Action(SearchGIF)
    search({ patchState }: StateContext<GifStateModel>, { payload }: SearchGIF) {
        if (!!payload) {
            return this.giftService.searchGIF(payload).pipe(
                first(),
                map(res => {
                    res.map(data => {
                        data.url = data.images && data.images.original && data.images.original.url
                            ? data.images.original.url
                            : 'https://developers.giphy.com/branch/master/static/header-logo-0fec0225d189bc0eae27dac3e3770582.gif';
                        return data;
                    })

                    let historyList = [];
                    const searchesHistory = localStorage.getItem(environment.DB_TABLE);
                    if (searchesHistory && searchesHistory.length) {
                        historyList = JSON.parse(searchesHistory)
                    }
                    historyList.push({ payload, id: (Math.random()).toString() });
                    localStorage.setItem(environment.DB_TABLE, JSON.stringify(historyList))
                    patchState({ gifs: res })
                }),
            );

        }

    }

    @Action(RemoveGIF)
    remove({ getState, patchState }: StateContext<GifStateModel>, { payload }: RemoveGIF) {
        const history = JSON.parse(localStorage.getItem(environment.DB_TABLE))
        const currentList = history.filter((data: any) => data.id !== payload)
        localStorage.setItem(environment.DB_TABLE, JSON.stringify(currentList))
        patchState({
            history: getState().history.filter(a => a.id != payload)
        })
    }

    @Action(GetHistoryGIF)
    getHistory({patchState }: StateContext<GifStateModel>) {
        const history = JSON.parse(localStorage.getItem(environment.DB_TABLE));
        patchState({
            history: history
        })
    }

}


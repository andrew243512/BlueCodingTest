export class SearchGIF {
    static readonly type = '[GIF] Get All gif by word'

    constructor(public payload: any) {}
}

export class RemoveGIF {
    static readonly type = '[GIF] Remove searches'

    constructor(public payload: string) {}
}

export class GetHistoryGIF {
    static readonly type = '[GIF] Get searches history'
}
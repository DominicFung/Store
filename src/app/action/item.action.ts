import { Action } from '@ngrx/store'
import { StoreData } from '../model/model'

export const RELOAD = 'Reload'

export class ReloadItems implements Action {
    readonly type = RELOAD

    constructor(public payload: StoreData){}
}

export type All
    = ReloadItems
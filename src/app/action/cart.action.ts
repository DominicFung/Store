import { Action } from '@ngrx/store'
import { Cart } from '../model/model'

export const ADD = 'addToCart'
export const REMOVE = 'removeFromCart'

export class addToCart implements Action {
    readonly type = ADD

    constructor(public payload: Cart){}
}

export class removeFromCart implements Action {
    readonly type = REMOVE

    constructor(public payload: Cart){}
}

export type All
    = addToCart | removeFromCart
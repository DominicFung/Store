import { Action } from '@ngrx/store'
import { Administrator } from '../model/model'

export const LOGIN = 'Login'
export const LOGOUT = 'Logout'

export class AdminLogin implements Action {
    readonly type = LOGIN

    constructor(public payload: Administrator){}
}

export class AdminLogout implements Action {
    readonly type = LOGOUT
}

export type All
    = AdminLogin | AdminLogout
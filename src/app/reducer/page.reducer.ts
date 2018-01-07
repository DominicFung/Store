import {ROUTER_NAVIGATION, ROUTER_CANCEL, ROUTER_ERROR,
    RouterNavigationAction, RouterCancelAction, RouterErrorAction} from '@ngrx/router-store'
import { RouterStateSnapshot } from '@angular/router'

export type Action = RouterNavigationAction<RouterStateSnapshot> | RouterCancelAction<RouterStateSnapshot> | RouterErrorAction<RouterStateSnapshot>

// Default state
const defaultState: RouterStateSnapshot = {
    url: null,
    root: null
}

// Helper function for creating new state objects
const newState = (state, newData) => {
    console.log("**newData: "+JSON.stringify(newData))
    return Object.assign({}, state, newData)
}

export function pageReducer(state: RouterStateSnapshot = defaultState, action: Action){
    console.log("*in pageReducter == action.type: "+action.type+", stateURL: "+state.url)

    switch (action.type){

        case ROUTER_NAVIGATION:
        case ROUTER_CANCEL:
        case ROUTER_ERROR:
            return newState(state, {url: action.payload.routerState.url.toString(), root: action.payload.routerState.root.toString()})

        default:
            return state
    }
}
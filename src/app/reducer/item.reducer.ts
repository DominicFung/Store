import * as StoreActions from '../action/item.action'
import { StoreData } from '../model/model'

export type Action = StoreActions.All

// Default state
const defaultState: StoreData = {
    items: []
}

// Helper function for creating new state objects
const newState = (state, newData) => {
    console.log("**newData: "+JSON.stringify(newData))
    return Object.assign({}, state, newData)
}

export function itemReducer(state: StoreData = defaultState, action: Action){
    console.log("*in itemReducer == action.type: "+action.type+", state: "+state.items)

    switch (action.type){

        case StoreActions.RELOAD:
            return newState(state, action.payload)

        default:
            return state
    }
}
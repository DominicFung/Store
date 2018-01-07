import * as CartActions from '../action/cart.action'
import { Cart } from '../model/model'

export type Action = CartActions.All

// Default state
const defaultState: Cart = {
    Cart: []
}

// Helper function for creating new state objects
const newState = (state, newData) => {
    console.log("**newData: "+JSON.stringify(newData))
    return Object.assign({}, state, newData)
}

export function itemReducer(state: Cart = defaultState, action: Action){
    console.log("*in itemReducer == action.type: "+action.type+", state: "+state.Cart)

    // NOT COMPLETE!!!!!  -- how would I even use a reducer here..
    switch (action.type){

        case CartActions.ADD:
            return newState(state, action.payload)

        default:
            return state
    }
}
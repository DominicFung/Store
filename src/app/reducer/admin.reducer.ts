import * as AdminActions from '../action/admin.action'
import { Administrator } from '../model/model'

export type Action = AdminActions.All

// Default state
const defaultState: Administrator = {
    username: null,
    userID: null
}

// Helper function for creating new state objects
const newState = (state, newData) => {
    console.log("**newData: "+JSON.stringify(newData))
    return Object.assign({}, state, newData)
}

export function adminReducer(state: Administrator = defaultState, action: Action){
    console.log("*in adminReducter == action.type: "+action.type+", state: "+state.username+" "+state.userID)
    //console.log("*in adminReducert == action.payload: "+action.payload)

    switch (action.type){

        case AdminActions.LOGIN:
            return newState(state, action.payload)

        case AdminActions.LOGOUT:
            return newState(state, defaultState)

        default:
            return state
    }
}
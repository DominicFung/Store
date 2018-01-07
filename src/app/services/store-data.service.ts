import { Injectable } from "@angular/core"
import { Observable } from "rxjs/Observable"
import { Http } from "@angular/http"
import "rxjs/add/operator/map"

import { Store } from '@ngrx/store'
import * as StoreActions from '../action/item.action'
import { StoreData } from '../model/model'
import { forEach } from "@angular/router/src/utils/collection";
import { Subject } from "rxjs/Subject";

import { baseURL } from "../global"
interface AppState {
    storeData: StoreData 
}  

@Injectable()
export class StoreDataService {

    Cart: Object
    private CartTotal: Subject<number>

    constructor(public http: Http, private store:Store<AppState>) {
        console.log("::StoreDataService connected")

        this.CartTotal = new Subject<number>()
        
        if (!sessionStorage.getItem("Cart")) {
            sessionStorage.setItem("Cart", JSON.stringify({}))
        }
        this.Cart = JSON.parse(sessionStorage.getItem("Cart"))
        this.setCartTotal()
    }

    setCartTotal(){
        let total: number = 0

        for(var item in this.Cart){
            total = total + +item
        }

        this.CartTotal.next(total)
    }

    addToCart(id){
        if(this.Cart[id] === null) this.Cart[id] = 1
        else this.Cart[id] = this.Cart[id]++

        this.setCartTotal()
        sessionStorage.setItem("Cart",JSON.stringify(this.Cart))
    }

    removeFromCart(id){
        if(this.Cart[id] === null) this.Cart[id] = 0
        else if (this.Cart[id] > 0) this.Cart[id] = this.Cart[id]--
        else this.Cart[id] = 0

        this.setCartTotal()
        sessionStorage.setItem("Cart",JSON.stringify(this.Cart))
    }

    getObservableTotal(){
        return this.CartTotal
    }

    getAllItems(){
        return this.http.get(baseURL+"/api/store/allItems")
        .map(res => {
            this.store.dispatch({
                type: StoreActions.RELOAD,
                payload: { items: res.json() }
            })

            console.log("**RELOAD"+JSON.stringify(res.json()))
        })
    }
}

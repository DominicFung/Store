import { Component, OnInit } from '@angular/core'
import { Observable } from "rxjs/Observable"
import { StoreDataService } from "../../services/store-data.service"
import { Store } from "@ngrx/store"

import { StoreData } from "../../model/model"

interface AppState {
  storeData: StoreData
}

@Component({
  selector: 'app-storecart',
  templateUrl: './storecart.component.html',
  styleUrls: ['./storecart.component.css']
})
export class StorecartComponent implements OnInit {

  storeData: Observable<StoreData>
  Cart:Object

  constructor(private storeService: StoreDataService, private store: Store<AppState>) {

    this.storeData = store.select("storeData")
    //this.storeService.getAllItems().subscribe()

    if (!sessionStorage.getItem("Cart")) {
      sessionStorage.setItem("Cart", JSON.stringify({}))
    }
    this.Cart = JSON.parse(sessionStorage.getItem("Cart"))

    sessionStorage.setItem("CartBadge", "")
    $('.StoreBadge').html("")

    if(!$('#min-cart-toggle').hasClass('collapsed'))
      $('#min-cart-toggle').click()

  }

  ngOnInit() {

    $(document).ready(function() {
      
      // relative-main will change according to whats at the top ... for now h1 element is 69
      $(".relative-main").css('min-height', ($(window).height()-444)+'px')
      console.log("win height:"+$(window).height()+" relative-main hight:"+$(".relative-main").height())

      $(window).resize(function(){
        $(".relative-main").css('min-height', ($(window).height()-444)+'px')
        console.log("win height change:"+$(window).height())
      })

    })

  }

  addToCart(id){
      if(!(id in this.Cart) || isNaN(this.Cart[id])) this.Cart[id] = 1
      else this.Cart[id] = parseInt(this.Cart[id]) + 1

      sessionStorage.setItem("Cart",JSON.stringify(this.Cart))
  }

  removeFromCart(id){
      if (parseInt(this.Cart[id]) > 1) this.Cart[id] = parseInt(this.Cart[id]) - 1
      else delete this.Cart[id]

      sessionStorage.setItem("Cart", JSON.stringify(this.Cart))
  }

  deleteFromCart(id){
    delete this.Cart[id]
    sessionStorage.setItem("Cart", JSON.stringify(this.Cart))
  }

  getTotal(items) {
    let total = 0
    let item:any
    //console.log(items);

    for(var i = 0; i < items.length; i++){
      if((items[i]._id in this.Cart) || !isNaN(this.Cart[items[i]._id]) ){
        total = total + (items[i].price * this.Cart[items[i]._id]).valueOf()
        //console.log(this.Cart[items[i]._id]+" "+total)
      }
    }
    return total
  }

  getDateString(){
    var date = new Date()

    var day = date.getDate()
    var month = date.getMonth()
    var year = date.getFullYear()

    var daySufx
    switch(day.toString().split('').pop()) {
      case "1": daySufx="st"; break
      case "2": daySufx="nd"; break
      case "3": daySufx="rd"; break
      default: daySufx="th"; break
    }


    var stringMonth
    switch(month) {
      case 0: stringMonth = "January"; break
      case 1: stringMonth = "February"; break
      case 2: stringMonth = "March"; break
      case 3: stringMonth = "April"; break
      case 4: stringMonth = "May"; break
      case 5: stringMonth = "June"; break
      case 6: stringMonth = "July"; break
      case 7: stringMonth = "August"; break
      case 8: stringMonth = "September"; break
      case 9: stringMonth = "October"; break
      case 10: stringMonth = "November"; break
      case 11: stringMonth = "December"; break
      default: stringMonth = ""; break
    }

    return stringMonth+" "+day+"<sup>"+daySufx+"</sup>, "+year

  }

}

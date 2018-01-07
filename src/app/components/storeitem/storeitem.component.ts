import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms"
import { StoreDataService } from "../../services/store-data.service"

import { Http } from '@angular/http'

import { Administrator } from "../../model/model"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs/Observable"

import { baseURL } from "../../global"

interface AppState {
  admin: Administrator
}


@Component({
  selector: 'app-storeitem',
  templateUrl: './storeitem.component.html',
  styleUrls: ['./storeitem.component.css']
})
export class StoreitemComponent implements OnInit {

  admin: Observable<Administrator>

  rForm: FormGroup

  itemID:string
  itemName:String
  inventory:Number
  price:Number
  description:Text
  coverImg:String

  Cart:Object
  CartBadge:number
  badgeLimit:number

  Likes:object

  constructor(
    private storeService: StoreDataService,
    private route:ActivatedRoute, 
    private http:Http, 
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.itemID = this.route.snapshot.paramMap.get('id')

    this.admin = store.select("admin")

    this.rForm = fb.group({
      product_name: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required,  Validators.min(0)]),
      inventory: new FormControl(null, Validators.min(1))
    })

    var req = this.http.get(baseURL+"/api/store/"+this.itemID).map(res => {
      console.log(res.json())

      this.itemName = res.json().itemName
      this.inventory = res.json().inventory
      this.price = res.json().price
      this.description = res.json().description
      this.coverImg = res.json().coverImg
      
    })
      .subscribe()

    require("jquery")

    if (!sessionStorage.getItem("Cart")) {
      sessionStorage.setItem("Cart", JSON.stringify({}))
    }
    this.Cart = JSON.parse(sessionStorage.getItem("Cart"))

    if (!sessionStorage.getItem("CartBadge")) {
      sessionStorage.setItem("CartBadge", "")
    }
    this.CartBadge = parseInt(sessionStorage.getItem("CartBadge"))
    $('.StoreBadge').html(this.CartBadge)

    this.badgeLimit = 0

    if (!localStorage.getItem("Likes")) {
      localStorage.setItem("Likes", JSON.stringify({}))
    }
    this.Likes = JSON.parse(localStorage.getItem("Likes"))

    if(!$('#min-cart-toggle').hasClass('collapsed'))
      $('#min-cart-toggle').click()
  }

  ngOnInit() {

    $(document).ready(function() {

      // item-info will change according to whats at the top ... for now h1 element is 69
      $(".item-info").css('min-height', ($(window).height()-113)+'px')
      console.log("win height:"+$(window).height()+" item-info hight:"+$(".item-info").height())

      $(window).resize(function(){
        $(".item-info").css('min-height', ($(window).height()-113)+'px')
        console.log("win height change:"+$(window).height())
      })

      // SHOULD only matters for phones
      $('#base-wrapper').css("min-height", ($(".description-style").height()+650)+'px')

    })

  }

  addToCart(){
    if(!(this.itemID in this.Cart) || isNaN(this.Cart[this.itemID])) this.Cart[this.itemID] = 1
    else this.Cart[this.itemID] = parseInt(this.Cart[this.itemID]) + 1
    sessionStorage.setItem("Cart",JSON.stringify(this.Cart))

    console.log(isNaN(this.CartBadge))

    if(isNaN(this.CartBadge)) this.CartBadge = 1
    else this.CartBadge++

    $('.StoreBadge').html(this.CartBadge)
    sessionStorage.setItem("CartBadge", this.CartBadge.toString())

    this.badgeLimit++
    console.log(this.badgeLimit)
  }

  removeFromCart(){
    var lastPass = false
      if (parseInt(this.Cart[this.itemID]) > 1){
        this.Cart[this.itemID] = parseInt(this.Cart[this.itemID]) - 1
      } else if (parseInt(this.Cart[this.itemID]) === 1) {
        delete this.Cart[this.itemID]
        lastPass = true
      } else {
        delete this.Cart[this.itemID]
        console.log("button to be disabled later on .. -- this is ok")
      }

      sessionStorage.setItem("Cart", JSON.stringify(this.Cart))

      if(this.itemID in this.Cart || lastPass){
        var total = this.getTotal()

        if (this.badgeLimit > 0){
          if (this.CartBadge > total) this.CartBadge = total
          else this.CartBadge--

          if (this.CartBadge <= 0){
            $('.StoreBadge').html("")
            sessionStorage.setItem("CartBadge", "")
          } else {
            $('.StoreBadge').html(this.CartBadge)
            sessionStorage.setItem("CartBadge", this.CartBadge.toString())
          }
          
          this.badgeLimit--

        } else if (this.CartBadge > total && total > 0) {
          this.CartBadge = total
          $('.StoreBadge').html(this.CartBadge)
          sessionStorage.setItem("CartBadge", this.CartBadge.toString())
        } else if (!(this.itemID in this.Cart) || total <= 0){
          this.CartBadge = 0
          $('.StoreBadge').html("")
          sessionStorage.setItem("CartBadge", "")
        } else console.log("looks like no badge change is needed!")
      }
      
  }

  getTotal(){
    var total = 0
    for(var item in this.Cart){
      total = total + parseInt(this.Cart[item])
    }
    console.log("total: "+total)
    return total
  }

  deleteFromCart(){
    delete this.Cart[this.itemID]
    sessionStorage.setItem("Cart", JSON.stringify(this.Cart))
  }

  toggleLike(){
    if (this.Likes[this.itemID]) { 
        this.Likes[this.itemID] = false
        console.log("LIKE: "+this.itemID+" false")
    } else {
        this.Likes[this.itemID] = true
        console.log("LIKE: "+this.itemID+" true")
    }

    localStorage.setItem("Likes",JSON.stringify(this.Likes))
  }

  edit() {
    console.log("edit clicked!")

    this.rForm.controls["product_name"].setValue(this.itemName)
    this.rForm.controls["price"].setValue(this.price)

    console.log(this.coverImg)
    
    $("#newItemModal").modal("show")

  }

  submitItem() {
    var toSubmit = {
        itemName: this.rForm.controls["product_name"].value,
        inventory: this.inventory,
        price: this.rForm.controls["price"].value,
        description: this.description,
        coverImg: this.coverImg
    }

    console.log(JSON.stringify(toSubmit))


    var req = this.http
      .put(baseURL+"/api/store/" + this.itemID, toSubmit)
      .subscribe()

    this.itemName = this.rForm.controls["product_name"].value
    this.price = this.rForm.controls["price"].value

    $("#newItemModal").modal("hide")

    //window.location.reload();
  }

}

import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from "@angular/core"
import { Http } from "@angular/http"
import { StoreDataService } from "../../services/store-data.service"

import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms"
import { DropzoneComponent, DropzoneConfigInterface } from "ngx-dropzone-wrapper"

import { Store } from "@ngrx/store"
import { Observable } from "rxjs/Observable"

import { StoreData } from "../../model/model"
import { Administrator } from "../../model/model"

import { baseURL } from "../../global"

interface AppState {
    storeData: StoreData
    admin: Administrator
}

declare var jQuery: any

@Component({
    selector: "app-storedisplay",
    templateUrl: "./storedisplay.component.html",
    styleUrls: ["./storedisplay.component.css"]
})
export class StoredisplayComponent implements OnInit {
    storeData: Observable<StoreData>
    admin: Observable<Administrator>

    rForm: FormGroup

    itemID: String = null
    product_name: String = ""
    description: String = ""
    price: number = 0
    inventory: number = 0
    coverPic: String = null

    Likes: Object
    Cart: Object
    CartBadge:number

    public config: DropzoneConfigInterface = {
        //currently not using
        url: baseURL+"/api/upload",
        acceptedFiles: "image/*",
        maxFiles: 1,
        thumbnailWidth: 1000,
        thumbnailHeight: 1000
    }

    @ViewChild(DropzoneComponent) componentRef: DropzoneComponent
    //@Output() inventoryChange: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        private storeService: StoreDataService,
        private store: Store<AppState>,
        private http: Http,
        private fb: FormBuilder
    ) {
        require('gsap/TweenMax')
        require('gsap/TimelineMax')
        require('gsap/ScrollToPlugin')
        require("jquery")
        
        //https://stackoverflow.com/questions/43104114/cannot-find-name-require-after-upgrading-to-angular4
        require("scrollmagic/scrollmagic/uncompressed/ScrollMagic")
        require("scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap")
        require("scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic")

        this.storeData = store.select("storeData")
        this.admin = store.select("admin")

        this.rForm = fb.group({
            product_name: new FormControl(null, Validators.required),
            price: new FormControl(null, [ Validators.required, Validators.min(0) ]),
            inventory: new FormControl(null, Validators.min(1))
        })

        //this.storeService.getAllItems().subscribe()

        if (!localStorage.getItem("Likes")) {
            localStorage.setItem("Likes", JSON.stringify({}))
        }
        this.Likes = JSON.parse(localStorage.getItem("Likes"))

        if (!sessionStorage.getItem("Cart")) {
          sessionStorage.setItem("Cart", JSON.stringify({}))
        }
        this.Cart = JSON.parse(sessionStorage.getItem("Cart"))
        this.setCartTotal()

        if (!sessionStorage.getItem("CartBadge")) {
            sessionStorage.setItem("CartBadge", "")
        }
        this.CartBadge = parseInt(sessionStorage.getItem("CartBadge"))
        $('.StoreBadge').html(this.CartBadge)

        if(!$('#min-cart-toggle').hasClass('collapsed'))
            $('#min-cart-toggle').click()
        
    }

    ngOnInit() {
        $(document).ready(function() {
            $("#nav-full").addClass("nav-visible") //used when swapping between pages

            if(!sessionStorage.getItem("Administrator")){
                console.log("GUEST:: setting tween")
                $('.store-panel').each(function(){ 
                    var store_panel = TweenMax.from($(this), 0.4, {autoAlpha: 0, y: '+=50', delay: Math.random()*0.08})
                    var controller = new ScrollMagic.Controller()
                    
                    var scene = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: 0.8
                    }).setTween(store_panel).addTo(controller)
                })
            }

        })
    }

    delete(itemID) {
        console.log("deteling item ID: " + itemID)

        $("#"+itemID).find(".adm-btn").prop("disabled", true)

        var res = this.http
            .delete(baseURL+"/api/store/" + itemID)
            .map(res => {
                console.log("delayed response: "+res.json())
                this.storeService.getAllItems().subscribe()
            })
            .subscribe()
    }

    addInventory() {
        this.inventory++
        //this.inventoryChange.emit(this.inventory)
    }

    removeInventory() {
        if (this.inventory >= 1) {
            this.inventory--
        } else if (this.inventory > 0) {
            this.inventory = 0
        }
        //this.inventoryChange.emit(this.inventory)
    }

    // not in use, for reference later
    setCartTotal(){
      var total = 0
      for(var item in this.Cart){
        total = total + parseInt(this.Cart[item])
      }
      console.log("total: "+total)
      //$('.StoreBadge').html(total)
    }

    addToCart(id){
        if(!(id in this.Cart) || isNaN(this.Cart[id])) this.Cart[id] = 1
        else this.Cart[id] = parseInt(this.Cart[id]) + 1

        if(this.CartBadge === null || isNaN(this.CartBadge)) this.CartBadge = 1
        else this.CartBadge++
        $('.StoreBadge').html(this.CartBadge)
        sessionStorage.setItem("CartBadge", this.CartBadge.toString())

        console.log("Cart at "+id+": "+this.Cart[id])

        this.setCartTotal()
        sessionStorage.setItem("Cart",JSON.stringify(this.Cart))
    }

    // not used in storedisplay, may be used in storeCart
    removeFromCart(id){
        if(!(id in this.Cart) || isNaN(this.Cart[id])) this.Cart[id] = 0
        else if (this.Cart[id] > 0) this.Cart[id] = this.Cart[id]--
        else this.Cart[id] = 0

        if(this.CartBadge > 0){
            this.CartBadge--
            $('.StoreBadge').html(this.CartBadge)
            sessionStorage.setItem("CartBadge", this.CartBadge.toString())
        } 


        this.setCartTotal()
        sessionStorage.setItem("Cart",JSON.stringify(this.Cart))
    }

    toggleLike(id){
        if (this.Likes[id]) { 
            this.Likes[id] = false
            console.log("LIKE: "+id+" false")
        } else {
            this.Likes[id] = true
            console.log("LIKE: "+id+" true")
        }

        localStorage.setItem("Likes",JSON.stringify(this.Likes))
    }

    reset(delImg) {
        this.rForm.reset()
        if (this.componentRef) this.componentRef.directiveRef.reset()

        if (delImg) {
            var req = this.http
                .delete(baseURL+"/api/upload/" + this.coverPic)
                .subscribe()
        }

        this.itemID = null
        this.inventory = 0
        this.description = ""
        this.coverPic = null

    }

    submitItem() {

        $('.add-update-btn').prop("disabled", true)

        var toSubmit = {
            itemName: this.rForm.controls["product_name"].value,
            inventory: this.inventory,
            price: this.rForm.controls["price"].value,
            description: this.description,
            coverImg: this.coverPic
        }

        console.log(JSON.stringify(toSubmit))

        if (!this.itemID) {
            var req = this.http
                .post(baseURL+"/api/store/newItem", toSubmit)
                .subscribe()
        } else {
            var req = this.http
                .put(baseURL+"/api/store/" + this.itemID, toSubmit)
                .subscribe()
        }

        this.storeService.getAllItems().subscribe()
        jQuery("#newItemModal").modal("hide")

        this.reset(false)

        //window.location.reload();
        $('.add-update-btn').prop("disabled", false)
    }

    edit(itemID, itemName, price, inventory, description, picture) {
        this.itemID = itemID
        this.rForm.controls["product_name"].setValue(itemName)
        this.inventory = inventory
        this.rForm.controls["price"].setValue(price)
        this.description = description
        this.coverPic = picture

        console.log(this.coverPic)

        jQuery("#newItemModal").modal("show")
    }

    onUploadError(args: any) {
        console.log("onUploadError:", args)
    }

    onUploadSuccess(args: any) {
        //args[1] = returned object
        if (args[1].filename && !this.coverPic) {
            this.coverPic = args[1].filename
            console.log("uploaded: " + this.coverPic)
        } else if (args[1].filename && this.coverPic) {
            var req = this.http
                .delete(baseURL+"/api/upload/" + this.coverPic)
                .subscribe()
            console.log(
                "** '" +
                    this.coverPic +
                    "' must first be deleted, then upload " +
                    args[1].filename
            )
            this.coverPic = args[1].filename
        } else if (args[1].error) {
            console.log(args[1].error)
        } else {
            console.log("ERROR onUploadSuccess:", args)
        }
    }

    mouseEnter(itemID){
        $("#"+itemID).find(".store-img").addClass("img-hover")
        $("#"+itemID).find(".btn").addClass("btn-visible")

    }

    mouseLeave(itemID){
        $("#"+itemID).find(".store-img").removeClass("img-hover")
        $("#"+itemID).find(".btn").removeClass("btn-visible")
    }
}

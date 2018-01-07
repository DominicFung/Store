import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from "@angular/http"

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { RouterStateSnapshot } from '@angular/router'

import * as AdminActions from './action/admin.action'
import { Administrator} from './model/model'
import { StoreData } from "./model/model"

import { StoreDataService } from "./services/store-data.service"
import { baseURL } from "./global"

interface AppState {
  admin: Administrator
  page: RouterStateSnapshot
  storeData: StoreData
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  admin: Observable<Administrator>
  page: Observable<RouterStateSnapshot>
  storeData: Observable<StoreData>

  constructor(private store:Store<AppState>, private http:Http, private router:Router, private storeService: StoreDataService){
    this.router = router

    this.admin = store.select('admin')
    this.page = store.select('page')
    this.storeData = store.select("storeData")
    //console.log(JSON.stringify(this.admin))

    this.storeService.getAllItems().subscribe()

    this.checkLogon()

    require("jquery")

  }

  ngOnInit(){

    $(document).ready(function() {

      $('.search-bar-focus').focus(function(){
        $('.dropdown-content').addClass("show-dropdown-content")
        if($('.search-bar-focus').is(":focus")) {
          console.log("still in focused on ..")
        } else {
          console.log("not in focus ..")
        }
      })

      $('*').not('.search-bar-focus').click(function(){
        if(!($('.search-bar-focus').is(":focus")))
          $('.dropdown-content').removeClass("show-dropdown-content")
      })

      $('search-item').mouseover(function(){
        $('search-item').addClass('search-item-grey')
      })

      // $('.search-bar-focus').blur(function(){
      //   if($('.search-bar-focus').is(":focus")) {
      //     console.log("still in focused on ..")
      //   } else {
      //     console.log("not in focus ..")
      //   }
      //     //$('.dropdown-content').removeClass("show-dropdown-content")
      // })
      
    })

  }

  checkLogon(){
    var req = this.http.get(baseURL+"/api/authentication/")
    .map(res => {
      if(res.json().userId && res.json().username){
        
        console.log(res.json().username + " cheked in through cookie. ID: " + res.json().userId)
        sessionStorage.setItem("Administrator",res.json().userId)

        this.store.dispatch({
          type: 'Login', 
          payload: {
            username: res.json().username,
            userID: res.json().userId
          }
        })

        console.log("end cred check")
      } else {
        console.log("could not login")
      }
    }).subscribe()
  }

  signout(){
    console.log("sign out clicked!!")

    var req = this.http.delete(baseURL+"/api/authentication/").subscribe()
    sessionStorage.removeItem("Administrator")

    this.store.dispatch({
      type: AdminActions.LOGOUT
    })

    //Guest get special animations that messes with admin logic: refresh will reregister the animation logic
    window.location.reload();
  }

  clickShopping(){
    this.router.navigateByUrl('/store')
  }
}
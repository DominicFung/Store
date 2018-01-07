import { Component, OnInit } from '@angular/core'
import { Http } from "@angular/http"
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import * as AdminActions from '../../action/admin.action'

import { baseURL } from "../../global"

interface AppState {
  message: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  rForm:FormGroup
  username:string = ''
  password:string = ''
  err:string = ''

  inAnnimation:boolean = false

  constructor(private fb: FormBuilder, private http:Http, private router:Router, private store:Store<AppState>) {

    this.router = router

    this.rForm = fb.group({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, Validators.minLength(3)])
    })

    require('gsap/TweenMax')
    require('gsap/TimelineMax')
    require('gsap/ScrollToPlugin')
    require("jquery")

    if (!sessionStorage.getItem("CartBadge")) {
        sessionStorage.setItem("CartBadge", "")
    }
    $('.StoreBadge').html(parseInt(sessionStorage.getItem("CartBadge")))

   }

  ngOnInit() {

    $(document).ready(function(){
      
      $('#nav-full').addClass("nav-visible")

      $(".top-pad").css('min-height', ($(window).height()-194)+'px')
      console.log("win height:"+$(window).height()+" top-pad hight:"+$(".top-pad").height())

      $(window).resize(function(){
        $(".top-pad").css('min-height', ($(window).height()-194)+'px')
        console.log("win height change:"+$(window).height())
      })

    })

  }

  adminLogin(user){
    var req = this.http.post(baseURL+"/api/authentication", {'username': user.username , 'password': user.password})
    .map(res => {
      if(res.json().authError) {
        console.log(res.json().authError)

        if(!sessionStorage.getItem("inAnnimation")){

          sessionStorage.setItem("inAnnimation", "true")

          setTimeout(function(){
            console.log("timeout complete!")
            sessionStorage.removeItem("inAnnimation")
          }, 380);

          TweenMax.to($("#login-title"), 0.05, {color: '#a83e6f', ease: 'Linear.easeNone'})

          TweenMax.to($("#btn-login"), 0.05, {backgroundColor: '#a83e6f', x: '+=10', ease: 'Power1.easeOut'})
          TweenMax.to($("#btn-login"), 0.1, {x: '-=20', ease: 'Power1.easeOut', delay: 0.05})
          TweenMax.to($("#btn-login"), 0.1, {x: '+=20', ease: 'Power1.easeOut', delay: 0.15})
          TweenMax.to($("#btn-login"), 0.1, {x: '-=20', ease: 'Power1.easeOut', delay: 0.25})
          TweenMax.to($("#btn-login"), 0.1, {x: '+=10', ease: 'Elastic.easeOut.config(1, 0.3)', delay: 0.35})
          TweenMax.to($("#btn-login"), 0.3, {backgroundColor: '#6d5272', ease: 'Power1.easeOut', delay: 0.4})
          
          TweenMax.to($("#login-title"), 0.05, {color: '#6d5272', ease: 'Power1.easeOut', delay: 0.4})

        } else {
          console.log("already in Annimation!")
        }

        //$("#btn-login").css("background-color", "red");

      } else if(res.json().userId && res.json().username){

        console.log(res.json().username + " has logged in! ID: " + res.json().userId)
        sessionStorage.setItem("Administrator",res.json().userId)

        this.store.dispatch({
          type: AdminActions.LOGIN,
          payload: {
            username: res.json().username,
            userID: res.json().userId
          }
        })
        this.router.navigateByUrl('/store')

        console.log("store auth sent!")
      } else {
        console.log(res.json())
      }
    }).subscribe()
  }

  showPassword() {
    var key_attr = $('#key').attr('type');
    
    if(key_attr != 'text') {
        $('.checkbox').addClass('show');
        $('#key').attr('type', 'text');
    } else {
        $('.checkbox').removeClass('show');
        $('#key').attr('type', 'password');
    }  
  }
}



//https://www.youtube.com/watch?v=bo1Wu0aiigU&t=214s
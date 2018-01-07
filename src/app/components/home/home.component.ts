import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

//import * as $ from 'jquery/dist/jquery.min.js'

//https://github.com/janpaepke/ScrollMagic/issues/700
//edit: node_modules/@angular/cli/models/webpack-conf/common.js

//import { TweenMax, Linear } from 'gsap/TweenMax'

//https://d2zy73x1fg2nl6.cloudfront.net/images/hp/AltaFall-desktopx1920-final.jpg
//https://d2zy73x1fg2nl6.cloudfront.net/images/hp/Alta Fall– 920x854_web-final.mp4
//https://d2zy73x1fg2nl6.cloudfront.net/images/hp/Alta Fall– 920x854_web-final.webm

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("test") test: ElementRef;
  constructor(private router:Router) {

    this.router = router

    require('gsap/TweenMax')
    require('gsap/TimelineMax')
    require('gsap/ScrollToPlugin')
    require("jquery")
    
    //https://stackoverflow.com/questions/43104114/cannot-find-name-require-after-upgrading-to-angular4
    require("scrollmagic/scrollmagic/uncompressed/ScrollMagic")
    require("scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap")
    require("scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic")
    //require("scrollmagic/scrollmagic/uncompressed/plugins/animation.velocity")

    if (!sessionStorage.getItem("CartBadge")) {
        sessionStorage.setItem("CartBadge", "")
    }
    $('.StoreBadge').html(parseInt(sessionStorage.getItem("CartBadge")))

    if(!$('#min-cart-toggle').hasClass('collapsed'))
      $('#min-cart-toggle').click()

   }

  ngOnInit() {

    $(document).ready(function(){

      $('#nav-full').removeClass("nav-visible")

      var navController = new ScrollMagic.Controller()
      var navScene = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.1
      }).setClassToggle('#nav-full','nav-visible').addTo(navController)
  
      navScene.on('enter',function(event){
        console.log(JSON.stringify(event));
      })

      function blink() { 
        setTimeout(function(){
          $('.blink_me').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500)
          blink()
        }, 3000) //only 1000ms of pause; 2000ms spent blinking
      }

      blink()

      $('.blink_me').click(function() {
        $('html,body').animate({
            scrollTop: $(".break-line").offset().top},
            500);
      });

      //firefox::
      $('.scroll-down').click(function() {
        $('html,body').animate({
            scrollTop: $(".break-line").offset().top},
            500);
      });

      $('.about-btn').click(function() {
        $('html,body').animate({
            scrollTop: $(document).height()-950},
            600);
      });

      // TIMELINEMAX does NOT work
      //var start_Timeline = new gsap.TimelineMax().add(TweenMax.from($('.hashtag-for-the-kids'), 0.3, {opacity: 0}))
      //start_Timeline.add(TweenMax.from($('.first-prop'), 0.4, {opacity: 0, x: '+=400'}, 0.2))
      
      var start_hash_tween = TweenMax.from($('.hashtag-for-the-kids'), 1, {opacity: 0})
      var start_prop1_tween = TweenMax.from($('.first-prop'), 0.8, {opacity: 0, x: '+=400', delay: 0.5})
      var start_prop2_tween = TweenMax.from($('.second-prop'), 1.3, {opacity:0, delay: 2})

      var starterController = new ScrollMagic.Controller()
      var starterScene1 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.5
      }).setTween(start_hash_tween).addTo(starterController)

      var starterScene2 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.5
      }).setTween(start_prop1_tween).addTo(starterController)

      var starterScene3 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.5
      }).setTween(start_prop2_tween).addTo(starterController)

      

      var tiger_tween = TweenMax.from($('.info-panel-left'), 0.8, {autoAlpha: 0, y: '+=50'})
      var bunny_tween = TweenMax.from($('.info-panel-center'), 0.8, {autoAlpha: 0, y: '+=50', delay: 0.2})
      var dog_tween = TweenMax.from($('.info-panel-right'), 0.8, {autoAlpha: 0, y: '+=50', delay: 0.4})

      var infoPanelController = new ScrollMagic.Controller()
      var infoPanelScene1 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.1
      }).setTween(tiger_tween).addTo(infoPanelController)

      var infoPanelScene2 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.1
      }).setTween(bunny_tween).addTo(infoPanelController)

      var infoPanelScene3 = new ScrollMagic.Scene({
        triggerElement: '#trigger-invis',
        triggerHook: 0.1
      }).setTween(dog_tween).addTo(infoPanelController)

    })
  }

  demoButton(){
    this.router.navigateByUrl('/store')
  }
}

import { Component, OnInit } from '@angular/core';

declare const FB: any;

@Component({
  selector: 'app-fb-live-manager',
  templateUrl: './fb-live-manager.component.html'
})
export class FbLiveManagerComponent implements OnInit {

  constructor() {
    FB.init({
      appId: '135402210522026',
      version: 'v2.10',
      xfbml: true,
      cookie: false
    });
   }

  ngOnInit() {
    this.fbLoginCheck();
    this.fbLiveCreate();
  }

  fbLoginCheck(){
    console.log('function called');
    FB.getLoginStatus(function(response){
      if(response.status === 'connected'){
        localStorage.setItem("fb_access_token", response.authResponse.accessToken);
        localStorage.setItem("fb_user_id", response.authResponse.userID);
      } else {
        console.log('else reached')
        FB.login(function(loginResponse){
          console.log(loginResponse);
          localStorage.setItem("fb_access_token", loginResponse.authResponse.accessToken);
          localStorage.setItem("fb_user_id", loginResponse.authResponse.userID);
        });
      }
    });
  }

  fbLiveCreate(){
    FB.ui({
      display: 'popup',
      method: 'live_broadcast',
      phase: 'create'
    }, function(response){
      console.log(response);
      if(!response.id){
        alert('diaglog failed');
        return;
      }
      alert('stream url: ' + response.secure_stream_url);
      FB.ui({
        display: 'popup',
        method: 'live_broadcast',
        phase: 'publish',
        broadcast_data: response
      }, function(response){
        console.log(response);
        alert('video status: '+ response.status);
      });
    })
  }

}

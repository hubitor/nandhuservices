import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

declare const FB: any;

@Component({
  selector: 'app-fb-live-manager',
  templateUrl: './fb-live-manager.component.html'
})
export class FbLiveManagerComponent implements OnInit {
  accessToken: string;
  fbLiveForm;

  constructor(private formBuilder: FormBuilder) {
    this.accessToken = "";
    FB.init({
      appId: '135402210522026',
      version: 'v2.10',
      xfbml: true,
      cookie: false
    });
   }

  ngOnInit() {
    //this.fbLoginCheck();
    //this.fbLiveCreate();
    this.initForm();
  }

  initForm(){
    this.fbLiveForm = this.formBuilder.group({

    });
  }

  fbLoginCheck(){
    console.log('function called');
    FB.getLoginStatus(function(response){
      console.log(response);
      if(response.status === 'connected'){
        localStorage.setItem("fb_access_token", response.authResponse.accessToken);
        localStorage.setItem("fb_user_id", response.authResponse.userID);
        //this.accessToken = response.authResponse.accessToken;
        //console.log("access token: " + this.accessToken);
        FB.api('/me/accounts', function(accResponse){
          console.log(accResponse);
        });
      } else {
        console.log('else reached')
        FB.login(function(loginResponse){
          console.log(loginResponse);
          localStorage.setItem("fb_access_token", loginResponse.authResponse.accessToken);
          localStorage.setItem("fb_user_id", loginResponse.authResponse.userID);
          //this.accessToken = loginResponse.authResponse.accessToken;
          //console.log("access token: " + this.accessToken);
          FB.api('/me/accounts', function(accResponse){
            console.log(accResponse);
          });
        }, {scope: 'email,manage_pages,publish_pages'});
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
        alert('FB Live failed');
        return;
      }
      //alert('stream url: ' + response.secure_stream_url);
      FB.ui({
        display: 'popup',
        method: 'live_broadcast',
        phase: 'publish',
        broadcast_data: response
      }, function(response){
        console.log(response);
        //alert('video status: '+ response.status);
      });
    })
  }

}

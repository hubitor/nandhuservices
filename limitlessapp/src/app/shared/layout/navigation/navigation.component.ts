import { Component, OnInit } from '@angular/core';
import { LoginInfoComponent } from "../../user/login-info/login-info.component";
import { LoginResponse } from "../../models/loginResponse";

@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  loginResponse: LoginResponse;
  eCommerce: boolean;
  broadcaster: boolean;
  constructor() {
    this.loginResponse = new LoginResponse();
    this.eCommerce = false;
    this.broadcaster = false;
  }

  ngOnInit() {
    var userString = localStorage.getItem("haappyapp-user");
    if (userString != null) {
      this.loginResponse = JSON.parse(userString);
      if (this.loginResponse.user_type === 'eCommerce') {
        this.eCommerce = true;
        this.broadcaster = false;
      } else if (this.loginResponse.user_type === 'Entertainment') {
        this.broadcaster = true;
        this.eCommerce = false;
      }
    }
  }

}

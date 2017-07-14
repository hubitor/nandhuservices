import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthServiceService } from '../../shared/server/service/auth-service.service';
import { LoginRequest } from '../../shared/models/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthServiceService]
})
export class LoginComponent implements OnInit {
  userLoginForm;
  loginRequest:LoginRequest;
  constructor(private router: Router, private authService: AuthServiceService) { 
    this.loginRequest = new LoginRequest();
  }

  ngOnInit() {
    localStorage.clear();
    this.userLoginForm = new FormGroup({
      userEmail: new FormControl(""),
      userPasswd: new FormControl("")
    });
  }

  login(){
    const userLogin = this.userLoginForm.value;
    this.loginRequest.email_id = userLogin.userEmail;
    this.loginRequest.passwd = userLogin.userPasswd;
    console.log(this.loginRequest);
    this.authService.userLogin(this.loginRequest).subscribe(
      loginResponse => {
        console.log(loginResponse);
        localStorage.setItem("user", JSON.stringify(loginResponse).toString());
        this.router.navigate(['/']);
      },
      error => console.log(error)
    );
  }

}

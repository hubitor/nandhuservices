import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthServiceService } from '../../shared/server/service/auth-service.service';
import { LoginRequest } from '../../shared/models/loginRequest';
import { LoginResponse } from '../../shared/models/loginResponse';
import { UserRolesModel } from '../../shared/models/userRolesModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthServiceService]
})
export class LoginComponent implements OnInit {
  userLoginForm;
  loginRequest:LoginRequest;
  loginResponse:LoginResponse;
  userModels:UserRolesModel[];
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
    //console.log(this.loginRequest);
    this.authService.userLogin(this.loginRequest).subscribe(
      loginResponse => {
        //console.log(loginResponse);
        this.loginResponse = loginResponse;
        localStorage.setItem("haappyapp-user", JSON.stringify(loginResponse).toString());
        this.getUserRoles(this.loginResponse.user_id);
      },
      error => console.log(error)
    );
  }

  getUserRoles(userId:number){
    this.authService.getUserRoles(userId).subscribe(
      rolesResponse => {
        //console.log(rolesResponse);
        this.userModels = rolesResponse;
        localStorage.setItem("haappyapp-roles-length", this.userModels.length.toString());
        for(var i=0; i<this.userModels.length; i++){
          localStorage.setItem("haappyapp-role-"+i, JSON.stringify(this.userModels[i]));
        }
        this.router.navigate(['/']);
      },
      error => {
        alert("something went wrong...");
        console.log(error);
      }
    );
  }

}

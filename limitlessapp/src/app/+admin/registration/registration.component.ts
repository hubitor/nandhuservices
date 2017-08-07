import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { User } from '../../shared/models/userModel';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  providers: [ApplicationService]
})
export class RegistrationComponent implements OnInit {
  newClientForm;
  userTypes=['eCommerce', 'Entertainment'];
  application: Application;
  applications: Application[];
  applicationId: number;
  userType: string;
  user: User;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService) { 
    this.application = new Application();
    this.user = new User();
  }

  ngOnInit() {
    this.getApplicationsList();
    this.initForm();
  }

  initForm(){
    this.newClientForm = this.fb.group({
      userName: [null, [Validators.required]],
      userShortName: [null, [Validators.required]],
      userCity: [null, [Validators.required]],
      userZip: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]]
    });
  }

  getApplicationsList(){
    this.applicationService.getApplicationList().subscribe(
      applications => {
        this.applications = applications;
      },
      error => {
        alert("something went wrong. Try after sometime.");
      }
    );
  }

  onApplicationSelect(applicationId: number){
    this.applicationId = applicationId;
  }

  onUserTypeSelect(userType: string){
    this.userType = userType;
  }

  registerUser(){
    const newUser = this.newClientForm.value;
    this.user.application_id = this.applicationId;
    this.user.user_type = this.userType;
    this.user.user_name = newUser.userName;
    this.user.user_short_name = newUser.userShortName;
    this.user.country = "India";
    this.user.city = newUser.userCity;
    this.user.zip = newUser.userZip;
    this.user.country_iso_code = "91";
    this.user.device_mac = "NIL";
    this.user.mobile = newUser.userMobile;
    this.user.email_id = newUser.userEmail;
    this.user.passwd = newUser.userMobile;
    this.user.is_anonymous = false;
    this.user.is_active = true;
    this.user.created_by = "SA";
    this.user.last_updated_by = "SA";
    this.applicationService.newUserRegisteration(this.user).subscribe(
      createResponse => {
        alert("user registered successfully...");
      },
      error => {
        alert("Something went wrong!");
      }
    );
  }

}

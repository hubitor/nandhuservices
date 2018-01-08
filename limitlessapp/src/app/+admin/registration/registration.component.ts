import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { User } from '../../shared/models/userModel';
import { ShopService } from '../../shared/server/service/shop.service';
import { Shop } from '../../shared/models/shop';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { ApplicationUsersRole } from '../../shared/models/applicationUsersRole';
import { UtilityService } from '../../shared/server/service/utility-service';
import { Country } from '../../shared/models/country';
import { State } from '../../shared/models/state';
import { City } from '../../shared/models/city';
import sha256 from 'crypto-js/sha256';
// import { PasswordValidation } from './password-validation';
import { NotificationService } from "../../shared/utils/notification.service";
import { BroadcasterChannel } from 'app/shared/models/broadcaster-channel';
import { ApplicationUsers } from "../../shared/models/application_users";

var countryId;
var stateId;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  providers: [ApplicationService, ShopService, BroadcasterService, UtilityService]
})
export class RegistrationComponent implements OnInit {
  shop_id: number;
  clientName: any;
  zipcode: string;
  state: string;
  mobileNo: string;
  broadcasterName: string;
  emailId: string;
  user_name: string;
  user_type: string;
  userId: number;
  status:boolean;
  broadcasterchannelall: BroadcasterChannel;
  users: ApplicationUsers;
  errorMessage: string;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  stateId: number;
  countries: Country[];
  newClientForm;
  userTypes = ['eCommerce', 'Entertainment', 'eUser','User'];
  application: Application;
  applications: Application[];
  applicationId: number;
  userType: string;
  user: User;
  shops: Shop[];
  applicationUsersRoles: ApplicationUsersRole[];
  roleId: number;
  shopId: number;
  broadcasters: Broadcasters[];
  broadcasterId: number;
  activateShopSelector: boolean;
  activateBroadcasterSelector: boolean;
  states: State[];
  cities: City[];
  isVisible: boolean;
  createButton: boolean;
  updateButton: boolean;

  cancelRegister() {
    this.isVisible =false;
  }

  hideCreateRegister(){
    this.isVisible=true;
    this.createButton=true;
    this.updateButton=false;
  }
  hideUpdateRegister(){
    this.isVisible=true;
    this.createButton=false;
    this.updateButton=true;
  }

  constructor(private fb: FormBuilder, private applicationService: ApplicationService,
    private utilityService: UtilityService, private notificationService: NotificationService,
    private shopService: ShopService, private broadcasterService: BroadcasterService) {
    this.application = new Application();
    this.user = new User();
    this.activateShopSelector = false;
    this.activateBroadcasterSelector = false;

  }

  ngOnInit() {
    this.getUsersAllGrid();
    this.getApplicationsList();
    this.getAllRoles();
    this.getCountry();
    this.getState(countryId);
    this.getCity(stateId);
    this.initForm();
  }



  initForm() {
    this.newClientForm = this.fb.group({
      userName: [null, [Validators.required]],
      // userClientName: [null, [Validators.required]],
      userShortName: [null, [Validators.required]],
      userZip: [null, [Validators.required]],
      userCity: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      user_Name: [null, [Validators.required]],
      userPasswd: [null, [Validators.required]],
      userApplication:[null,[Validators.required]],
      user_type:[null, [Validators.required]],
      country_id:[null, [Validators.required]],
      state_id:[null, [Validators.required]],
      status: [null, [Validators.required]],
      role_id:[null, [Validators.required]],
      shop_id:[null, [Validators.required]],
      broadcaster_id:[null, [Validators.required]],
    },
    );
  }


  getUsersAllGrid() {
    this.applicationService.getAllApplicationUsers()
      .subscribe(
      (userResponse) => {

        this.users = userResponse;

      }),
      error => this.errorMessage = <any>error;
  };

  getApplicationsList() {
    this.applicationService.getApplicationList().subscribe(
      applications => {
        this.applications = applications;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllRoles() {
    this.applicationService.getAllRoles().subscribe(
      applicationUsersRole => {
        this.applicationUsersRoles = applicationUsersRole;
      },
      error => {
        console.log(error);
      }
    );
  }

  getCountry() {
    this.utilityService.getCountry().subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        console.log(error);
      }
    );
  }

  getState(countryId: number) {
    this.utilityService.getState(countryId).subscribe(
      states => {
        this.states = states;
      },
      error => {
        console.log('error' + error);
      }
    );
  }

  getCity(stateId: number) {
    this.utilityService.getCity(stateId).subscribe(
      Cities => {
        this.cities = Cities;
      },
      error => {
        console.log('error' + error);
      }
    );
  }
  onApplicationSelect(application: String) {
    var selectedString = application.split(',');
    this.applicationId = parseInt(selectedString[0]);
    if (selectedString[1] === 'eCommerce') {
      this.activateShopSelector = true;
      this.activateBroadcasterSelector = false;
      this.shopService.getAllShops().subscribe(
        shops => {
          this.shops = shops;
        },
        error => {
          console.log(error);
        }
      );
    } else if (selectedString[1] === 'Entertainment') {
      this.activateBroadcasterSelector = true;
      this.activateShopSelector = false;
      this.broadcasterService.getAllBroadcasters().subscribe(
        broadcasters => {
          this.broadcasters = broadcasters;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onShopSelect(shopId: number) {
    this.shopId = shopId;
  }

  onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
  }

  onUserTypeSelect(userType: string) {
    this.userType = userType;
  }

  onUserRoleSelect(roleId: number) {
    this.roleId = roleId;
  }

  onCountrySelect(countryId: number) {
    this.countryId = countryId;
    this.getState(countryId);
  }

  onStateSelect(stateId: number) {
    this.stateId = stateId;
    this.getCity(stateId);


  }

  onCitySelect(cityId: number) {
    this.cityId = cityId;
  }

  getAddClientRecord(client_emit_data: any) {
    let dataObj = JSON.parse(client_emit_data);
    localStorage.removeItem('client_emit_data');
    this.newClientForm = this.fb.group({
      userApplication: [dataObj.application_id],
      user_type: [dataObj.user_type],
      user_Name: [dataObj.user_name],
      userEmail: [dataObj.email_id],
      userPasswd:[dataObj.passwd],
      userShortName: [dataObj.user_short_name],
      userMobile:[dataObj.mobile],
      country_id:[dataObj.country],
      // userClientName:[dataObj.clientName],
      userCity:[dataObj.city],
      state_id:[dataObj.state],
      userZip:[dataObj.zip],
      status: [dataObj.is_active],
      role_id:[dataObj.role_id],
      shop_id:[dataObj.client_id],
      id:[dataObj.id],
      broadcaster_id:[dataObj.client_id],
    });
  }

  updateUser(){
    this.createButton=false;
    this.updateButton=true;
    const newUser = this.newClientForm.value;
    this.user.id=newUser.id;
    this.user.mobile = newUser.userMobile;
    this.user.email_id = newUser.userEmail;
    this.user.passwd = sha256(newUser.userPasswd).toString();
    this.user.last_updated_by = "SA";
    this.notificationService.smartMessageBox(
      {
        title: "Update Client details",
        content: "Do you want to update the client details..?<i  style='color:green'></i>",
        buttons: '[No][Yes]'
      }, (ButtonPressed) => {
        if (ButtonPressed == "Yes") {
          this.applicationService.updateUserRegisteration(this.user).subscribe(
            createResponse => {
              location.reload();
              console.log('Response' + createResponse);
            },
            error => {
              this.notificationService.smartMessageBox({
                title: "User Not Found",
                content: "NO user found for this details",
                buttons: '[Ok]'
              }, (ButtonPressed) => {
              }
              );
            }
          );
        }
        else if (ButtonPressed == "No") {

        }
      });
  }



  registerUser() {
    this.createButton=true;
    this.updateButton=false;
    const newUser = this.newClientForm.value;
    this.user.application_id = this.applicationId;
    if (this.activateShopSelector) {
      this.user.client_id = this.shopId;
    } else if (this.activateBroadcasterSelector) {
      this.user.client_id = this.broadcasterId;
    }
    this.user.user_type = this.userType;
    this.user.user_name = newUser.user_Name;
    this.user.user_short_name = newUser.userShortName;
    this.user.country = "India";
    this.user.city = newUser.userCity;
    this.user.zip = newUser.userZip;
    this.user.country_iso_code = "91";
    this.user.device_mac = "NIL";
    this.user.mobile = newUser.userMobile;
    this.user.email_id = newUser.userEmail;
    this.user.passwd = sha256(newUser.userPasswd).toString();
    this.user.is_anonymous = false;
    this.user.is_active = true;
    this.user.created_by = "SA";
    this.user.last_updated_by = "SA";
    this.user.roleId = this.roleId;
    this.notificationService.smartMessageBox(
      {
        title: "New client added",
        content: "Do you want to register the client details..?<i  style='color:green'></i>",
        buttons: '[No][Yes]'
      }, (ButtonPressed) => {
        if (ButtonPressed == "Yes") {
          this.applicationService.newUserRegisteration(this.user).subscribe(
            createResponse => {
              location.reload();
              console.log('Response' + createResponse);
            },
            error => {
              this.notificationService.smartMessageBox({
                title: "Already Exists",
                content: "Mail id or Mobile number already exists ",
                buttons: '[Ok]'
              }, (ButtonPressed) => {
              }
              );
            }
          );
        }
        else if (ButtonPressed == "No") {

        }
      });

  }

}

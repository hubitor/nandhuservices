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
import { UtilityService }from'../../shared/server/service/utility-service';
import { Country }from '../../shared/models/country';
import { State }from '../../shared/models/state';
import { City }from '../../shared/models/city';
import sha256 from 'crypto-js/sha256';
// import { PasswordValidation } from './password-validation';
import { NotificationService } from "../../shared/utils/notification.service";
import { BroadcasterChannel } from 'app/shared/models/broadcaster-channel';

var countryId;
var stateId;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  providers: [ApplicationService, ShopService, BroadcasterService,UtilityService]
})
export class RegistrationComponent implements OnInit {
  broadcasterchannelall: BroadcasterChannel;
  errorMessage: string;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  stateId:number;
  countries:Country[];
  newClientForm;
  userTypes = ['eCommerce', 'Entertainment'];
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
  states:State[];
  cities:City[];

  constructor(private fb: FormBuilder, private applicationService: ApplicationService,
    private utilityService:UtilityService,private notificationService: NotificationService,
    private shopService: ShopService, private broadcasterService: BroadcasterService) {
    this.application = new Application();
    this.user = new User();
    this.activateShopSelector = false;
    this.activateBroadcasterSelector = false;
  
  }

  ngOnInit() {
    this.getApplicationsList();
    this.getAllRoles();
    this.getCountry();
    this.getState(countryId);
    this.getCity(stateId);
    this.initForm();
    this.getBroadcasterAllGrid();
  
  }

  getBroadcasterAllGrid()
  {
      this.broadcasterService.getAllBroadcasterChannel()
    .subscribe(
     (journalResponse)=>{
         
          this.broadcasterchannelall=journalResponse;
         
     }),
    error => this.errorMessage = <any>error;
  };
  
  initForm() {
    this.newClientForm = this.fb.group({
      userName: [null, [Validators.required]],
      userClientName: [null, [Validators.required]],
      userShortName: [null, [Validators.required]],
      userZip: [null, [Validators.required]],
      userCity: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      user_Name : [null,[Validators.required]],
      userPasswd:[null,[Validators.required]],
     } ,
    );
  }

  showPopup() {
   
        }

  getApplicationsList() {
    this.applicationService.getApplicationList().subscribe(
      applications => {
        this.applications = applications;
      },
      error => {
        alert("something went wrong. Try after sometime.");
      }
    );
  }

  getAllRoles() {
    this.applicationService.getAllRoles().subscribe(
      applicationUsersRole => {
        this.applicationUsersRoles = applicationUsersRole;
      },
      error => {
        alert("something went wrong. Try after sometime.");
      }
    );
  }

  getCountry() {
    this.utilityService.getCountry().subscribe(
      countries => {
        this.countries = countries;
      },
      error => {
        alert("something went wrong. Try after sometime.");
      }
    );
  }

  getState(countryId:number){
    this.utilityService.getState(countryId).subscribe(
      states=> {
        this.states =states;
      },
      error => {
        alert("something went wrong. Try after sometime.");
        console.log('error'+error);
      }
    );
  }

  getCity(stateId:number){
    this.utilityService.getCity(stateId).subscribe(
      Cities=> {
        this.cities =Cities;
      },
      error => {
        alert("something went wrong. Try after sometime.");
        console.log('error'+error);
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
          alert("something went wrong. Try after sometime.");
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
          alert("something went wrong. Try after sometime.");
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

  onCountrySelect(countryId:number){
    this.countryId=countryId;
    this.getState(countryId);
  }

  onStateSelect(stateId: number) {
   this.stateId=stateId;
  this.getCity(stateId);
    
    
  }

  onCitySelect(cityId: number) {
    this.cityId=cityId;
  }
  
 

  registerUser() {
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
this.showPopup() 
{
      this.notificationService.smartMessageBox({
      title: "New client added",
        content: "Do you want to register the client details..?<i  style='color:green'></i>",
          buttons: '[No][Yes]'
       }, (ButtonPressed) => {
            if (ButtonPressed == "Yes") {
              this.applicationService.newUserRegisteration(this.user).subscribe(
                createResponse => {
                 alert("user registered successfully...");
                 location.reload();
                },
                error => {
                  alert("Something went wrong!");
                  console.log('error in creating'+error);
                }
              );
            }
            else if(ButtonPressed == "No")
              {
                alert("Registration cancel");
              }
           });
         }
 }
}

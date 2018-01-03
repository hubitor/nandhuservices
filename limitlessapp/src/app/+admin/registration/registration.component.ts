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
  userTypes = ['eCommerce', 'Entertainment', 'eUser'];
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

  hideRegistration() {
    this.isVisible = true;
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
      userClientName: [null, [Validators.required]],
      userShortName: [null, [Validators.required]],
      userZip: [null, [Validators.required]],
      userCity: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      user_Name: [null, [Validators.required]],
      userPasswd: [null, [Validators.required]],
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

  getState(countryId: number) {
    this.utilityService.getState(countryId).subscribe(
      states => {
        this.states = states;
      },
      error => {
        alert("something went wrong. Try after sometime.");
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
        alert("something went wrong. Try after sometime.");
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
    this.applicationId = dataObj.application_id;
    this.user_type=dataObj.user_type;
    this.user_name=dataObj.user_name;
    this.emailId = dataObj.email_id;
    this.clientName=dataObj.clientName;
    this.status = dataObj.is_active;
    this.broadcasterName = dataObj.broadcasterName;
    this.broadcasterId=dataObj.broadcaster_id;
    this.mobileNo=dataObj.mobile;
    this.city=dataObj.city;
    this.country=dataObj.country;
    this.zipcode=dataObj.zip;
    this.newClientForm = this.fb.group({
      client_id: [dataObj.broadcaster_id],
      application_id: [dataObj.application_id],
      clientName:[dataObj.clientName],
      user_type: [dataObj.user_type],
      user_name: [dataObj.user_name],
      email_id: [dataObj.email_id],
      user_short_name: [dataObj.user_short_name],
      mobile:[dataObj.mobile],
      city:[dataObj.city],
      state:[dataObj.state],
      zip:[dataObj.zip],
      status: [dataObj.is_active]
    });
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

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
import { BroadcasterChannel } from 'app/shared/models/broadcaster-channel';
import { Country }from '../../shared/models/country';
import { State }from '../../shared/models/state';
import { City }from '../../shared/models/city';
import { NotificationService } from "../../shared/utils/notification.service";
import { AssignedUserRoleModule } from  "../../shared/models/assigned-user-role-module";
import { LoginResponse } from '../../shared/models/loginResponse';
import { ApplicationModule } from '../../shared/models/applicationModule';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  providers: [ApplicationService, ShopService, BroadcasterService, UtilityService]
})
export class SuperUserComponent implements OnInit {
  broadcaster: Broadcasters;
  client_id: number;
  Id: number;
  broadcasterchannelall: BroadcasterChannel;
  errorMessage: string;
  city: string;
  cityId: number;
  country: string;
  countryId: number;
  stateId:number;
  countries:Country[];
  superUserForm;
  // userTypes = ['eCommerce', 'Entertainment'];
  application: Application;
  applications: Application[];
  applicationId: number;
  // userType: string;
  user: LoginResponse;
  shops: Shop[];
  applicationUsersRoles: ApplicationUsersRole[];
  roleId: number;
  moduleId:number;
  shopId: number;
  broadcasters: Broadcasters[];
  broadcasterId: number;
  activateShopSelector: boolean;
  activateBroadcasterSelector: boolean;
  superUser: Application[];
  assignedUserRolemodule: AssignedUserRoleModule;
  user_id:number;
  applicationModules: ApplicationModule[];

  constructor(private fb: FormBuilder, private applicationService: ApplicationService,
    private utilityService:UtilityService,private notificationService: NotificationService,
    private shopService: ShopService, private broadcasterService: BroadcasterService) {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
      this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
      if (this.user.user_type === "Super Admin") {
        this.client_id = 1064;
        this.user.client_id = 1064;
      }
      else {
        this.client_id = this.user.client_id;
      }    
    
    this.application = new Application();
    // this.user = new User();
    this.broadcasters= new Array();
    this.assignedUserRolemodule = new AssignedUserRoleModule();
    this.Id = 0;
  
  }

  ngOnInit() {
    // this.getApplicationsList();
    this.getAllRoles();
    this.getAllModules();
    this.initForm();
    this.getBroadcasterAll(this.client_id);
  
  }

  initForm() {
    this.superUserForm = this.fb.group({
      userActiveStatus: new FormControl(""),
     });
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

  getAllModules() {
    this.applicationService.getAllModules().subscribe(
      applicationModule => {
        this.applicationModules = applicationModule;
        console.log(this.applicationModules);
      },
      error => {
        alert("something went wrong. Try after sometime.");
      }
    );
  }

  getApplicationUsers(broadcasterId:number){
    this.applicationService.getApplicationUserByClientId(broadcasterId).subscribe(
      superUsers =>{
        this.superUser= superUsers;
        console.log(this.superUser);
      },
      error=>{
        console.log(error);
      }
    )
  }

  getBroadcasterAll(broadcaterId)
  {
      this.broadcasterService.getAllBroadcastersById(broadcaterId)
        .subscribe(
        broadcasters => {
          this.broadcaster = broadcasters;
        },

        error => this.errorMessage = <any>error);
   
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
    } else  if (selectedString[1] === 'Entertainment') {
      this.activateBroadcasterSelector = true;
      this.activateShopSelector = false;
      // this.getBroadcasterAll();
     
    }
  }

  onShopSelect(shopId: number) {
    this.shopId = shopId;
  }

  onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.getApplicationUsers(broadcasterId);
  }

  // onUserTypeSelect(userType: string) {
  //   // this.userType = userType;
  // }

  onUserRoleSelect(roleId: number) {   
     this.roleId = roleId; 
  }

  onUserModuleSelect(moduleId: number){
    this.moduleId=moduleId;
    console.log(moduleId);

  }

  onApplicationUserSelect(userId: number){
    this.Id=userId;
    console.log(this.Id);
  }

  updateRoles(){
    const newSuperUserRoles = this.superUserForm.value;
    this.assignedUserRolemodule.user_id=this.Id;
    this.assignedUserRolemodule.role_id=this.roleId;
    this.assignedUserRolemodule.module_id=this.moduleId;
    this.assignedUserRolemodule.is_active =newSuperUserRoles.userActiveStatus;
    this.assignedUserRolemodule.created_by = "uma";
    this.assignedUserRolemodule.last_updated_by = "uma";
    
    this.applicationService.updateRolesModule(this.assignedUserRolemodule).subscribe(
    createResponse => {
      console.log('output'+createResponse);
        window.location.reload();
        },
        error => 
        {
          console.log('error '+ error);
        }
   ); 
  } 


}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { Shop } from '../../shared/models/shop';
import { User } from '../../shared/models/userModel';
import { ShopService } from '../../shared/server/service/shop.service';
import { ShopCreateResponse } from '../../shared/models/shopCreateResponse';
import { ApplicationUsersRole } from '../../shared/models/applicationUsersRole';

@Component({
  selector: 'app-eshop',
  templateUrl: './eshop.component.html',
  providers: [ApplicationService, ShopService]
})
export class EshopComponent implements OnInit {
  newShopForm;
  kycDocList = ['PAN', 'AADHAAR'];
  shop: Shop;
  user: User;
  applications: Application[];
  application: Application;
  applicationId: number;
  kycDocType: string;
  shopCreateResponse: ShopCreateResponse;
  applicationUsersRoles: ApplicationUsersRole[];
  roleId: number;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService, private router: Router, private shopService: ShopService) {
    this.shop = new Shop();
    this.user = new User();
    this.application = new Application();
    this.shopCreateResponse = new ShopCreateResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getApplicationsList();
    this.getAllApplicationUsersRoles();
  }

  initForm() {
    this.newShopForm = this.fb.group({
      shopName: [null, [Validators.required]],
      aboutShop: [null, [Validators.required]],
      shopCode: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      userShortName: [null, [Validators.required]],
      userCity: [null, [Validators.required]],
      userZip: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      sellerKycValue: [null, [Validators.required]]
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

  getAllApplicationUsersRoles(){
    this.applicationService.getAllRoles().subscribe(
      allRoles => {
        this.applicationUsersRoles = allRoles;
      },
      error => {
        console.log('roles not found');
      }
    );
  }

  onApplicationSelect(applicationId: number){
    this.applicationId = applicationId;
  }

  onKycDocTypeSelect(kycDocType: string){
    this.kycDocType = kycDocType;
  }

  onRoleSelect(roleId: number){
    this.roleId= roleId;
  }

  addNewShop(){
    const newShop = this.newShopForm.value;
    //shop obect
    this.shop.application_id = this.applicationId;
    this.shop.seller_shop_name = newShop.shopName;
    this.shop.about_shop = newShop.aboutShop;
    this.shop.shop_code = newShop.shopCode;
    this.shop.seller_location_latitude = 0;
    this.shop.seller_location_longitude = 0;
    this.shop.seller_kyc_doc_type = this.kycDocType;
    this.shop.seller_kyc_doc_value = newShop.sellerKycValue;
    this.shop.is_deleted = false;
    this.shop.created_by = "SA";
    this.shop.updated_by = "SA";
    //user object
    this.user.application_id = this.applicationId;
    this.user.user_type = 'eCommerce';
    this.user.user_name = newShop.userName;
    this.user.user_short_name = newShop.userShortName;
    this.user.city = newShop.userCity;
    this.user.zip = newShop.userZip;
    this.user.mobile = newShop.userMobile;
    this.user.email_id = newShop.userEmail;
    this.user.passwd = newShop.userMobile;
    this.user.country_iso_code = '91';
    this.user.country = 'India';
    this.user.device_mac = 'NIL';
    this.user.is_anonymous = false;
    this.user.is_active = true;
    this.user.created_by = 'SA';
    this.user.last_updated_by = 'SA';
    this.user.roleId = this.roleId;
    //assigning user to shop
    this.shop.user = this.user;
    this.shopService.createShop(this.shop).subscribe(
      createResponse => {
        this.shopCreateResponse = createResponse;
        localStorage.setItem("shop", JSON.stringify(this.shop));
        localStorage.setItem("shopCreateResponse", JSON.stringify(this.shopCreateResponse));
        alert('Shop and user created successfully!');
      },
      error => {
        alert('Something went wrong!');
      }
    );
  }

}

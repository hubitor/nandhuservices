import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { Shop } from '../../shared/models/shop';
import { User } from '../../shared/models/userModel';
import { ShopService } from '../../shared/server/service/shop.service';
import { ShopCreateResponse } from '../../shared/models/shopCreateResponse';
import { ApplicationUsersRole } from '../../shared/models/applicationUsersRole';
import { AppSettings } from "../../shared/server/api/api-settings";
import { LoginResponse } from "../../shared/models/loginResponse";
import { Product } from "../../shared/models/product";
import { Category } from "../../shared/models/category";
import { SubCategory } from "../../shared/models/sub-category";
import {NotificationService} from "../../shared/utils/notification.service"

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
  shopLatitude: number;
  shopLogitude: number;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService, private router: Router, private shopService: ShopService,
    private notificationService: NotificationService,) {
    this.shop = new Shop();
    this.user = new User();
    this.user = JSON.parse(localStorage.getItem("haappyapp-user"));
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
      sellerKycValue: [null, [Validators.required]],
      shopLatitude: [null, [Validators.required]],
      shopLongitude: [null, [Validators.required]],
    });
  }

  getApplicationsList() {
    this.applicationService.getApplicationList().subscribe(
      applications => {
        this.applications = applications;
      },
      error => {
        // alert("something went wrong. Try after sometime.");
      }
    );
  }

  getAllApplicationUsersRoles() {
    this.applicationService.getAllRoles().subscribe(
      allRoles => {
        this.applicationUsersRoles = allRoles;
      },
      error => {
        console.log('roles not found');
      }
    );
  }

  onApplicationSelect(applicationId: number) {
    this.applicationId = applicationId;
  }

  onKycDocTypeSelect(kycDocType: string) {
    this.kycDocType = kycDocType;
  }

  onRoleSelect(roleId: number) {
    this.roleId = roleId;
  }

  addNewShop() {
    
              //shop form
                const newShop = this.newShopForm.value;
                //new shop
                this.shop.application_id = this.applicationId;
                this.shop.seller_shop_name = newShop.shopName;
                this.shop.about_shop = newShop.aboutShop;
                this.shop.shop_code = newShop.shopCode;
                this.shop.seller_location_latitude = newShop.shopLatitude;
                this.shop.seller_location_longitude = newShop.shopLongitude;
                this.shop.seller_kyc_doc_type = this.kycDocType;
                this.shop.seller_kyc_doc_value = newShop.sellerKycValue;
                this.shop.is_deleted = false;
                this.shop.created_by = "SA";
                this.shop.updated_by = "SA";
                console.log(this.shop);
                this.showPopup();
                }
  showPopup()
  {
  this.notificationService.smartMessageBox({
  title: "New client added",
  content: "Do you want to register the client details..?<i  style='color:green'></i>",
  buttons: '[No][Yes]'
  }, (ButtonPressed) => {
  if (ButtonPressed == "Yes") {
    this.shopService.createShop(this.shop).subscribe(
      createResponse => {
        this.shopCreateResponse = createResponse;
        localStorage.setItem("shop", JSON.stringify(this.shop));
        localStorage.setItem("shopCreateResponse", JSON.stringify(this.shopCreateResponse));
        alert('Shop and user created successfully!');
      },
  error => {
  // alert("Something went wrong!");
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

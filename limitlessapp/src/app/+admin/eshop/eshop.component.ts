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
  public categoryUploader: FileUploader;
  public subcategoryUploader: FileUploader;
  public productUploader: FileUploader;
  category: Category;
  subcategory: SubCategory;
  product: Product;
  categoryImageUrl: string;
  categoryImageFileName: string;
  subcategoryImageUrl: string;
  subcategoryImageFileName: string;
  productImageUrl: string;
  productImageFileName: string;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService, private router: Router, private shopService: ShopService) {
    this.shop = new Shop();
    this.user = new User();
    this.user = JSON.parse(localStorage.getItem("haappyapp-user"));
    this.application = new Application();
    this.shopCreateResponse = new ShopCreateResponse();
    this.categoryUploader = new FileUploader({ url: AppSettings.LOCAL_API + "upload/image/ecomm/category/" + this.user.id });
    this.subcategoryUploader = new FileUploader({ url: AppSettings.LOCAL_API + "upload/image/ecomm/subcategory/" + this.user.id });
    this.productUploader = new FileUploader({ url: AppSettings.LOCAL_API + "upload/image/ecomm/product/" + this.user.id });
    this.category = new Category();
    this.subcategory = new SubCategory();
    this.product = new Product();
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
      primaryCategoryName: [null, [Validators.required]],
      primaryCategoryDescription: [null, [Validators.required]],
      primarySubcategoryName: [null, [Validators.required]],
      primarySubcategoryDescription: [null, [Validators.required]],
      primaryProductName: [null, [Validators.required]],
      primaryProductDescription: [null, [Validators.required]],
      primaryProductPrice: [null, [Validators.required]]
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
    this.categoryUploader.uploadAll();
    this.categoryUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (status === 200) {
        var categoryFileNamePath = response.toString();
        var categorySplitter = categoryFileNamePath.split('|');
        this.categoryImageUrl = categorySplitter[0];
        this.categoryImageFileName = categorySplitter[1];
        this.subcategoryUploader.uploadAll();
        this.subcategoryUploader.onSuccessItem = (item2: FileItem, response2: string, status2: number, headers2: ParsedResponseHeaders) => {
          if (status2 === 200) {
            var subcategoryFileNamePath = response2.toString();
            var subcategorySplitter = subcategoryFileNamePath.split('|');
            this.subcategoryImageUrl = subcategorySplitter[0];
            this.subcategoryImageFileName = subcategorySplitter[1];
            this.productUploader.uploadAll();
            this.productUploader.onSuccessItem = (item3: FileItem, response3: string, status3: number, headers3: ParsedResponseHeaders) => {
              if (status3 === 200) {
                var productFileNamePath = response3.toString();
                var productSplitter = productFileNamePath.split('|');
                this.productImageUrl = productSplitter[0];
                this.productImageFileName = productSplitter[1];
                //shop form
                const newShop = this.newShopForm.value;
                //new shop
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
                //new category
                this.category.application_id = this.applicationId;
                this.category.category_name = newShop.primaryCategoryName;
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
              } else {
                alert('Something went wrong!');
              }
            }
          } else {
            alert('Something went wrong!');
          }
        }
      } else {
        alert('Something went wrong!');
      }
    }
  }

}

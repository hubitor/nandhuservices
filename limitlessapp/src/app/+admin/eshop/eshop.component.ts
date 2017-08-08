import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { Shop } from '../../shared/models/shop';

@Component({
  selector: 'app-eshop',
  templateUrl: './eshop.component.html',
  providers: [ApplicationService]
})
export class EshopComponent implements OnInit {
  newShopForm;
  kycDocList = ['PAN', 'AADHAAR'];
  shop: Shop;
  applications: Application[];
  application: Application;
  applicationId: number;
  kycDocType: string;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService) {
    this.shop = new Shop();
    this.application = new Application();
  }

  ngOnInit() {
    this.initForm();
    this.getApplicationsList();
  }

  initForm() {
    this.newShopForm = this.fb.group({
      shopName: [null, [Validators.required]],
      aboutShop: [null, [Validators.required]],
      shopCode: [null, [Validators.required]],
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

  onAppliationSelect(applicationId: number){
    this.applicationId = applicationId;
  }

  onKycDocTypeSelect(kycDocType: string){
    this.kycDocType = kycDocType;
  }

  addNewShop(){
    const newShop = this.newShopForm.value;
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
  }

}

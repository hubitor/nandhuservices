import { Component, OnInit } from '@angular/core';
import { LoginInfoComponent } from "../../user/login-info/login-info.component";
import { LoginResponse } from "../../models/loginResponse";
import { UserRolesModel } from "../../models/userRolesModel";

@Component({
  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  loginResponse: LoginResponse;
  eCommerce: boolean;
  broadcaster: boolean;
  userRoles: UserRolesModel[];
  application:boolean;
  shop: boolean;
  products: boolean;
  category: boolean;
  subcategory: boolean;
  order: boolean;
  productInvetory: boolean;
  channelStream: boolean;
  channelVideos: boolean;
  channelAlbum: boolean;
  superAdmin: boolean;
  channelHome:boolean;
  videoManager: boolean;
  constructor() {
    this.loginResponse = new LoginResponse();
    this.userRoles = Array();
    this.application = false;
    this.eCommerce = false;
    this.broadcaster = false;
    this.shop = false;
    this.products = false;
    this.category = false;
    this.subcategory = false;
    this.order = false;
    this.productInvetory = false;
    this.channelStream = false;
    this.channelVideos = false;
    this.channelAlbum = false;
    this.superAdmin = false;
    this.channelHome=false;
    this.videoManager = false;
  }

  ngOnInit() {
    var userString = localStorage.getItem("haappyapp-user");
    var userRolesLength: number = parseInt(localStorage.getItem("haappyapp-roles-length"));
    if (userString != null) {
      this.loginResponse = JSON.parse(userString);
      if (this.loginResponse.user_type === 'eCommerce') {
        this.eCommerce = true;
        this.broadcaster = false;
        for (var i = 0; i < userRolesLength; i++) {
          this.userRoles.push(JSON.parse(localStorage.getItem("haappyapp-role-" + i)));
          if (this.userRoles[i].module_name === "Shop") {
            this.shop = true;
            this.products = true;
            this.category = true;
            this.subcategory = true;
            this.order = true;
            this.productInvetory = true;
          } else if (this.userRoles[i].module_name === "Products") {
            this.products = true;
          } else if (this.userRoles[i].module_name === "Category") {
            this.category = true;
          } else if (this.userRoles[i].module_name === "Subcategory") {
            this.subcategory = true;
          } else if (this.userRoles[i].module_name === "Order") {
            this.order = true;
          } else if (this.userRoles[i].module_name === "Product Inventory") {
            this.productInvetory = true;
          }
        }
      } else if (this.loginResponse.user_type === 'Entertainment') {
        this.broadcaster = true;
        this.eCommerce = false;
        this.videoManager = true;
        for (var i = 0; i < userRolesLength; i++) {
          this.userRoles.push(JSON.parse(localStorage.getItem("haappyapp-role-" + i)));
          if (this.userRoles[i].module_name === "Channel Stream") {
            this.channelStream = true;
          } else if (this.userRoles[i].module_name === "Channel Video") {
            this.channelVideos = true;
          }
          else if (this.userRoles[i].module_name === "Channel Home") {
            this.channelHome = true;
          }
        }
      } else if(this.loginResponse.user_type === "Super Admin") {
        this.superAdmin = true;
        this.broadcaster = true;
        this.eCommerce = true;
        this.shop = true;
        this.products = true;
        this.category = true;
        this.subcategory = true;
        this.order = true;
        this.productInvetory = true;
        this.channelStream = true;
        this.channelVideos = true;
        this.channelHome=true;
        this.videoManager = true;
      }
    }
  }

}

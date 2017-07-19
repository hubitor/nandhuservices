import {AppSettings} from '../api/api-settings'

export class AppConfig  { 


  // Application Config   
  public static get_Appl=AppSettings.API_ENDPOINT +"application";
  public static new_Appl=AppSettings.API_ENDPOINT +"new";
  public static amend_Appl=AppSettings.API_ENDPOINT +"update";
  
  //Category Config
  public static get_Category=AppSettings.API_ENDPOINT +"product/category/all";//should be pass "all" as to server
  public static new_Category=AppSettings.API_ENDPOINT +"product/category/new"; //to pass "new"" as to server
  public static amend_Category=AppSettings.API_ENDPOINT +"product/category/live"; // to pass "live" as to server
  public static getid_category=AppSettings.API_ENDPOINT +"product/category/get"; // to pass "live" as to server
  
  //Sub-Category Config
  public static get_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/all/";
  public static new_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/new";
  public static get_subcategory_by_id = AppSettings.API_ENDPOINT + "product/subcategory/get/";
  public static amend_Subcategory=AppSettings.API_ENDPOINT +"product/subcategory/update";

  //Product Config
  public static get_Products=AppSettings.API_ENDPOINT +"product/all";
  public static get_ProductById=AppSettings.API_ENDPOINT +"product/get/:id";
  public static new_Product=AppSettings.API_ENDPOINT +"new";
  public static amend_Product=AppSettings.API_ENDPOINT +"update";
};
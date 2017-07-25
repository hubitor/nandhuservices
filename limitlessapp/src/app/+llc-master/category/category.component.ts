import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CategoryService } from "../../shared/server/service/category-service"
import { Observable } from 'rxjs/Observable';
import { Category } from "../../shared/models/category"
import { CreateResponse } from "../../shared/models/createResponse";
import { CategoryUpdateResponse } from "../../shared/models/categoryUpdateResponse";
import { LoginResponse } from "../../shared/models/loginResponse";
import { AppSettings } from "../../shared/server/api/api-settings";

@Component({
  selector: 'llc-category',
  templateUrl: './category.component.html',
  providers: [CategoryService]
})
export class CategoryComponent implements OnInit {
  user:LoginResponse;
  public uploader: FileUploader;
  productCategoryForm;
  errorMessage: string;
  appid: number;
  categories: Category;
  category: Category;
  createResponse: CreateResponse;
  categoryUpdateResponse: CategoryUpdateResponse;
  mode = 'Observable';
  categoryId;
  appSettings:AppSettings;

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.category = new Category();
    //this.user = new LoginResponse();
    this.appSettings = new AppSettings();
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    this.uploader = new FileUploader({ url: AppSettings.API_ENDPOINT+'upload/image/ecomm/category/'+this.user.user_id });
  }

  ngOnInit() {
    //console.log('intialize categories');
    this.getAllCategory();
    //this.getCategoryById();
    this.productCategoryForm = new FormGroup({
      productCategoryName: new FormControl(""),
      productCategoryDescription: new FormControl(""),
      productCategoryActiveStatus: new FormControl("")
    });
  }
  getAllCategory() {

    this.categoryService.getAllCategory()
      .subscribe(
      categories => this.categories = categories,
      error => this.errorMessage = <any>error);
  }

  createCategory() {
    const productCatgory = this.productCategoryForm.value;
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log("onSuccessItem " + status, response);
      if (status === 200) {
        var fileNamePath = response.toString();
        var splitter = fileNamePath.split('|');
        var imageUrl = splitter[0];
        var fileName = splitter[1];
        this.category = new Category();
        this.category.application_id = this.user.user_app_id;
        this.category.category_name = productCatgory.productCategoryName;
        this.category.category_description = productCatgory.productCategoryDescription;
        this.category.category_image = imageUrl;
        this.category.image_file_name = fileName;
        this.category.seller_id = this.user.user_id;
        this.category.is_active = productCatgory.productCategoryActiveStatus;
        this.category.created_by = "user";
        this.category.updated_by = "user";
        console.log(this.category);
        this.categoryService.createCategory(this.category)
          .subscribe(
          createResponse => {
            alert("category created successfully...");
            window.location.reload();
          },
          error => this.errorMessage = <any>error);
        
      } else {
        alert("Image upload Failed");
      }
    }
  }

  createSuccess(createResponse: CreateResponse) {
    this.categoryId = createResponse.id;
  }

  amendCategory() {
    this.category = new Category();
    this.category.id = 3;
    this.category.category_name = "Test Post";
    this.category.category_description = "Test Description";
    this.category.category_image = "";
    this.category.seller_id = 1;
    this.category.is_active = false;
    this.category.created_by = "user";
    this.category.updated_by = "user";
    this.categoryService.amendCategory(this.category)
      .subscribe(
      categories => this.categories = categories,
      error => this.errorMessage = <any>error);
  }

  getCategoryById(){
    this.categoryService.getCategory(7)
      .subscribe(
        categoryUpdateResponse => this.categoryValuesBinding(categoryUpdateResponse),
        error => this.errorMessage = <any>error
      );
  }

  categoryValuesBinding(categoryUpdateResponse){
    this.productCategoryForm = this.fb.group({
      productCategoryName: categoryUpdateResponse.category_name,
      productCategoryDescription: categoryUpdateResponse.category_description,
      productCategoryActiveStatus: categoryUpdateResponse.is_active
    })
  }

}
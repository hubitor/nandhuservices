import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SubCategory } from '../../../shared/models/sub-category';
import { SubCategoryService } from '../../../shared/server/service/sub-category-service';
import { CategoryService } from "../../../shared/server/service/category-service";
import { Category } from "../../../shared/models/category";
import { FileDeleteRequest } from "../../../shared/models/fileDeleteRequest";
import { LoginResponse } from "../../../shared/models/loginResponse";
import { AppSettings } from "../../../shared/server/api/api-settings";

@Component({
  selector: 'app-subcategory-edit',
  templateUrl: './subcategory-edit.component.html',
  providers: [SubCategoryService, CategoryService]
})
export class SubcategoryEditComponent implements OnInit {
  user:LoginResponse;
  public uploader: FileUploader;
  productSubcategoryEditForm;
  categories: Category;
  category: Category;
  subcategory: SubCategory;
  subcategories: SubCategory[];
  errorMessage: string;
  categoryId: number;
  subcategoryId: number;
  subcategoryImage: string;
  subcategoryImageFileName: string;
  isImageDeleted: boolean;
  imageSelector: boolean;
  fileDeleteRequest: FileDeleteRequest;
  appSettings:AppSettings;

  constructor(private fb: FormBuilder, private subcategoryService: SubCategoryService, private categoryService: CategoryService) {
    this.subcategory = new SubCategory();
    this.fileDeleteRequest = new FileDeleteRequest();
    this.appSettings = new AppSettings();
    this.user = JSON.parse(localStorage.getItem("haappyapp-user"));
    this.uploader = new FileUploader({ url: AppSettings.API_ENDPOINT+'upload/image/ecomm/subcategory/'+this.user.user_id });
  }

  ngOnInit() {
    this.getAllCategory();
    this.isImageDeleted = false;
    this.imageSelector = true;
    this.productSubcategoryEditForm = new FormGroup({
      productSubcategoryName: new FormControl(""),
      productSubcategoryDescription: new FormControl(""),
      productSubcategoryActiveStatus: new FormControl(""),
      productSubcategoryImage: new FormControl("")
    });
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe(
      categories => this.categories = categories,
      error => this.errorMessage = error
    );
  }

  onProductCategorySelect(categoryId) {
    this.categoryId = categoryId;
    this.subcategoryService.getAllSubcategory(categoryId).subscribe(
      subcategories => this.subcategories = subcategories,
      error => this.errorMessage = error
    );
  }

  onProductSubcategorySelect(subcategoryId) {
    this.subcategoryId = subcategoryId;
    this.subcategoryService.getSubcategoryById(subcategoryId).subscribe(
      subacategory => this.subcategoryToForm(this.subcategory = subacategory),
      error => this.errorMessage = error
    );
  }

  subcategoryToForm(subcategory: SubCategory) {
    //console.log(subcategory);
    this.productSubcategoryEditForm = this.fb.group({
      productSubcategoryName: subcategory.subcategory_name,
      productSubcategoryDescription: subcategory.subcategory_description,
      productSubcategoryActiveStatus: subcategory.is_active,
      productSubcategoryImage: subcategory.subcategory_image
    });
    this.subcategoryImage = subcategory.subcategory_image;
    this.subcategoryImageFileName = subcategory.image_file_name;
  }

  subcategoryUpdate() {
    if (this.isImageDeleted) {
      console.log('image deleted..');
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        var fileNamePath = response.toString();
        var splitter = fileNamePath.split('|');
        var imageUrl = splitter[0];
        var fileName = splitter[1];
        const productSubcategory = this.productSubcategoryEditForm.value;
        this.subcategory.category_id = this.categoryId;
        this.subcategory.id = this.subcategoryId;
        this.subcategory.subcategory_name = productSubcategory.productSubcategoryName;
        this.subcategory.subcategory_description = productSubcategory.productSubcategoryDescription;
        this.subcategory.subcategory_image = imageUrl;
        this.subcategory.image_file_name = fileName;
        this.subcategory.updated_by = 'user';
        this.subcategory.is_active = productSubcategory.productSubcategoryActiveStatus;
      };
    } else {
      console.log('image not deleted');
      const productSubcategory = this.productSubcategoryEditForm.value;
      this.subcategory.category_id = this.categoryId;
      this.subcategory.id = this.subcategoryId;
      this.subcategory.subcategory_name = productSubcategory.productSubcategoryName;
      this.subcategory.subcategory_description = productSubcategory.productSubcategoryDescription;
      this.subcategory.is_active = productSubcategory.productSubcategoryActiveStatus;
      this.subcategory.subcategory_image = this.subcategoryImage;
      this.subcategory.image_file_name = this.subcategoryImageFileName;
      this.subcategory.updated_by = 'user';
    }
    this.subcategoryService.amendsubCategory(this.subcategory).subscribe(
      resp => console.log(resp),
      error => console.log(error)
    );
  }

  deleteImage() {
    console.log(this.subcategoryImageFileName);
    this.fileDeleteRequest.deleteApp = 'ecomm';
    this.fileDeleteRequest.deleteFrom = 'subcategory';
    this.fileDeleteRequest.fileName = this.subcategoryImageFileName;
    this.fileDeleteRequest.userId = 1;
    this.subcategoryService.deleteSubcategoryImage(this.fileDeleteRequest).subscribe(
      resp => console.log(resp),
      error => console.log(error)
    );
    this.isImageDeleted = true;
    this.imageSelector = false;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { SubCategory } from '../../shared/models/sub-category';
import { SubCategoryService } from '../../shared/server/service/sub-category-service';
import { CategoryService } from "../../shared/server/service/category-service";
import { Category } from "../../shared/models/category";
import { AppSettings } from "../../shared/server/api/api-settings"

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  providers: [SubCategoryService, CategoryService]
})
export class SubcategoryComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: AppSettings.API_ENDPOINT+ 'upload/image/ecomm/subcategory/1' });
  productSubcategoryForm;
  subcategory: SubCategory;
  subcategories: SubCategory[];
  categories: Category;
  errorMessage: string;
  user;

  constructor(private fb: FormBuilder, private subcategoryService: SubCategoryService, private categoryService: CategoryService) {
    this.subcategory = new SubCategory();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllCategory();
    this.productSubcategoryForm = new FormGroup({
      productCategoryId: new FormControl(""),
      productSubcategoryName: new FormControl(""),
      prouductSubcategoryDescription: new FormControl(""),
      productSubcategoryActiveStatus: new FormControl("")
    });
  }

  createSubcategory() {
    const productSubcategory = this.productSubcategoryForm.value;
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      var fileNamePath = response.toString();
      var splitter = fileNamePath.split('|');
      var imageUrl = splitter[0];
      var fileName = splitter[1];
      this.subcategory.category_id = productSubcategory.productCategoryId;
      this.subcategory.subcategory_name = productSubcategory.productSubcategoryName;
      this.subcategory.subcategory_description = productSubcategory.prouductSubcategoryDescription;
      this.subcategory.is_active = productSubcategory.productSubcategoryActiveStatus;
      this.subcategory.subcategory_image = imageUrl;
      this.subcategory.image_file_name = fileName;
      this.subcategoryService.CreatesubCategory(this.subcategory).subscribe(
        createesponse => {
          alert("subcategory created successfully...");
          window.location.reload();
        },
        error => this.errorMessage = error
      );
    }
  }

  getAllSubcategory(categoryId) {
    console.log(categoryId);
    this.subcategoryService.getAllSubcategory(categoryId).subscribe(
      subcategories => {
        if (subcategories.length <= 0) {
          alert("no subcategores found...");
        } else {
          this.subcategories = subcategories;
        }
      },
      error => this.errorMessage = error
    );
  }

  getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(
      categories => this.categories = categories,
      error => this.errorMessage = <any>error);
  }

}

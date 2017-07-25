import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ProductService } from "../../shared/server/service/product-service"
import { Observable } from 'rxjs/Observable';
import { Product } from "../../shared/models/product"
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { LoginResponse } from "../../shared/models/loginResponse"
import { AppSettings } from "../../shared/server/api/api-settings";

@Component({
  selector: 'llc-product',
  templateUrl: './product.component.html',
  providers: [ProductService]

})
export class ProductComponent implements OnInit {
  user: LoginResponse;
  public uploader:FileUploader;
  public p_categoryId: 0;
  private s_statusId: boolean;
  private s_subCategoryId: number;
  private s_categoryId: number;
  public productForm: FormGroup;
  private product_id: number;
  errorMessage: string;
  appid: number;
  products: Product[];
  product: Product;
  listenFunc: Function;
  mode = 'Observable';
  appSettings:AppSettings;

  constructor(private productService: ProductService, private _fb: FormBuilder, elementRef: ElementRef, renderer: Renderer) {
    this.product = new Product();
    this.products = [];
    // Listen to click events in the component
    this.listenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
      // Do something with 'event'
      if (event.target.className.match('cls-product2')) {
        this.product_id = event.target.closest('td') ? +event.target.closest('td').innerText : 0;
        this.editClicked(this.product_id);
      }

    });
    //this.user = new LoginResponse();
    this.appSettings = new AppSettings();
    this.user = JSON.parse(localStorage.getItem("haappyapp-user"));
    this.uploader  = new FileUploader({ url: AppSettings.API_ENDPOINT + 'upload/image/ecomm/product/'+this.user.user_id});
  }

  ngOnDestroy() {
    // We execute both functions to remove the respectives listeners
    // Removes "listen" listener
    this.listenFunc();
  }

  editClicked(id: number) {
    this.product_id = id;
    console.log(this.product_id);
  }

  handleStatusUpdated(value) {
    this.s_statusId = value;
  }

  handleCategoryUpdated(value) {
    this.p_categoryId = value;
    this.productForm.setValue({
      category_id: value
    });
    this.s_categoryId = value;
  }

  handleSubCategoryUpdated(value) {
    this.s_subCategoryId = value;
  }

  createCategory() {
    const productFormValue = this.productForm.value;
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log("onSuccessItem " + status, response);
      if (status === 200) {
        this.product = new Product();
        this.product.category_id = this.s_categoryId;
        this.product.subcategory_id = this.s_subCategoryId;
        this.product.product_name = productFormValue.product_name;
        this.product.product_price = productFormValue.product_price;
        this.product.discount_rate = productFormValue.discount_rate;
        this.product.product_descripton = productFormValue.product_description;
        this.product.product_image = response
        this.product.is_removed = this.s_statusId;
        this.productService.createProduct(this.product)
          .subscribe(
          createResponse => {
            alert("product created successfully...");
            window.location.reload();
          },
          error => this.errorMessage = <any>error);

      } else {
        alert("Image upload Failed");
      }
    }
  }



  ngOnInit() {
    let productFormGroup: FormGroup = new FormGroup({});
    // the short way
    this.productForm = this._fb.group({
      category_id: this.s_categoryId,
      subcategory_id: 1,
      product_name: [''],
      product_description: [''],
      product_price: [''],
      discount_rate: [''],
      product_image: [''],
      product_size: ['']

    });
    this.getAllProduct();
  }

  // ngAfterViewInit() {
  //   document.querySelector('body').addEventListener('click', (event)=> {
  //     console.log(event.target);

  //     if (event.target == 'click') {
  //         this.editClicked(event);
  //     }

  //   });
  // }

  getAllProduct() {

    this.productService.getAllProducts()
      .subscribe(
      products => this.products = products,
      error => this.errorMessage = <any>error,
    );

  }

  createProduct(category) {

    this.productService.createProduct(this.product)
      .subscribe(
      products => this.product = products,
      error => this.errorMessage = <any>error);

  }

  amendProduct() {
    this.product = new Product();
    this.productService.amendProduct(this.product)
      .subscribe(
      product => this.product = product,
      error => this.errorMessage = <any>error);
  }

}
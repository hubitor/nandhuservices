import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { DropdownService } from "../../shared/server/service/dropdown-service"
import { Observable } from 'rxjs/Observable';
import { SubCategory } from "../../shared/models/sub-category"
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
@Component({
    selector: 'ddl-subcategory',
    templateUrl: './ddl-subcategory.component.html',
    providers: [DropdownService]

})
export class DropdownSubCategoryComponent implements OnInit {
    public ddlsubCategoryForm: FormGroup;
    errorMessage: string;
    appid: number;
    
    subCategories:SubCategory[];
    mode = 'Observable';
    //@Input() categoryId: number;
    @Output() subcategoryUpdated = new EventEmitter<number>();
    
    constructor(private dropdownService: DropdownService, private _fb: FormBuilder) {
        this.subCategories=[];
    }

    subCategorySelected(event)
    {
        this.subcategoryUpdated.emit(+event.target.value);
    }

    getAllSubCategory(categoryId)
    {
       

       return this.dropdownService.getAllSubCategory(categoryId)
            .subscribe(
            subcategories => this.subCategories = subcategories,
            error => this.errorMessage = <any>error
            );
       
    }

    ngOnInit() {
        let categoryFormGroup: FormGroup = new FormGroup({});
        // the short way
        this.ddlsubCategoryForm = this._fb.group({
            subcategory: [],
        });
        this.getAllSubCategory(1);

        this.ddlsubCategoryForm.setValue({
            subcategory: this.subCategories || new SubCategory()
        });





    }


}
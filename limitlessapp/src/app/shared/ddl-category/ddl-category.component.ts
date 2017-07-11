import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { DropdownService } from "../../shared/server/service/dropdown-service"
import { Observable } from 'rxjs/Observable';
import { Category } from "../../shared/models/category"
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
@Component({
    selector: 'ddl-category',
    templateUrl: './ddl-category.component.html',
    providers: [DropdownService]

})
export class DropdownCategoryComponent implements OnInit {
    public ddlCategoryForm: FormGroup;
     //@Input() selectedcategoryId: number;
     @Output() categoryUpdated = new EventEmitter<number>();

    errorMessage: string;
    appid: number;
    categories: Category[];
    mode = 'Observable';
   
    constructor(private dropdownService: DropdownService, private _fb: FormBuilder) {
        this.categories = [];
    }
    categorySelected(event)
    {
       this.categoryUpdated.emit(+event.target.value);
    }

    ngOnInit() {
        let categoryFormGroup: FormGroup = new FormGroup({});
        // the short way
        this.ddlCategoryForm = this._fb.group({
            category: []
            //selectedExternalCategory:this.selectedcategoryId
        });
        this.dropdownService.getAllCategory()
            .subscribe(
            categories => this.categories = categories,
            error => this.errorMessage = <any>error
            );

        this.ddlCategoryForm.setValue({
            category: this.categories || new Category()
        });

    }
    


}
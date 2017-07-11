import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DropdownSubCategoryComponent} from "./ddl-subcategory.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [DropdownSubCategoryComponent],
  exports: [DropdownSubCategoryComponent],
})
export class DropdownSubCategoryModule {}

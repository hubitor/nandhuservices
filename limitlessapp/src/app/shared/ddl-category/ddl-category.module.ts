import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DropdownCategoryComponent} from "./ddl-category.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [DropdownCategoryComponent],
  exports: [DropdownCategoryComponent],
})
export class DropdownCategoryModule {}

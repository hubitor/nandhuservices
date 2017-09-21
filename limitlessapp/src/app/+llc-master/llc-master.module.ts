import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationComponent } from './application/application.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import {StatsModule} from "../shared/stats/stats.module";
import {StatusModule} from "../shared/status/status.module";
import { ProductModule } from './product/product.module';
import {routing} from "./llc-master.routing";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import {CarouselModule} from "ngx-bootstrap";
import {DropdownCategoryModule} from "../shared/ddl-category/ddl-category.module";
import {DropdownSubCategoryModule} from "../shared/ddl-subcategory/ddl-subcategory.module";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SubcategoryEditComponent } from './subcategory/subcategory-edit/subcategory-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    routing,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    StatsModule,
    StatusModule,
    DropdownCategoryModule,
    DropdownSubCategoryModule,
    SmartadminDatatableModule,
    ProductModule,
    CarouselModule,
    

  ],
  declarations: [
   ApplicationComponent,
   CategoryComponent,
   ProductComponent,
  //  FileSelectDirective, 
  //  FileDropDirective, 
   SubcategoryComponent, SubcategoryEditComponent
  ]
})
export class LlcMasterModule { }

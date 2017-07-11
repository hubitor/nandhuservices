import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

import {ApplicationComponent} from "./application/application.component";
import {CategoryComponent} from "./category/category.component";
import { ProductComponent } from './product/product.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { SubcategoryEditComponent } from './subcategory/subcategory-edit/subcategory-edit.component';

export const routesMaster:Routes = [
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'application',
    component: ApplicationComponent
  }
  ,
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'subcategory',
    component: SubcategoryComponent
  },
  {
    path: 'subcategory_edit',
    component: SubcategoryEditComponent
  }
];

export const routing = RouterModule.forChild(routesMaster)
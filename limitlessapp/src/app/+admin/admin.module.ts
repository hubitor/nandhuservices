import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcasterComponent } from './broadcaster/broadcaster.component';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import {StatsModule} from "../shared/stats/stats.module";
import {Adminrouting} from "./admin.routing";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CarouselModule} from "ngx-bootstrap";
import { EshopComponent } from './eshop/eshop.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import {DestinationComponent} from "./destination/destination.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Adminrouting,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    StatsModule,
    SmartadminDatatableModule,
    CarouselModule,
    

  ],
  declarations: [
    BroadcasterComponent,
    EshopComponent,
    RegistrationComponent,
    UserRolesComponent,
    DestinationComponent
    // FileDropDirective
  ]
})
export class AdminModule { }

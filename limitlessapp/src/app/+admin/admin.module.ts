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
    BroadcasterComponent
    // ,
    //  ChannelAlbumComponent,
    // ChannelStreamComponent
   
  ]
})
export class AdminModule { }

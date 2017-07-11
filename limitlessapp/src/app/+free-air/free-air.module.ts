import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OrdersComponent } from './orders/orders.component';
import { ChannelVideoComponent } from './channel-video/channel-video.component';
import { ChannelAlbumComponent } from './channel-album/channel-album.component';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import {StatsModule} from "../shared/stats/stats.module";
import {routing} from "./free-air.routing";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
//import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {CarouselModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    routing,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    StatsModule,
    SmartadminDatatableModule,
    CarouselModule,
    

  ],
  declarations: [
    //ShoppingCartComponent,
    //OrdersComponent,
    ChannelVideoComponent
    , ChannelAlbumComponent
   
  ]
})
export class FreeAirModule { }

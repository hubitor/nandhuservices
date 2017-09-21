import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OrdersComponent } from './orders/orders.component';
import { ChannelVideoComponent } from './channel-video/channel-video.component';
import { ChannelAlbumComponent } from './channel-album/channel-album.component';
import { ChannelStreamComponent } from './channel-stream/channel-stream.component';
import { ChannelHomeComponent } from './channel-home/channel-home.component';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import {StatsModule} from "../shared/stats/stats.module";
import {routing} from "./free-air.routing";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
//import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CarouselModule} from "ngx-bootstrap";
import {VideoLiveModule} from "../shared/videolive/videolive.module";
import {VideoPrerecordModule} from "../shared/videopre-record/videopre-record.module";
import { VideosManagerComponent } from './videos-manager/videos-manager.component';
// import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { VideoManagerQComponent } from './video-manager-q/video-manager-q.component';
import { ChannelManagerComponent } from './channel-manager/channel-manager.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    routing,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    StatsModule,
    SmartadminDatatableModule,
    CarouselModule,
    VideoLiveModule,
    VideoPrerecordModule
  ],
  declarations: [
    ChannelVideoComponent,
    ChannelAlbumComponent,
    ChannelStreamComponent,
    ChannelHomeComponent,
    VideosManagerComponent,
<<<<<<< HEAD
    // FileSelectDirective, 
    // FileDropDirective, 
    VideoManagerQComponent, 
=======
    FileSelectDirective, 
    FileDropDirective, VideoManagerQComponent, ChannelManagerComponent, 
>>>>>>> 0e8456e8d774657d5f08b85992b1f7474c6944f6
  ]
})
export class FreeAirModule { }

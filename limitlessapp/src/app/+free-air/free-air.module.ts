import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OrdersComponent } from './orders/orders.component';
import { ChannelVideoComponent } from './channel-video/channel-video.component';
import { ChannelAlbumComponent } from './channel-album/channel-album.component';
import { ChannelStreamComponent } from './channel-stream/channel-stream.component';
import { ChannelHomeComponent } from './channel-home/channel-home.component';
import { SmartadminLayoutModule } from "../shared/layout/layout.module";
import { SmartadminWidgetsModule } from "../shared/widgets/smartadmin-widgets.module";
import { StatsModule } from "../shared/stats/stats.module";
import { routing } from "./free-air.routing";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
//import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from "ngx-bootstrap";
import { VideoLiveModule } from "../shared/videolive/videolive.module";
import { VideoPrerecordModule } from "../shared/videopre-record/videopre-record.module";
import { VideosManagerComponent } from './videos-manager/videos-manager.component';
import { FileUploadModule } from 'ng2-file-upload';
import { VideoManagerQComponent } from './video-manager-q/video-manager-q.component';
import { ChannelManagerComponent } from './channel-manager/channel-manager.component';
import { JournalComponent } from './journal/journal.component';
import { NewJournalComponent } from './journal/new-journal/new-journal.component';
import { JournalSettingsComponent } from './journal/journal-settings/journal-settings.component';
import { JournalDeviceComponent } from './journal/journal-device/journalDevice.component';
import { JournalManagerComponent } from './journal/journal-manager/journal-manager.component';
import { PlatformUploadComponent } from './video-manager-q/platform-upload/platform-upload.component';
import { FbLiveManagerComponent } from './video-manager-q/fb-live-manager/fb-live-manager.component';
import { PlaylistVideojsComponent } from './playlist-videojs/playlist-videojs.component';
import { FbVideoUploadComponent } from './video-manager-q/fb-video-upload/fb-video-upload.component';
import { JournalStreamComponent } from './journal-stream/journal-stream.component';
import { LogoAdsComponent } from './ads-manager/logo-ads/logo-ads.component';
import { AssignAdsComponent } from './ads-manager/assign-ads/assign-ads.component';
import { PlatformManagerComponent } from './platform-manager/platform-manager.component';
import { AssignAdsAutoComponent } from './ads-manager/assign-ads-auto/assign-ads-auto.component';

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
    VideoPrerecordModule, 
    FileUploadModule
  ],
  declarations: [
    ChannelVideoComponent,
    ChannelAlbumComponent,
    ChannelStreamComponent,
    ChannelHomeComponent,
    VideosManagerComponent,
    ChannelManagerComponent,
    VideoManagerQComponent,
    JournalComponent,
    JournalDeviceComponent,
    JournalManagerComponent,
    JournalSettingsComponent,
    PlatformUploadComponent,
    FbLiveManagerComponent,
    PlaylistVideojsComponent,
    FbVideoUploadComponent,
    JournalStreamComponent,
    LogoAdsComponent,
    AssignAdsComponent,
    PlatformManagerComponent,
    AssignAdsAutoComponent
  ]
})
export class FreeAirModule { }

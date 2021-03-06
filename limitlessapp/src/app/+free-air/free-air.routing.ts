import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

import {ChannelVideoComponent} from "./channel-video/channel-video.component";
import {ChannelAlbumComponent} from "./channel-album/channel-album.component";
import {ChannelStreamComponent} from "./channel-stream/channel-stream.component";
import { ChannelRecordComponent } from './channel-record/channel-record.component';
import {ChannelHomeComponent} from "./channel-home/channel-home.component";
import {VideosManagerComponent} from './videos-manager/videos-manager.component';
import {VideoManagerQComponent} from './video-manager-q/video-manager-q.component';
import {ChannelManagerComponent} from './channel-manager/channel-manager.component';
import {JournalComponent} from './journal/journal.component';
import { JournalDeviceComponent } from "./journal/journal-device/journalDevice.component";
import { JournalManagerComponent } from './journal/journal-manager/journal-manager.component';
import {JournalSettingsComponent} from './journal/journal-settings/journal-settings.component';
import {PlatformUploadComponent} from './video-manager-q/platform-upload/platform-upload.component';
import {FbLiveManagerComponent} from './video-manager-q/fb-live-manager/fb-live-manager.component';
import { PlaylistVideojsComponent } from "./playlist-videojs/playlist-videojs.component";
import { FbVideoUploadComponent } from './video-manager-q/fb-video-upload/fb-video-upload.component';
import { JournalStreamComponent } from './journal-stream/journal-stream.component';
import { LogoAdsComponent } from './ads-manager/logo-ads/logo-ads.component';
import { PlatformManagerComponent } from './platform-manager/platform-manager.component';
import { AssignAdsComponent } from './ads-manager/assign-ads/assign-ads.component';
import { AssignAdsAutoComponent } from './ads-manager/assign-ads-auto/assign-ads-auto.component';
import { VideoAdsComponent } from './ads-manager/video-ads/video-ads.component';
import { AssignVideoAdsComponent } from "app/+free-air/ads-manager/assign-video-ads/assign-video-ads.component";
import { EditAssignedAdsComponent } from "app/+free-air/ads-manager/edit-assigned-ads/edit-assigned-ads.component";
import {SuperUserComponent} from "./super-user/super-user.component";

export const routes:Routes = [
  {
    path: 'channel-video',
    component: ChannelVideoComponent
  }
  ,
  {
    path: 'channel-album',
    component: ChannelAlbumComponent
  }
  ,
  {
    path: 'channel-stream',
    component: ChannelStreamComponent
  },
  {
    path: 'channel-home',
    component: ChannelHomeComponent
  },
  {
    path: 'videos-manager',
    component: VideosManagerComponent
  },
  {
    path: 'videoq',
    component: VideoManagerQComponent
  },
  {
    path: 'channel-manager',
    component: ChannelManagerComponent
  },
  {
    path: 'journal',
    component: JournalComponent
  },
  {
    path: 'journal-device',
    component: JournalDeviceComponent
  },
  {
    path: 'journal-manager',
    component: JournalManagerComponent
  },
  {
    path: 'journal-settings',
    component: JournalSettingsComponent
  },
  {
    path: 'platform-upload',
    component: PlatformUploadComponent
  },
  {
    path: 'fb-live',
    component: FbLiveManagerComponent
  },
  {
    path: 'playlist-videojs',
    component: PlaylistVideojsComponent
  },
  {
    path: 'fb-video',
    component: FbVideoUploadComponent
  },
  {
    path:'journal-stream',
    component:JournalStreamComponent,
  },
  {
    path: 'logo-ads',
    component: LogoAdsComponent
  },
  {
    path: 'platform-manager',
    component: PlatformManagerComponent,
  },
  {
    path: 'assign-ads',
    component: AssignAdsComponent
  },
  {
    path: 'assign-ads-auto',
    component: AssignAdsAutoComponent
  },
  {
    path: 'video-ads',
    component: VideoAdsComponent
  },
  {
    path: 'assign-video-ads',
    component: AssignVideoAdsComponent
  },
  {
    path: 'channel-live-record',
    component: ChannelRecordComponent
  },
  {
    path: 'edit-assigned-ads',
    component: EditAssignedAdsComponent
  },
  {
    path:'super-user',
    component:SuperUserComponent
  }
];

export const routing = RouterModule.forChild(routes)
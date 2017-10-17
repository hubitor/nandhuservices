import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

import {ChannelVideoComponent} from "./channel-video/channel-video.component";
import {ChannelAlbumComponent} from "./channel-album/channel-album.component";
import {ChannelStreamComponent} from "./channel-stream/channel-stream.component";
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
  }
];

export const routing = RouterModule.forChild(routes)
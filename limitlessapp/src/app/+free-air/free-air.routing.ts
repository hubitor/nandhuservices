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
  }
];

export const routing = RouterModule.forChild(routes)
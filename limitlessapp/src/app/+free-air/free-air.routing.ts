import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

import {ChannelVideoComponent} from "./channel-video/channel-video.component";
import {ChannelAlbumComponent} from "./channel-album/channel-album.component";
import {ChannelStreamComponent} from "./channel-stream/channel-stream.component";

export const routes:Routes = [
//   {
//     path: 'orders',
//     component: OrdersComponent
//   },
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
  }
];

export const routing = RouterModule.forChild(routes)
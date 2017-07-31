import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";
import {BroadcasterComponent} from "./broadcaster/broadcaster.component";

export const routes:Routes = [
  {
    path: 'broadcaster',
    component: BroadcasterComponent
  }
  ,
//   {
//     path: 'channel-album',
//     component: ChannelAlbumComponent
//   }
//   ,
//   {
//     path: 'channel-stream',
//     component: ChannelStreamComponent
//   }
];

export const Adminrouting = RouterModule.forChild(routes)
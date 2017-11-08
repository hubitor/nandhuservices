import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";
import {BroadcasterComponent} from "./broadcaster/broadcaster.component";
import {EshopComponent} from "./eshop/eshop.component";
import {RegistrationComponent} from "./registration/registration.component";
import {DestinationComponent} from "./destination/destination.component";
export const routes:Routes = [
  {
    path: 'broadcaster',
    component: BroadcasterComponent
  },
  {
    path: 'eshop',
    component: EshopComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
//   {
//     path: 'channel-album',
//     component: ChannelAlbumComponent
//   }
//   ,
//   {
//     path: 'channel-stream',
//     component: ChannelStreamComponent
//   }
  {
  path: 'destination',
  component: DestinationComponent
  }
];

export const Adminrouting = RouterModule.forChild(routes)
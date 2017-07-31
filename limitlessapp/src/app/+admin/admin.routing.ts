import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";
import {BroadcasterComponent} from "./broadcaster/broadcaster.component";
import {EShopComponent} from "./eshop/eshop.component";

export const routes:Routes = [
  {
    path: 'broadcaster',
    component: BroadcasterComponent
  }
  ,
  {
    path: 'eshop',
    component: EShopComponent
  }
//   ,
//   {
//     path: 'channel-stream',
//     component: ChannelStreamComponent
//   }
];

export const Adminrouting = RouterModule.forChild(routes)
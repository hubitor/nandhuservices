/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    
    data: {pageTitle: 'Home'},
    children: [
      {
        path: '', redirectTo: 'auth/login', pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: 'app/+admin/admin.module#AdminModule',
        data: {pageTitle: 'LLC-Master'}
      },
      
      {
        path: 'llc-master',
        loadChildren: 'app/+llc-master/llc-master.module#LlcMasterModule',
        data: {pageTitle: 'LLC-Master'}
      },
      {
        path: 'free-air',
        loadChildren: 'app/+free-air/free-air.module#FreeAirModule',
        data: {pageTitle: 'Broadcaster'}
      }
    ]
  },

  {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

  {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});

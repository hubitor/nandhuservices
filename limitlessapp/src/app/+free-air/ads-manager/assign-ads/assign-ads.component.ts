import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { LogoAds } from '../../../shared/models/logo-ads';
import { AdsService } from '../../../shared/server/service/ads.service';

@Component({
  selector: 'app-assign-ads',
  templateUrl: './assign-ads.component.html',
  providers: [BroadcasterService]
})
export class AssignAdsComponent implements OnInit {
  assignAdForm;
  targetPlatforms: string[] = ['Youtube', 'Facebook', 'Twitter'];
  selectedDestination: string;
  adPlacement: string[] = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
  broadcastingTypes: string[] = ['Short Events', '24/7', 'VoD'];
  loginResponse: LoginResponse;
  broadcasterId: number;
  appName: string;
  logoAds: LogoAds[];
  adTypes: string[] = ['LOGO', 'VIDEO', 'L-BAND', 'BOTTOM-BAR', 'SLIDE'];
  adType: string;
  broadcasterChannels: BroadcasterChannel[];
  channelId: number;
  showLogoAdAssigner: boolean;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService) { 
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.appName = localStorage.getItem("w_appname");
    this.showLogoAdAssigner = false;
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.assignAdForm = this.fb.group({

    });
  }

  getBroadcasterChannels(){
    this.broadcasterService.getChannelsByBroadcasterId(this.broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        console.log(this.broadcasterChannels);
      },
      err => {
        console.log(err);
        alert('something went wrong');
      }
    );
  }

  onChannelSelect(channelId: number){
    this.channelId = channelId;
  }

  onAdTypeSelect(adType: string){
    this.adType = adType;
    if(adType === 'LOGO'){
      this.showLogoAdAssigner = true;
    }
  }

}

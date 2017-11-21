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
  providers: [BroadcasterService, AdsService]
})
export class AssignAdsComponent implements OnInit {
  assignAdForm;
  targetPlatforms: string[] = ['Youtube', 'Facebook', 'Twitter'];
  selectedDestination: string;
  adPlacements: string[] = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
  //broadcastingTypes: string[] = ['Short Events', '24/7', 'VoD'];
  broadcastingTypes: string[] = ['Short Events'];
  selectedBroadcastingType: string;
  loginResponse: LoginResponse;
  broadcasterId: number;
  appName: string;
  logoAds: LogoAds[];
  adTypes: string[] = ['LOGO', 'VIDEO', 'L-BAND', 'BOTTOM-BAR', 'SLIDE'];
  adType: string;
  broadcasterChannels: BroadcasterChannel[];
  channelId: number;
  showLogoAdAssigner: boolean;
  shortEvent: boolean;
  _24x7: boolean;
  vod: boolean;
  logoAdWindows: number[] = [1, 2, 3, 5, 6, 10, 15, 20, 30, 45, 60];
  logoAdWindow: number;
  noOfLogoAdTimeSlots: number;
  logoAdTimeSlots: number[];
  showLogoAdSlotsClicked: boolean;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService, private adsService: AdsService) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.appName = localStorage.getItem("w_appname");
    this.showLogoAdAssigner = false;
    this.shortEvent = true;
    this._24x7 = false;
    this.vod = false;
    this.logoAdTimeSlots = new Array();
    this.showLogoAdSlotsClicked = false;
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.assignAdForm = this.fb.group({
      eventDate: [null, [Validators.required]],
      eventDurationHrs: [null, [Validators.required]],
      eventStartTime: [null, [Validators.required]],
      eventEndTime: [null, [Validators.required]]
    });
  }

  getBroadcasterChannels() {
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

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
    this.getLogoAdsByChannelId(this.channelId);
  }

  onAdTypeSelect(adType: string) {
    this.adType = adType;
    if (adType === 'LOGO') {
      this.showLogoAdAssigner = true;
    }
  }

  onBroadcastingTypeSelect(btype: string) {
    this.selectedBroadcastingType = btype;
    if (this.selectedBroadcastingType === 'Short Events') {
      this.shortEvent = true;
      this._24x7 = false;
      this.vod = false;
    } else if (this.selectedBroadcastingType === '24x7') {
      this._24x7 = true;
      this.shortEvent = false;
      this.vod = false;
    }
  }

  onLogoAdWindowSelect(logoAdWindow: number) {
    this.logoAdWindow = logoAdWindow;
  }

  getLogoAdsByChannelId(channelId: number){
    this.adsService.getLogoAdsByChannelId(channelId).subscribe(
      logoAds => {
        this.logoAds = logoAds;
        console.log(this.logoAds);
      },
      err => {
        console.log(err);
      }
    );
  }

  onShowTimeSlotsClick() {
    this.showLogoAdSlotsClicked = true;
    this.logoAdTimeSlots.length = 0;
    const logoAdAssinger = this.assignAdForm.value;
    var duration: string = logoAdAssinger.eventDurationHrs;
    var splitter: string[] = duration.split(':');
    var durationHrs = splitter[0];
    var durationMins = splitter[1];
    var hours: number = parseInt(durationHrs);
    var minutes: number = parseInt(durationMins);
    var hoursInMins: number = hours * 60;
    var totalDurationInMins: number = hoursInMins + minutes;
    this.noOfLogoAdTimeSlots = Math.round(totalDurationInMins / this.logoAdWindow);
    for(var i=0; i<this.noOfLogoAdTimeSlots; i++){
      this.logoAdTimeSlots.push(i);
    }
  }

}

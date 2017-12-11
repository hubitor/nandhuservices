import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { LogoAds } from '../../../shared/models/logo-ads';
import { AdsService } from '../../../shared/server/service/ads.service';
import { AdEvent } from '../../../shared/models/ad-event';
import { AssignLogoAds } from 'app/shared/models/assign-logo-ads';
import { CreateResponse } from 'app/shared/models/createResponse';
import { NotificationService } from "../../../shared/utils/notification.service";

@Component({
  selector: 'app-assign-ads',
  templateUrl: './assign-ads.component.html',
  providers: [BroadcasterService, AdsService]
})
export class AssignAdsComponent implements OnInit {
  assignAdForm;
  targetPlatforms: string[] = ['youtube', 'facebook', 'twitter'];
  selectedDestination: string;
  adPlacements: string[] = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
  broadcastingTypes: string[] = ['Short Event', '24/7', 'VoD'];
  //broadcastingTypes: string[] = ['Short Events'];
  selectedBroadcastingType: string;
  loginResponse: LoginResponse;
  broadcasterId: number;
  appName: string;
  logoAds: LogoAds[];
  adTypes: string[] = ['LOGO', 'VIDEO', 'L_BAND', 'BOTTOM_BAR', 'SLIDE'];
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
  adEvent: AdEvent;
  assignLogoAds: AssignLogoAds[];
  assignLogoAd: AssignLogoAds;
  createResponse: CreateResponse;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService, private adsService: AdsService, private elementRef: ElementRef, private notificationService: NotificationService) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.appName = localStorage.getItem("w_appname");
    this.appName="ka-mob-dev";
    this.showLogoAdAssigner = false;
    this.shortEvent = true;
    this._24x7 = false;
    this.vod = false;
    this.logoAdTimeSlots = new Array();
    this.showLogoAdSlotsClicked = false;
    this.adEvent = new AdEvent();
    this.assignLogoAds = new Array();
    this.logoAds = new Array();
    this.createResponse = new CreateResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.assignAdForm = this.fb.group({
      eventName: [null, [Validators.required]],
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
    if (this.selectedBroadcastingType === 'Short Event') {
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

    for(var i=0; i<this.noOfLogoAdTimeSlots; i++){
      this.assignLogoAd = new AssignLogoAds();
      let logoAdSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#logoAdSelect-'+i);
      let adPlcementSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#placementSelect-'+i);
      let adTargetSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#adTargetSelect-'+i);
      if(logoAdSelect.value != 'NONE' && adPlcementSelect.value != 'NONE' && adTargetSelect.value != 'NONE'){
        let logoAdSelectSplitter = logoAdSelect.value.split(',');
        let logoAdId: number = parseInt(logoAdSelectSplitter[0]);
        let logoAdImgName: string = logoAdSelectSplitter[1];
        let logoAdFtpPath: string = logoAdSelectSplitter[2];
        this.assignLogoAd.logo_ad_id = logoAdId;
        this.assignLogoAd.img_name = logoAdImgName;
        this.assignLogoAd.logo_ftp_path = logoAdFtpPath;
        this.assignLogoAd.ad_type = logoAdSelect.value;
        let startTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#startTime-'+i);
        let endTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#endTime-'+i);
        let overlaytext: HTMLInputElement = this.elementRef.nativeElement.querySelector('#overlaytext-'+i);
        startTime.innerText=this.assignAdForm.eventStartTime.value;
        endTime.innerText=this.assignAdForm.eventStartTime.value + this.logoAdWindow ;
       
      }
    }
  }

  calculateStartTime()
  {
    return Math.round((parseInt(this.assignAdForm.eventStartTime.value) * 60 + this.logoAdWindow)/60);
  }

  calculateEndTime()
  {
    return Math.round((parseInt(this.assignAdForm.eventEndTime.value) * 60 - this.logoAdWindow)/60);
  }

  onAssignLogoAds() {
    this.showPopup();
  }
  showPopup() {    
        this.notificationService.smartMessageBox({
          title:  "Assign Ads",
          content: "Do you want to create a time slots for this event?",
          buttons: '[No][Yes]'
    
        }, (ButtonPressed) => {
          if (ButtonPressed == "Yes") {
            this.onAssignLogoAdsClick();
          }
        });
      }

      Alert(message:string,title:string) {    
        this.notificationService.smartMessageBox({
          title:  title,
          content: message,
          buttons: '[Ok]'
    
        }, (ButtonPressed) => {
          if (ButtonPressed == "Ok") {
            return false;
          }
        });
      }



  onAssignLogoAdsClick(){
    
    // for(var i=0; i<this.noOfLogoAdTimeSlots; i++){
    //   let val: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#logoAdSelect-'+i)
    //   console.log(val.value);
    // }
    
    const logoAdEventAssigner = this.assignAdForm.value;
    this.adEvent.channel_id = this.channelId;
    this.adEvent.event_type = this.selectedBroadcastingType;
    this.adEvent.event_name = logoAdEventAssigner.eventName;
    this.adEvent.ad_type = this.adType;
    this.adEvent.duration = logoAdEventAssigner.eventDurationHrs;
    this.adEvent.date = logoAdEventAssigner.eventDate;
    this.adEvent.start_time = logoAdEventAssigner.eventStartTime;
    this.adEvent.end_time = logoAdEventAssigner.eventEndTime;
    this.adEvent.ad_window_time_pa = this.logoAdWindow;
    this.adEvent.is_active = true;
    this.adEvent.created_by = this.loginResponse.user_name;
    this.adEvent.updated_by = this.loginResponse.user_name;
    for(var i=0; i<this.noOfLogoAdTimeSlots; i++){
      this.assignLogoAd = new AssignLogoAds();
      let logoAdSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#logoAdSelect-'+i);
      let adPlcementSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#placementSelect-'+i);
      let adTargetSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#adTargetSelect-'+i);
      //if(logoAdSelect.value != 'NONE' && adPlcementSelect.value != 'NONE' && adTargetSelect.value != 'NONE'){
        let logoAdSelectSplitter = logoAdSelect.value.split(',');
        let logoAdId: number = parseInt(logoAdSelectSplitter[0]);
        let logoAdImgName: string = logoAdSelectSplitter[1];
        let logoAdFtpPath: string = logoAdSelectSplitter[2];
        this.assignLogoAd.logo_ad_id = logoAdId;
        this.assignLogoAd.img_name = logoAdImgName;
        this.assignLogoAd.logo_ftp_path = logoAdFtpPath;
        let startTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#startTime-'+i);
        let endTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#endTime-'+i);
        let overlaytext: HTMLInputElement = this.elementRef.nativeElement.querySelector('#overlaytext-'+i);
        
        this.assignLogoAd.time_slot_start = startTime.value;
        
        this.assignLogoAd.time_slot_end = endTime.value;
        
        this.assignLogoAd.ad_placement = adPlcementSelect.value;
        this.assignLogoAd.ad_target = adTargetSelect.value;
        this.assignLogoAd.created_by = this.loginResponse.user_name;
        this.assignLogoAd.updated_by = this.loginResponse.user_name;
        this.assignLogoAd.lower_text=overlaytext.value;
        this.assignLogoAd.geo_x_coordinate = 'NIL';
        this.assignLogoAd.geo_y_coordinate = 'NIL';
        this.assignLogoAds.push(this.assignLogoAd);
        this.assignLogoAd = null;
      //}
    }
    this.adEvent.assignLogoAds = this.assignLogoAds;
    const slotStarttime = (this.assignLogoAds || []).map(x => x.time_slot_start);
    const slotEndtime = (this.assignLogoAds || []).map(x => x.time_slot_end);
    var s_start_time = slotStarttime.filter((st) => st < this.adEvent.start_time);
    var s_end_time = slotEndtime.filter((et) => et > this.adEvent.end_time);
    console.log(s_start_time);
    console.log(s_end_time);
    
    if(s_start_time.length>0)
       this.Alert("Slot Start time should be greater than Assign Start Time.","Validation");

    if(s_end_time.length>0)
       this.Alert("Slot End time should not be greater than Assign End Time.","Validation");

    this.adsService.assignLogoAds(this.adEvent).subscribe(
      createResponse => {
        this.createResponse = createResponse;
        location.reload();
      },
      error => {
        console.log(error);
      }
    );
  }

}

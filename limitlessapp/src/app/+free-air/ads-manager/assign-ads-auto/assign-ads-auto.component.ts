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
import { AdSlotIndex } from 'app/shared/models/ui-models/ad-slot-index';
import { Time } from 'ngx-bootstrap/timepicker/timepicker.models';
import { fadeInLeft } from 'app/shared/animations/router.animations';
import { DatePipe } from '@angular/common';
import {FadeInTop} from "app/shared/animations/fade-in-top.decorator";


@Component({
  selector: 'app-assign-ads-auto',
  templateUrl: './assign-ads-auto.component.html',
  providers: [BroadcasterService,DatePipe, AdsService]
})
export class AssignAdsAutoComponent implements OnInit {
  assignAdForm;
  assignAdOverlayTextForm;
  targetPlatforms: string[] = ['youtube', 'facebook', 'twitter','website','android','ios'];
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
  logoAdTxtFontSize: number[] = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
  logoAdTxtFontName:string[]=["Calibri","Calibri Light","Arial","Arial Black","Bodoni MT Black","Courier New","Lucida Bright","Lucida Sans","Times New Roman","Verdana"]
  logoAdTxtFontStyle:string[]=["Bold","Italic","Underline"]
  logoAdTxtOpacity: number[] = [1, 2, 3, 5, 6, 10, 15, 20, 30, 45, 60];
  logoAdTxtFontColor:string[]=["Black","White","Red","Lime","Blue","Yellow","Cyan","Magenta","Silver","Gray","Maroon","Olive","Green","Purple","Teal","Navy"]
  logoAdWindow: number;
  noOfLogoAdTimeSlots: number;
  logoAdTimeSlots: number[];
  showLogoAdSlotsClicked: boolean;
  adEvent: AdEvent;
  assignLogoAds: AssignLogoAds[];
  assignLogoAd: AssignLogoAds;
  createResponse: CreateResponse;
  startTimeSlots: string[];
  endTimeSlots: string[];
  eventStartTime: string;
  eventEndTime: string;
  slotStartTime: string;
  slotEndTime: string;
  eventDate: string;
  adSlotIndexs: AdSlotIndex[];
  adSlotIndex: AdSlotIndex;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService, private adsService: AdsService, private elementRef: ElementRef, private notificationService: NotificationService,private datePipe: DatePipe) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.appName = localStorage.getItem("w_appname");
    this.appName = "ka-mob-dev";
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
    this.startTimeSlots = new Array();
    this.endTimeSlots = new Array();
    this.adSlotIndex = new AdSlotIndex();
    this.adSlotIndexs = new Array();
    this.handleChange = this.handleChange.bind(this);
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    var today_date=new Date().toLocaleDateString();
    var newKeyDate = this.datePipe.transform(today_date, 'MM/dd/yyyy');
        this.assignAdForm = this.fb.group({
      eventName: [null, [Validators.required]],
      eventDate: [null, [Validators.required]],
      eventDurationHrs: [null, [Validators.required]],
      eventStartTime: [null, [Validators.required]],
      eventEndTime: [null, [Validators.required]]
     
    });

    // this.assignAdOverlayTextForm = this.fb.group({
      
    //   overlayText: [null, [Validators.required]],
    //   positionTop: [null, [Validators.required]],
    //   positionBottom: [null, [Validators.required]],
    //   positionLeft: [null, [Validators.required]],
    //   positionRight: [null, [Validators.required]]
    // });
  }

  overlayTextApply()
  {
    //var form_value=this.assignAdOverlayTextForm.value;
    
    let OverlayTextbox: HTMLInputElement = this.elementRef.nativeElement.querySelector('#OverlayText');
    let overlayText: HTMLLabelElement = this.elementRef.nativeElement.querySelector('#overlayImageText');
    let positionTop: HTMLInputElement = this.elementRef.nativeElement.querySelector('#positionTop');
    let positionBottom: HTMLInputElement = this.elementRef.nativeElement.querySelector('#positionBottom');
    let positionLeft: HTMLInputElement = this.elementRef.nativeElement.querySelector('#positionLeft');
    let positionRight: HTMLInputElement = this.elementRef.nativeElement.querySelector('#positionRight');
    overlayText.style.position="absolute";
    overlayText.style.bottom=+positionBottom.value +"px";
    overlayText.style.left=+positionLeft.value+"px";
    overlayText.innerHTML=OverlayTextbox.value;
    //overlayText.style.top=+positionTop.value +"px";
    //overlayText.style.right=+positionRight.value+"px";
    
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
    //this.assignAdForm.get('eventDate').setValue("12/04/2017");
  }

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
    this.getLogoAdsByChannelId(this.channelId);
  }

  onAdTypeSelect(adType: string) {
    this.adType = adType;
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

  getLogoAdsByChannelId(channelId: number) {
    this.adsService.getLogoAdsByChannelId(channelId).subscribe(
      logoAds => {
        this.logoAds = logoAds;
        console.log(this.logoAds);
      },
      err => {
        console.log(err);
      }
    );
  };
  
  handleChange(event)
  {
    
    var s_time=this.assignAdForm.value.eventStartTime;
    var duration_hour=+this.assignAdForm.value.eventDurationHrs.split(':')[0];
    var duration_minute=+this.assignAdForm.value.eventDurationHrs.split(':')[1];
    if(s_time!=null && s_time.length>0)
    {
      var s_time_hour=+s_time.split(':')[0];
      var s_time_minute=+s_time.split(':')[1];
      var t_min=(duration_minute+s_time_minute).toString();
      if(+t_min<10)
      {
        t_min="0"+t_min;
      }
      var e_time;
      if(duration_hour ==24)
        e_time="23:59"
      else
        e_time=((s_time_hour+duration_hour)+":"+ t_min).toString();  
     
      this.assignAdForm.get('eventEndTime').setValue(e_time);
      this.onShowTimeSlotsClick()
    }
   
  };
 

  validatedurationHours(duration:string,st:string,et:string)
  {
    var hr=+duration.split(':')[0];
    var d_hour =+hr *60;
    var d_minute =+duration.split(':')[1];
    var s_t_hour=+st.split(':')[0];
    var s_t_minute=+st.split(':')[1];
    var e_t_hour=+et.split(':')[0];
    var e_t_minute=+et.split(':')[1];

    var diff_hours=(e_t_hour-s_t_hour)*60;
    var diff_minutes=e_t_minute-s_t_minute;

    var total_minutes_duration=d_hour+d_minute;
    var total_minutes_difftime=diff_hours+diff_minutes;
    if(+hr == 24)
        return true
    
    if(total_minutes_difftime === total_minutes_duration)
       return true;
    else 
      return false;
  }

 

  onShowTimeSlotsClick() {
    const logoAdAssinger = this.assignAdForm.value;
    if(this.validatedurationHours(logoAdAssinger.eventDurationHrs,logoAdAssinger.eventStartTime,logoAdAssinger.eventEndTime))
    {
      this.showLogoAdSlotsClicked = true;
      this.adSlotIndexs.length = 0;
     
      var duration: string = logoAdAssinger.eventDurationHrs;
      this.eventStartTime = logoAdAssinger.eventStartTime;
      this.slotStartTime = this.eventStartTime;
      this.eventDate = logoAdAssinger.eventDate;
      var splitter: string[] = duration.split(':');
      var durationHrs = splitter[0];
      var durationMins = splitter[1];
      var hours: number = parseInt(durationHrs);
      var minutes: number = parseInt(durationMins);
      var hoursInMins: number = hours * 60;
      var totalDurationInMins: number = hoursInMins + minutes;
      this.noOfLogoAdTimeSlots = Math.round(totalDurationInMins / this.logoAdWindow);
      console.log(this.logoAdWindow * 60000);
      let slotStartTime = this.slotStartTime;
      for (var i: number = 0; i < this.noOfLogoAdTimeSlots; i++) {
        this.adSlotIndex = new AdSlotIndex();
        this.adSlotIndex.index = i;
        

        let startTime: Date = new Date(this.eventDate + 'T' + slotStartTime);
        let endTime: Date = new Date(startTime.getTime() + (this.logoAdWindow * 60000));
        var t_start_time=startTime.getMinutes().toString();
        if(+t_start_time<10)
        {
          t_start_time="0"+t_start_time;
        }

        var t_start_time_hour=startTime.getHours().toString();
        if(+t_start_time_hour<10)
        {
          t_start_time_hour="0"+t_start_time_hour;
        }

        var t_end_time=endTime.getMinutes().toString();
        if(+t_end_time<10)
        {
          t_end_time="0"+t_end_time;
        }

        var t_end_time_hour=endTime.getHours().toString();
        if(+t_end_time_hour<10)
        {
          t_end_time_hour="0"+t_end_time_hour;
        }

        this.adSlotIndex.slotStartTime = t_start_time_hour + ':' + t_start_time;
        this.adSlotIndex.slotEndTime = t_end_time_hour + ':' + t_end_time;
        this.adSlotIndex.isDuplicate = false;
        slotStartTime = t_end_time_hour + ':' + t_end_time;
        //slotStartTime = endTime.toLocaleTimeString();
        this.adSlotIndexs.push(this.adSlotIndex);
        this.adSlotIndex = null;
      }
    }
    else{
      this.Alert('The total duration should be match with start and end timings','Validation')
    }
  }

  onDuplicateSlotClick(slotIndex: number) {
    // let duplicateSlotButton: HTMLButtonElement = this.elementRef.nativeElement.querySelector("#duplicateSlot");
    // console.log(duplicateSlotButton);
    let slotToDuplicate: number = slotIndex;
    for (let i: number = 0; i < this.noOfLogoAdTimeSlots; i++) {
      if(i == slotToDuplicate){
        this.adSlotIndex = new AdSlotIndex();
        this.adSlotIndex.index = this.adSlotIndexs.length;
        this.adSlotIndex.slotStartTime = this.adSlotIndexs[i].slotStartTime;
        this.adSlotIndex.slotEndTime = this.adSlotIndexs[i].slotEndTime;
        this.adSlotIndex.isDuplicate = true;
        this.adSlotIndexs.push(this.adSlotIndex);
        this.adSlotIndex = null;
      }
    }
    this.noOfLogoAdTimeSlots = this.adSlotIndexs.length;
    console.log(this.adSlotIndexs.length);
    console.log(this.adSlotIndexs);
  }

  onRemoveDuplicateClick(slotIndex: number) {
    console.log(slotIndex);
    this.adSlotIndexs.splice(slotIndex, 1);
    this.noOfLogoAdTimeSlots = this.adSlotIndexs.length;
    console.log(this.adSlotIndexs);
  }

  onAssignLogoAds() {
    this.showPopup();
  }
  showPopup() {
    this.notificationService.smartMessageBox({
      title: "Assign Ads",
      content: "Do you want to create a time slots for this event?",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        this.onAssignLogoAdsClick();
      }
    });
  }

  Alert(message: string, title: string) {
    this.notificationService.smartMessageBox({
      title: title,
      content: message,
      buttons: '[Ok]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Ok") {
        return false;
      }
    });
  }

  onAssignLogoAdsClick() {
    
    // for(var i=0; i<this.noOfLogoAdTimeSlots; i++){
    //   let val: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#logoAdSelect-'+i)
    //   console.log(val.value);
    // }

    const logoAdEventAssigner = this.assignAdForm.value;
    this.adEvent.channel_id = this.channelId;
    this.adEvent.event_type = this.selectedBroadcastingType;
    this.adEvent.event_name = logoAdEventAssigner.eventName;
    this.adEvent.duration = logoAdEventAssigner.eventDurationHrs;
    this.adEvent.date = logoAdEventAssigner.eventDate;
    this.adEvent.start_time = logoAdEventAssigner.eventStartTime;
    this.adEvent.end_time = logoAdEventAssigner.eventEndTime;
    this.adEvent.ad_window_time_pa = this.logoAdWindow;
    this.adEvent.is_active = true;
    this.adEvent.created_by = this.loginResponse.user_name;
    this.adEvent.updated_by = this.loginResponse.user_name;
    console.log(this.noOfLogoAdTimeSlots);
    for (var i = 0; i < this.noOfLogoAdTimeSlots; i++) {
      this.assignLogoAd = new AssignLogoAds();
      let adTypeSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#adTypeSelect-' + i);
      let logoAdSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#logoAdSelect-' + i);
      let adPlcementSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#placementSelect-' + i);
      let adTargetSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#adTargetSelect-' + i);
      console.log(adTypeSelect);
      console.log(logoAdSelect);
      console.log(adPlcementSelect);
      console.log(adTargetSelect);
      if (logoAdSelect.value != 'NONE' && adPlcementSelect.value != 'NONE' && adTargetSelect.value != 'NONE') {
        let logoAdSelectSplitter = logoAdSelect.value.split(',');
        let logoAdId: number = parseInt(logoAdSelectSplitter[0]);
        let logoAdImgName: string = logoAdSelectSplitter[1];
        let logoAdFtpPath: string = logoAdSelectSplitter[2];
        this.assignLogoAd.logo_ad_id = logoAdId;
        this.assignLogoAd.img_name = logoAdImgName;
        this.assignLogoAd.logo_ftp_path = logoAdFtpPath;
        let startTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#startTime-' + i);
        let endTime: HTMLInputElement = this.elementRef.nativeElement.querySelector('#endTime-' + i);
        let overlaytext: HTMLInputElement = this.elementRef.nativeElement.querySelector('#overlaytext-' + i);
        this.assignLogoAd.time_slot_start = startTime.value;
        this.assignLogoAd.time_slot_end = endTime.value;
        this.assignLogoAd.ad_placement = adPlcementSelect.value;
        this.assignLogoAd.ad_target = adTargetSelect.value;
        this.assignLogoAd.created_by = this.loginResponse.user_name;
        this.assignLogoAd.updated_by = this.loginResponse.user_name;
        this.assignLogoAd.lower_text = overlaytext.value;
        this.assignLogoAd.geo_x_coordinate = 'NIL';
        this.assignLogoAd.geo_y_coordinate = 'NIL';
        this.assignLogoAd.ad_type = adTypeSelect.value;
        this.assignLogoAds.push(this.assignLogoAd);
        this.assignLogoAd = null;
      }
    }
    this.adEvent.assignLogoAds = this.assignLogoAds;
    const slotStarttime = (this.assignLogoAds || []).map(x => x.time_slot_start);
    const slotEndtime = (this.assignLogoAds || []).map(x => x.time_slot_end);
    var s_start_time = slotStarttime.filter((st) => st < this.adEvent.start_time);
    var s_end_time = slotEndtime.filter((et) => et > this.adEvent.end_time);
    console.log(s_start_time);
    console.log(s_end_time);

    if (s_start_time.length > 0)
      this.Alert("Slot Start time should be greater than Assign Start Time.", "Validation");

    if (s_end_time.length > 0)
      this.Alert("Slot End time should not be greater than Assign End Time.", "Validation");

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

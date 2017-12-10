import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { AdsService } from '../../../shared/server/service/ads.service';
import { AppSettings } from "../../../shared/server/api/api-settings";
import { VideoAd } from '../../../shared/models/video-ad';
import { CreateResponse } from 'app/shared/models/createResponse';
import { AssignVideoAds } from 'app/shared/models/assign-video-ads';
import { VideoAdEvent } from 'app/shared/models/video-ad-event';

@Component({
  selector: 'app-assign-video-ads',
  templateUrl: './assign-video-ads.component.html',
  providers: [BroadcasterService, AdsService]
})
export class AssignVideoAdsComponent implements OnInit {
  assignVideoAdForm;
  assignVideoAds: AssignVideoAds[];
  assignVideoAd: AssignVideoAds;
  videoAds: VideoAd[];
  videoAd: VideoAd;
  videoAdEvent: VideoAdEvent;
  loginResponse: LoginResponse;
  broadcasterId: number;
  appName: string;
  broadcasterChannels: BroadcasterChannel[];
  targetPlatforms: string[] = ['youtube', 'facebook', 'twitter','website','android','ios'];
  noOfAds: number;
  showSlotsClicked: boolean;
  adsIndex: number[];
  channelId: number;
  eventDate: string;
  eventTime: string;
  createResponse: CreateResponse;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService, private adsService: AdsService, private elementRef: ElementRef) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem('broadcaster_id'));
    this.appName = localStorage.getItem('w_appname');
    this.videoAdEvent = new VideoAdEvent();
    this.assignVideoAds = new Array();
    this.broadcasterChannels = new Array();
    this.showSlotsClicked = false;
    this.adsIndex = Array();
    this.createResponse = new CreateResponse();
  }

  ngOnInit() {
    this.formInit();
    this.getBroadcasterChannels();
  }

  formInit() {
    this.assignVideoAdForm = this.fb.group({
      eventTitle: [null, [Validators.required]],
      eventDate: [null, [Validators.required]],
      noOfAds: [null, [Validators.required]]
    });
  }

  getBroadcasterChannels() {
    this.broadcasterService.getChannelsByBroadcasterId(this.broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
        alert('Something went wrong');
      }
    );
  }

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
    this.adsService.getVideoAdsbyChannelId(this.channelId).subscribe(
      ads => {
        this.videoAds = ads;
        console.log(this.videoAds);
      },
      error => {
        console.log(error);
      }
    );
  }

  onShowSlotsClick() {
    this.noOfAds = 0;
    this.adsIndex.length = 0;
    const eventProperty = this.assignVideoAdForm.value;
    let eventDateTime: string = eventProperty.eventDate;
    this.eventDate = eventDateTime.split('T')[0];
    this.eventTime = eventDateTime.split('T')[1];
    this.noOfAds = eventProperty.noOfAds;
    for(var i: number = 0; i<this.noOfAds; i++) {
      this.adsIndex.push(i);
    }
    //console.log(this.adsIndex);
    this.showSlotsClicked = true;
  }

  videoAdsAssign() {
    const assignAd = this.assignVideoAdForm.value;
    this.videoAdEvent.channel_id = this.channelId;
    this.videoAdEvent.event_name = assignAd.eventTitle;
    this.videoAdEvent.no_of_ads = this.noOfAds;
    this.videoAdEvent.date = this.eventDate;
    this.videoAdEvent.start_time = this.eventTime;
    this.videoAdEvent.is_active = true;
    this.videoAdEvent.created_by = this.loginResponse.user_name;
    this.videoAdEvent.updated_by = this.loginResponse.user_name;
    for(var i:number = 0; i<this.noOfAds; i++) {
      let videoAdSelect: HTMLSelectElement = this.elementRef.nativeElement.querySelector('#videoAdsSelect-'+i);
      let youtube: HTMLInputElement = this.elementRef.nativeElement.querySelector('#youtube-'+i);
      let facebook: HTMLInputElement = this.elementRef.nativeElement.querySelector('#facebook-'+i);
      let twitter: HTMLInputElement = this.elementRef.nativeElement.querySelector('#twitter-'+i);
      let android: HTMLInputElement = this.elementRef.nativeElement.querySelector('#android-'+i);
      let ios: HTMLInputElement = this.elementRef.nativeElement.querySelector('#ios-'+i);
      let videoAdId = videoAdSelect.value.split(',')[0];
      let videoAdLength = videoAdSelect.value.split(',')[1];
      let videoFtpPath = videoAdSelect.value.split(',')[2];
      let ftpPathString = videoFtpPath.split('/');
      let videoFileName = ftpPathString[ftpPathString.length - 1];
      if(youtube.checked) {
        this.assignVideoAd = new AssignVideoAds();
        this.assignVideoAd.video_ad_id = parseInt(videoAdId);
        this.assignVideoAd.ad_length = parseInt(videoAdLength);
        this.assignVideoAd.video_ftp_path = videoFtpPath;
        this.assignVideoAd.video_name = videoFileName;
        this.assignVideoAd.ad_target = 'youtube';
        this.assignVideoAd.created_by = this.loginResponse.user_name;
        this.assignVideoAd.updated_by = this.loginResponse.user_name;
        this.assignVideoAds.push(this.assignVideoAd);
        this.assignVideoAd = null;
      }
      if(facebook.checked) {
        this.assignVideoAd = new AssignVideoAds();
        this.assignVideoAd.video_ad_id = parseInt(videoAdId);
        this.assignVideoAd.ad_length = parseInt(videoAdLength);
        this.assignVideoAd.video_ftp_path = videoFtpPath;
        this.assignVideoAd.video_name = videoFileName;
        this.assignVideoAd.ad_target = 'facebook';
        this.assignVideoAd.created_by = this.loginResponse.user_name;
        this.assignVideoAd.updated_by = this.loginResponse.user_name;
        this.assignVideoAds.push(this.assignVideoAd);
        this.assignVideoAd = null;
      }
      if(twitter.checked) {
        this.assignVideoAd = new AssignVideoAds();
        this.assignVideoAd.video_ad_id = parseInt(videoAdId);
        this.assignVideoAd.ad_length = parseInt(videoAdLength);
        this.assignVideoAd.video_ftp_path = videoFtpPath;
        this.assignVideoAd.video_name = videoFileName;
        this.assignVideoAd.ad_target = 'twitter';
        this.assignVideoAd.created_by = this.loginResponse.user_name;
        this.assignVideoAd.updated_by = this.loginResponse.user_name;
        this.assignVideoAds.push(this.assignVideoAd);
        this.assignVideoAd = null;
      }
      if(android.checked) {
        this.assignVideoAd = new AssignVideoAds();
        this.assignVideoAd.video_ad_id = parseInt(videoAdId);
        this.assignVideoAd.ad_length = parseInt(videoAdLength);
        this.assignVideoAd.video_ftp_path = videoFtpPath;
        this.assignVideoAd.video_name = videoFileName;
        this.assignVideoAd.ad_target = 'android';
        this.assignVideoAd.created_by = this.loginResponse.user_name;
        this.assignVideoAd.updated_by = this.loginResponse.user_name;
        this.assignVideoAds.push(this.assignVideoAd);
        this.assignVideoAd = null;
      }
      if(ios.checked) {
        this.assignVideoAd = new AssignVideoAds();
        this.assignVideoAd.video_ad_id = parseInt(videoAdId);
        this.assignVideoAd.ad_length = parseInt(videoAdLength);
        this.assignVideoAd.video_ftp_path = videoFtpPath;
        this.assignVideoAd.video_name = videoFileName;
        this.assignVideoAd.ad_target = 'ios';
        this.assignVideoAd.created_by = this.loginResponse.user_name;
        this.assignVideoAd.updated_by = this.loginResponse.user_name;
        this.assignVideoAds.push(this.assignVideoAd);
        this.assignVideoAd = null;
      }
    }
    this.videoAdEvent.assignVideoAds = this.assignVideoAds;
    console.log(this.videoAdEvent);
    this.adsService.assignVideoAd(this.videoAdEvent).subscribe(
      createResponse => {
        this.createResponse = createResponse;
        location.reload();
      },
      error => {
        console.log(error);
        alert('something went wrong');
      }
    );
  }

}

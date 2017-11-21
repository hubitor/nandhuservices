import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { LogoAds } from '../../../shared/models/logo-ads';
import { VideoUploadResponse } from '../../../shared/models/videoUploadResponse';
import { AdsService } from '../../../shared/server/service/ads.service';

@Component({
  selector: 'app-logo-ads',
  templateUrl: './logo-ads.component.html',
  providers: [BroadcasterService, AdsService]
})
export class LogoAdsComponent implements OnInit {
  newLogoAdForm;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasterChannels: BroadcasterChannel[];
  channelId: number;
  public imageUploader: FileUploader;
  logoAds: LogoAds;
  appName: string;
  videoUploadResponse: VideoUploadResponse;

  constructor(private fb: FormBuilder, private cookieSevice: CookieService, private broadcasterService: BroadcasterService, private adsService: AdsService) { 
    this.loginResponse = new LoginResponse;
    this.loginResponse = JSON.parse(this.cookieSevice.get("HAU"));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.appName = localStorage.getItem("w_appname");
    this.logoAds = new LogoAds;
    this.imageUploader = new FileUploader({url: 'http://localhost:3000/ads/logo/image/'+this.appName, allowedMimeType:['image/png', 'image/jpg', 'image/jpeg', 'image/gif']});
    this.videoUploadResponse = new VideoUploadResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm(){
    this.newLogoAdForm = this.fb.group({
      logoAdTitle: [null, [Validators.required]]
    });
  }

  getBroadcasterChannels(){
    this.broadcasterService.getChannelsByBroadcasterId(this.broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
        alert('something went wrong');
      }
    );
  }

  onChannelSelect(channelId: number){
    this.channelId = channelId;
  }
  calculateTimeSlots()
  {
    var starttime = "14:00:00";
    var interval = "60";
    var endtime = "23:00:00";
    var timeslots = [starttime];
    
    
    while (starttime != endtime) {
      
      starttime = this.addMinutes(starttime, interval);
      timeslots.push(starttime);
      console.log(timeslots);
    }
    //console.log(timeslots);
  }

  addMinutes(time, minutes) {
    var myDate = new Date();
    myDate.setTime(50400000);
    var date = new Date(new Date(myDate.getTime() + minutes * 60000));
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
      ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
      ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
  }

  createNewLogoAd(){
    this.imageUploader.uploadAll();
    this.imageUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.videoUploadResponse = JSON.parse(response);
      console.log(this.videoUploadResponse);
      const newLogoAd = this.newLogoAdForm.value;
      this.logoAds.broadcaster_id = this.broadcasterId;
      this.logoAds.channel_id = this.channelId;
      this.logoAds.ad_title = newLogoAd.logoAdTitle;
      this.logoAds.image_url = this.videoUploadResponse.videoUrl;
      this.logoAds.ftp_path = this.videoUploadResponse.ftpPath;
      this.logoAds.is_active = true;
      this.logoAds.created_by = this.loginResponse.user_name;
      this.logoAds.updated_by = this.loginResponse.user_name;
      this.adsService.createLogoAd(this.logoAds).subscribe(
        createResponse => {
          alert('New Logo Ad Added');
          location.reload();
        },
        err => {
          console.log(err);
          alert('something went wrong');
        }
      );
    }
  }

}

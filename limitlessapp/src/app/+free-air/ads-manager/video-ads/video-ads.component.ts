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
import { AppSettings } from "../../../shared/server/api/api-settings";

@Component({
  selector: 'app-video-ads',
  templateUrl: './video-ads.component.html',
  providers: [BroadcasterService, AdsService]
})
export class VideoAdsComponent implements OnInit {
  newVideoAdForm;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasterChannels: BroadcasterChannel[];
  channelId: number;
  public videoUploader: FileUploader;
  logoAds: LogoAds;
  appName: string;
  videoUploadResponse: VideoUploadResponse;
  adType: string = 'VIDEO';

  constructor(private fb: FormBuilder, private broadcasterService: BroadcasterService, private cookieService: CookieService, private adsService: AdsService) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem('broadcaster_id'));
    this.appName = localStorage.getItem('w_appname');
    this.logoAds = new LogoAds;
    this.videoUploader = new FileUploader({url: AppSettings.API_ENDPOINT+'ads/logo/image/'+this.appName, allowedMimeType:['video/mp4']});
    this.videoUploadResponse = new VideoUploadResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.newVideoAdForm = this.fb.group({
      adTitle: [null, [Validators.required]]
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
        alert('something went wrong!');
      }
    );
  }

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
  }

  createNewLogoAd() {
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.videoUploadResponse = JSON.parse(response);
      console.log(this.videoUploadResponse);
      const newVideoAd = this.newVideoAdForm.value;
      this.logoAds.broadcaster_id = this.broadcasterId;
      this.logoAds.channel_id = this.channelId;
      this.logoAds.ad_title = newVideoAd.adTitle;
      this.logoAds.ad_type = 'VIDEO';
      this.logoAds.image_url = this.videoUploadResponse.videoUrl;
      this.logoAds.img_name = this.videoUploadResponse.fileName;
      this.logoAds.ftp_path = this.videoUploadResponse.ftpPath;
      this.logoAds.is_active = true;
      this.logoAds.created_by = this.loginResponse.user_name;
      this.logoAds.updated_by = this.loginResponse.user_name;
    }
  }

}

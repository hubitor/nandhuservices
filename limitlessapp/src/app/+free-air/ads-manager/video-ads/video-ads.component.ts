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
import { VideoAd } from '../../../shared/models/video-ad';
import { CreateResponse } from 'app/shared/models/createResponse';

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
  videoAd: VideoAd;
  appName: string;
  videoUploadResponse: VideoUploadResponse;
  adType: string = 'VIDEO';
  createResponse: CreateResponse;

  constructor(private fb: FormBuilder, private broadcasterService: BroadcasterService, private cookieService: CookieService, private adsService: AdsService) {
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem('broadcaster_id'));
    this.appName = localStorage.getItem('w_appname');
    this.videoAd = new VideoAd();
    this.videoUploader = new FileUploader({url: AppSettings.API_ENDPOINT+'ads/videoad/video/'+this.appName, allowedMimeType:['video/mp4', 'video/flv', 'video/3gp', 'video/avi', 'video/mov']});
    this.videoUploadResponse = new VideoUploadResponse();
    this.createResponse = new CreateResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.newVideoAdForm = this.fb.group({
      adTitle: [null, [Validators.required]],
      adLength: [null, [Validators.required]]
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
      this.videoAd.broadcaster_id = this.broadcasterId;
      this.videoAd.channel_id = this.channelId;
      this.videoAd.ad_title = newVideoAd.adTitle;
      this.videoAd.ad_length = newVideoAd.adLength;
      this.videoAd.video_url = this.videoUploadResponse.videoUrl;
      this.videoAd.ftp_path = this.videoUploadResponse.ftpPath;
      this.videoAd.is_active = true;
      this.videoAd.created_by = this.loginResponse.user_name;
      this.videoAd.updated_by = this.loginResponse.user_name;
      console.log(this.videoAd);
      this.adsService.createdVideoAd(this.videoAd).subscribe(
        createResponse => {
          this.createResponse = createResponse;
          console.log(this.createResponse);
          location.reload();
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
    }
  }

}

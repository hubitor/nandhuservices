import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { LogoAds } from '../../../shared/models/logo-ads';

@Component({
  selector: 'app-logo-ads',
  templateUrl: './logo-ads.component.html',
  providers: [BroadcasterService]
})
export class LogoAdsComponent implements OnInit {
  newLogoAdForm;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasterChannels: BroadcasterChannel[];
  channelId: number;
  targetPlatforms: string[] = ['Youtube', 'Facebook', 'Twitter'];
  public imageUploader: FileUploader;
  logoAds: LogoAds;

  constructor(private fb: FormBuilder, private cookieSevice: CookieService, private broadcasterService: BroadcasterService) { 
    this.loginResponse = new LoginResponse;
    this.loginResponse = JSON.parse(this.cookieSevice.get("HAU"));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.logoAds = new LogoAds;
    this.imageUploader = new FileUploader({url: '', allowedMimeType:['image/png', 'image/jpg', 'image/jpeg', 'image/gif']});
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm(){
    this.newLogoAdForm = this.fb.group({
      adDimensions: [null, [Validators.required]]
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

  onDestinationSelect(destination: string[]){
    console.log(destination);
  }

  createNewLogoAd(){
    this.imageUploader.uploadAll();
    this.imageUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const newLogoAd = this.newLogoAdForm.value;
      this.logoAds.image_dimensions = newLogoAd.adDimensions;
    }
  }

}

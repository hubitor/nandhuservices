import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { Language } from '../../../shared/models/language';
import { CommonService } from '../../../shared/server/service/common.service';
import { UtilityService } from '../../../shared/server/service/utility-service';
import { CreateResponse } from '../../../shared/models/createResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterVideos } from '../../../shared/models/broadcasterVideos';
import { Broadcasters } from '../../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';

@Component({
  selector: 'app-platform-upload',
  templateUrl: './platform-upload.component.html',
  providers: [BroadcasterService, CommonService]
})
export class PlatformUploadComponent implements OnInit {
  newVideoUploadForm;
  public videoUploader: FileUploader;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  videos: BroadcasterVideos[];
  video: BroadcasterVideos;
  superAdminUser: boolean;
  entertainmentUser: boolean;
  loginResponse: LoginResponse;
  broadcasterId: number;

  constructor(private fb: FormBuilder, private broadcasterService: BroadcasterService, private cookieService: CookieService) {
    this.videoUploader = new FileUploader({url: "http://localhost:3000/upload/tester"});
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    console.log(this.loginResponse);
    if(this.loginResponse.user_type === 'Super Admin'){
      this.superAdminUser = true;
      this.entertainmentUser = false;
    } else if(this.loginResponse.user_type === 'Entertainment'){
      this.entertainmentUser = true;
      this.superAdminUser = false;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newVideoUploadForm = this.fb.group({});
    if(this.superAdminUser){
      this.getAllBroadcasters();
    }
    this.getAllBroadcasterChannels(parseInt(localStorage.getItem("broadcaster_id")));
  }

  testUpload() {
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      alert('uploaded');
    }
  }

  getAllBroadcasters(){
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        console.log(broadcasters);
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllBroadcasterChannels(broadcasterId: number){
    this.broadcasterId = broadcasterId;
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
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

  getChannelVideoByMPUpload(channelId: number){
    
  }

}

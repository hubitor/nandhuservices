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

declare const FB: any;

@Component({
  selector: 'app-fb-video-upload',
  templateUrl: './fb-video-upload.component.html',
  providers: [BroadcasterService, CommonService, UtilityService]
})
export class FbVideoUploadComponent implements OnInit {
  fbUploadForm;
  loginResponse: LoginResponse;
  user: User;
  languages: Language[];
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  broadcasterVideo: BroadcasterVideos;
  public fbUploader: FileUploader;
  superAdminUser: boolean;
  entertainmentUser: boolean;
  broadcasterId: number;
  categoryList: string[] = ['BEAUTY_FASHION', 'BUSINESS', 'CARS_TRUCKS', 'COMEDY', 'CUTE_ANIMALS', 'ENTERTAINMENT',
    'FAMILY', 'FOOD_HEALTH', 'HOME', 'LIFESTYLE', 'MUSIC', 'NEWS', 'POLITICS', 'SCIENCE', 'SPORTS',
    'TECHNOLOGY', 'VIDEO_GAMING', 'OTHER'];

  constructor(private fb: FormBuilder, private broadcasterService: BroadcasterService, private commonService: CommonService, private cookieService: CookieService) {
    this.user = new User();
    this.loginResponse = new LoginResponse();
    this.broadcasterVideo = new BroadcasterVideos();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    console.log("user type: " + this.loginResponse.user_type);
    if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
      this.entertainmentUser = false;
    } else if (this.loginResponse.user_type === 'Entertainment') {
      this.superAdminUser = false;
      this.entertainmentUser = true;
    }
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    }
    this.getBroadcasterChannels(parseInt(localStorage.getItem("broadcaster_id")));
  }

  initForm() {
    this.fbUploadForm = this.fb.group({
      videoTitle: [null, [Validators.required]],
      videoDescription: [null, [Validators.required]]
    });
  }

  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        console.log(error);
        alert("something went wrong");
      }
    );
  }

  getBroadcasterChannels(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
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

  getAllLanguages() {
    this.commonService.getAllLanguages().subscribe(
      languages => {
        this.languages = languages;
      },
      error => {
        console.log(error);
        alert('something went wrong');
      }
    );
  }

}

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
import { VideoUploadResponse } from '../../../shared/models/videoUploadResponse';

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
  channelId: number;
  languageId: number;
  public videoUploader: FileUploader;
  videoUploadResponse: VideoUploadResponse;
  selectedVideoCategory: string;

  constructor(private formBuilder: FormBuilder, private broadcasterService: BroadcasterService, private commonService: CommonService, private cookieService: CookieService) {
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
    this.videoUploader = new FileUploader({ url: 'http://localhost:3000/upload/video/fb/' + this.loginResponse.user_id });
    //console.log(this.videoUploader);
    this.videoUploadResponse = new VideoUploadResponse();
    FB.init({
      appId: '135402210522026',
      version: 'v2.10',
      xfbml: true,
      cookie: false
    });
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    }
    this.getBroadcasterChannels(parseInt(localStorage.getItem("broadcaster_id")));
    this.getAllLanguages();
  }

  initForm() {
    this.fbUploadForm = this.formBuilder.group({
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

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
  }

  onLanguageSelect(languageId: number) {
    this.languageId = languageId;
  }

  onCatgeorySelect(category: string) {
    this.selectedVideoCategory = category;
  }

  addNewVideoToFB() {
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log(JSON.parse(response));
      this.videoUploadResponse = JSON.parse(response);
      var videoParams = {
        content_category: this.selectedVideoCategory,
        description: 'test',
        embeddable: true,
        file_url: this.videoUploadResponse.videoUrl,
        file_size: this.videoUploadResponse.fileSize,
        title: 'test video',
        access_token: ''
      };
      FB.login(function (fbLoginResponse) {
        console.log(fbLoginResponse);
        FB.api('/me/accounts', function (fbAccountsResponse) {
          console.log(fbAccountsResponse);
          for(let i=0; i<fbAccountsResponse.data.length; i++){
            if(fbAccountsResponse.data[i].id === '464226437311031'){
              videoParams.access_token = fbAccountsResponse.data[i].access_token;
            }
          }
          FB.api('/464226437311031/videos', 'post', videoParams, function (pageResponse) {
            console.log(pageResponse);
          });
        });
      }, { scope: 'manage_pages,publish_pages,pages_show_list' });
    }
  }

}

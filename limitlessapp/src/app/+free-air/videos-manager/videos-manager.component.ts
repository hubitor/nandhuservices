import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { BroadcasterVideos } from '../../shared/models/broadcasterVideos';
import { Language } from '../../shared/models/language';
import { CommonService } from '../../shared/server/service/common.service';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { VideoUploadResponse } from '../../shared/models/videoUploadResponse';
import { CreateResponse } from '../../shared/models/createResponse';

@Component({
  selector: 'app-videos-manager',
  templateUrl: './videos-manager.component.html',
  providers: [CommonService, BroadcasterService]
})
export class VideosManagerComponent implements OnInit {
  newVideoForm;
  user: User;
  loginResponse: LoginResponse;
  broadcasterVideo: BroadcasterVideos;
  languages: Language[];
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  public videoUploader: FileUploader;
  videoUploadResponse: VideoUploadResponse;
  broadcasterId: number;
  broadcasterChannelId: number;
  languageId: number;
  createResponse: CreateResponse;

  constructor(private fb: FormBuilder, private commonService: CommonService, private cookieService: CookieService,
        private broadcasterService: BroadcasterService) {
    this.user = new User();
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    this.broadcasterVideo = new BroadcasterVideos();
    this.superAdmin = false;
    this.entertainmentUser = false;
    this.videoUploader = new FileUploader({url: "http://localhost:3000/upload/video/entertainment/content/"+this.loginResponse.user_id});
    if(this.loginResponse.user_type === 'Super Admin'){
      this.superAdmin = true;
      this.entertainmentUser = false;
    } else if(this.loginResponse.user_type === 'Entertainment'){
      this.superAdmin = false;
      this.entertainmentUser = true;
    }
    this.videoUploadResponse = new VideoUploadResponse();
    this.createResponse = new CreateResponse();
   }

  ngOnInit() {
    this.initForm();
    this.getAllBroadcasters();
    this.getChannels(parseInt(localStorage.getItem("broadcaster_id")));
    this.getAllLanguages();
  }

  initForm(){
    this.newVideoForm = this.fb.group({
      videoName: [null, [Validators.required]],
      videoDescription: [null, [Validators.required]],
      videoRank: [null, [Validators.required]]
    });
  }

  getAllLanguages(){
    this.commonService.getAllLanguages().subscribe(
      languages => {
        this.languages = languages;
        console.log(this.languages);
      },
      error => {
        console.log(error);
        console.log('something went wrong');
      }
    );
  }

  getAllBroadcasters(){
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        console.log(error);
      }
    );
  }

  getChannels(broadcasterId: number){
    this.broadcasterId = broadcasterId;
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
      }
    );
  }

  onChannelSelect(broadcasterChannelId: number){
    this.broadcasterChannelId = broadcasterChannelId;
  }

  onLanguageSelect(languageId: number){
    this.languageId = languageId;
  }

  addNewVideo(){
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if(status === 200){
        this.videoUploadResponse = JSON.parse(response);
        const newVideo = this.newVideoForm.value;
        this.broadcasterVideo.video_name = newVideo.videoName;
        this.broadcasterVideo.video_description = newVideo.videoDescription;
        this.broadcasterVideo.url = this.videoUploadResponse.videoUrl;
        this.broadcasterVideo.broadcaster_channel_id = this.broadcasterChannelId;
        this.broadcasterVideo.language_id = this.languageId;
        this.broadcasterVideo.is_active = true;
        this.broadcasterVideo.rank = newVideo.videoRank;
        this.broadcasterVideo.video_thumbnail = "";
        this.broadcasterVideo.is_live = false;
        this.broadcasterVideo.is_youtube = false;
        this.broadcasterVideo.video_type = "NIL";
        this.broadcasterVideo.fb_streamkey = "NIL";
        this.broadcasterVideo.yt_streamkey = "NIL";
        this.broadcasterVideo.ha_streamkey = "NIL";
        if(this.superAdmin){
          this.broadcasterVideo.created_by = "SA";
          this.broadcasterVideo.updated_by = "SA";
        } else if(this.entertainmentUser){
          this.broadcasterVideo.created_by = "User";
          this.broadcasterVideo.updated_by = "USer";
        }
        console.log(this.broadcasterVideo);
        this.broadcasterService.createBroadcasterVideos(this.broadcasterVideo).subscribe(
          createResponse => {
            this.createResponse = createResponse;
            alert('Video uploaded successfully');
          },
          error => {
            console.log(error);
            alert('Something went wrong. Try after sometime');
          }
        );
      } else {
        alert('Something went wrong!');
      }
    }
  }

}

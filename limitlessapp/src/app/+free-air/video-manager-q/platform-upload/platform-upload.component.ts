import { Component, OnInit, ElementRef, Input } from '@angular/core';
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
import { AuthServiceService } from '../../../shared/server/service/auth-service.service';
import { GoogleClientKeys } from '../../../shared/models/google-client-keys';
import * as GoogleCliAuth from 'google-cli-auth';
import { UploadService } from '../../../shared/server/service/upload.service';

declare const gapi: any;

@Component({
  selector: 'app-platform-upload',
  templateUrl: './platform-upload.component.html',
  providers: [BroadcasterService, CommonService, AuthServiceService, UploadService]
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
  userId: number;
  clientKeys: GoogleClientKeys;
  auth2: any;
  fileContent: HTMLInputElement;
  file: File;
  ytUrl: string = 'https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status';

  constructor(private fb: FormBuilder, private broadcasterService: BroadcasterService, private cookieService: CookieService, private authService: AuthServiceService, private el: ElementRef, private uploadService: UploadService) {
    this.videoUploader = new FileUploader({ url: "http://localhost:3000/upload/tester" });
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    this.userId = this.loginResponse.user_id;
    if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
      this.entertainmentUser = false;
    } else if (this.loginResponse.user_type === 'Entertainment') {
      this.entertainmentUser = true;
      this.superAdminUser = false;
    }
    this.clientKeys = new GoogleClientKeys();
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    }
    this.getAllBroadcasterChannels(parseInt(localStorage.getItem("broadcaster_id")));
    this.getGoogleClientKeyOfUser();
  }

  initForm() {
    this.newVideoUploadForm = this.fb.group({
      videoTitle: [null, [Validators.required]],
      videoDescription: [null, [Validators.required]]
    });
  }

  testUpload() {
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      alert('uploaded');
    }
  }

  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllBroadcasterChannels(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
      },
      error => {
        console.log(error);
        alert('something went wrong');
      }
    );
  }

  getGoogleClientKeyOfUser() {
    this.authService.getGoogleClientKeys(this.userId).subscribe(
      clientKeys => {
        this.clientKeys = clientKeys;
        console.log(this.clientKeys);
      },
      error => {
        console.log(error);
      }
    );
  }

  authUserWithGoogle() {
    let clientId: string = this.clientKeys.client_id;
    //let formData = new FormData();
    this.fileContent = this.el.nativeElement.querySelector("#file");
    this.file = this.fileContent.files[0];
    console.log(this.file);
    // let reader = new FileReader();
    // reader.onload = function () {
    //   console.log('started to read');
    //   console.log(reader.result);
    // }
    // reader.readAsArrayBuffer(file);
    // var byteArray = new Uint8Array(reader.result);
    // var fileBytes = [];
    // fileBytes.push(byteArray);
    //var blob = new Blob(fileBytes, { type: 'application/octet-stream' });
    //console.log(blob);
    gapi.load('client:auth2', function () {
      gapi.client.init({
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
        clientId: clientId,
        cookiepolicy: 'single_host_origin',
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'].join(' ')
      }).then(function () {
        gapi.auth2.getAuthInstance().signIn();
        console.log(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token);
        localStorage.setItem('google_access_token', gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token);
      }).catch(err => {
        console.log(err);
      });
    });
    var snippet = {
      'categoryId': '22',
      'description': 'Video Description',
      'title': 'Video Title'
    };
    var status = {
      'privacyStatus': 'private'
    };
    var metadata = {
      'snippet': snippet,
      'status': status
    }
    console.log(metadata);
    var uploadInitiate = new XMLHttpRequest();
    uploadInitiate.open('POST', this.ytUrl, true);
    uploadInitiate.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('google_access_token'));
    uploadInitiate.setRequestHeader('Content-Type', this.file.type);
    uploadInitiate.setRequestHeader('X-Upload-Content-Length', this.file.size.toString());
    uploadInitiate.setRequestHeader('X-Upload-Content-Type', this.file.type);
    //console.log(uploadInitiate);
    uploadInitiate.send(JSON.stringify(metadata));
    console.log(uploadInitiate);

    var sendFile = new XMLHttpRequest();
    sendFile.open('PUT', this.ytUrl, true);
    sendFile.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('google_access_token'));
    sendFile.setRequestHeader("Content-Type", this.file.type);
    sendFile.setRequestHeader('X-Upload-Content-Type', this.file.type);
    sendFile.send(this.file);
    console.log(sendFile);
  }
}

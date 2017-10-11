import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { CommonService } from '../../../shared/server/service/common.service';
import { UtilityService } from "../../../shared/server/service/utility-service"
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../../shared/models/broadcasters';

@Component({
  selector: 'app-platform-upload',
  templateUrl: './platform-upload.component.html',
  providers: [BroadcasterService, CommonService]
})
export class PlatformUploadComponent implements OnInit {
  newVideoUploadForm;
  public videoUploader: FileUploader;

  constructor(private fb: FormBuilder) {
    this.videoUploader = new FileUploader({url: "http://localhost:3000/upload/tester"});
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newVideoUploadForm = this.fb.group({});
  }

  testUpload() {
    this.videoUploader.uploadAll();
    this.videoUploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      alert('uploaded');
    }
  }

}

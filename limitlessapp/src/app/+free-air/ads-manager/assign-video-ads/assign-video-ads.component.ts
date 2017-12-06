import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { AdsService } from '../../../shared/server/service/ads.service';
import { AppSettings } from "../../../shared/server/api/api-settings";
import { VideoAd } from '../../../shared/models/video-ad';
import { CreateResponse } from 'app/shared/models/createResponse';

@Component({
  selector: 'app-assign-video-ads',
  templateUrl: './assign-video-ads.component.html'
})
export class AssignVideoAdsComponent implements OnInit {
  assignVideoAdForm;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  formInit() {
    this.assignVideoAdForm = this.fb.group({

    });
  }

}

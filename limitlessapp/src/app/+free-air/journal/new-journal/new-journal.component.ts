import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { Language } from '../../../shared/models/language';
import { CommonService } from '../../../shared/server/service/common.service';
import { Broadcasters } from '../../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
import { JournalSetting } from '../../../shared/models/journal-setting';
import { JournalDevice } from '../../../shared/models/journal-device';

@Component({
  selector: 'app-new-journal',
  templateUrl: './new-journal.component.html',
  providers: [JournalService, BroadcasterService]
})
export class NewJournalComponent implements OnInit {
  newJournalForm;
  journal: Journal;
  journalSetting: JournalSetting;
  journalDevice: JournalDevice;
  superAdminUser: boolean;
  broadcasterUser: boolean;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadcasterService: BroadcasterService) {
    this.journal = new Journal();
    this.journalSetting = new JournalSetting();
    this.journalDevice = new JournalDevice();
    this.superAdminUser = false;
    this.broadcasterUser = false;
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    if(this.loginResponse.user_type === 'Entertainment'){
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.broadcasterUser = true;
      this.superAdminUser = false;
    } else if(this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = false;
      this.broadcasterUser = false;
    }
    this.broadcasters = new Array();
    this.broadcasterChannels = new Array();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newJournalForm = this.fb.group({});
  }

  getAllBroadcasters() {
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

  getBroadcasterChannels(broadcasterId: number) {
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      broadcasterChannels => {
        this.broadcasterChannels = broadcasterChannels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
      }
    );
  }

}

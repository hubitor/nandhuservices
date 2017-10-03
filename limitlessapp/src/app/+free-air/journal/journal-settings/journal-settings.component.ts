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
  selector: 'app-journal-settings',
  templateUrl: './journal-settings.component.html',
  providers: [BroadcasterService, JournalService]
})
export class JournalSettingsComponent implements OnInit {
  journalSettingForm;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  journals: Journal[];
  superAdminUser: boolean;
  broadcasterUser: boolean;
  loginResponse: LoginResponse;
  broadcasterId: number;
  journalSettings: JournalSetting[];
  journalSettingSelected: JournalSetting;
  journalDevice: JournalDevice;

  constructor(private broadcasterService: BroadcasterService, private journalService: JournalService,
    private cookieService: CookieService, private fb: FormBuilder) {
    this.superAdminUser = false;
    this.broadcasterUser = false;
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    if (this.loginResponse.user_type === 'Entertainment') {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.broadcasterUser = true;
      this.superAdminUser = false;
    } else if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
      this.broadcasterUser = false;
    }
    this.broadcasters = new Array();
    this.journalSettings = new Array();
    this.journalDevice = new JournalDevice();
    this.journalSettingSelected = new JournalSetting();
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    } else if (this.broadcasterUser) {
      this.getBroadcasterChannels(this.loginResponse.client_id);
    }
  }

  initForm() {
    this.journalSettingForm = this.fb.group({});
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

  getJournalsByChannelId(channelId: number) {
    this.journalService.getJournalsByChannel(channelId).subscribe(
      journals => {
        this.journals = journals;
        console.log(this.journals);
      },
      error => {
        console.log(error);
      }
    );
  }

  getJournalSetting(journalId: number) {
    this.journalService.getJournalSettingByJournalId(journalId).subscribe(
      journalSettings => {
        this.journalSettings = journalSettings;
        console.log(this.journalSettings);
      },
      error => {
        console.log(error);
      }
    );
  }

  getJournalSettingDevice(settingId: number) {
    this.journalService.getJournalDeviceBySettingsId(settingId).subscribe(
      journalDevice => {
        this.journalDevice = journalDevice;
        console.log(this.journalDevice);
      },
      error => {
        console.log(error);
      }
    );
  }

}

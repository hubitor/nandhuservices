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
  providers: [BroadcasterService, JournalService, CommonService]
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
  journalSettings: JournalSetting;
  journalDevice: JournalDevice;
  journalId: number;
  languages: Language[];
  languageId: number;
  allowRecording: boolean;
  allowUploading: boolean;
  output_url_hls_baseurl: string = "http://journal.haappyapp.com:1935/";
  output_url_rtsp_baseurl: string = "rtsp://journal.haappyapp.com:1935/";

  constructor(private broadcasterService: BroadcasterService, private journalService: JournalService,
    private cookieService: CookieService, private fb: FormBuilder, private commonService: CommonService) {
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
    this.journalSettings = new JournalSetting();
    this.journalDevice = new JournalDevice();
    this.journalId = 0;
    this.languages = new Array();
    this.languageId = 0;
    this.allowRecording = false;
    this.allowUploading = false;
  }

  ngOnInit() {
    this.initForm();
    this.getAllLanguages();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    } else if (this.broadcasterUser) {
      this.getBroadcasterChannels(this.loginResponse.client_id);
    }
  }

  initForm() {
    this.journalSettingForm = this.fb.group({
      appln_name: [null, [Validators.required]],
      stream_name: [null, [Validators.required]],
      ftp_host: [null, [Validators.required]],
      ftp_port: [null, [Validators.required]],
      ftp_uname: [null, [Validators.required]],
      ftp_passwd: [null, [Validators.required]],
      ftp_path: [null, [Validators.required]],
      mac_id: [null, [Validators.required]]
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

  getAllLanguages(){
    this.commonService.getAllLanguages().subscribe(
      languages => {
        this.languages = languages;
        console.log(this.languages);
      },
      error => {
        console.log(error);
      }
    );
  }

  onJournalSelect(journalId: number) {
    this.journalId = journalId;
    console.log(this.journalId);
  }

  onLanguageSelect(languageId: number){
    this.languageId = languageId;
    console.log(this.languageId);
  }

  onRecordingSelect(state: boolean){
    this.allowRecording = state;
  }

  onUploadingSelect(state: boolean){
    this.allowUploading = state;
  }

  createNewJournalSetting(){
    const newJournalSetting = this.journalSettingForm.value;
    this.journalSettings.journal_id = this.journalId;
    this.journalSettings.language_id = this.languageId;
    this.journalSettings.appln_name = newJournalSetting.appln_name;
    this.journalSettings.stream_name = newJournalSetting.appln_name+'-'+newJournalSetting.stream_name;
    this.journalSettings.ftp_host = newJournalSetting.ftp_host;
    this.journalSettings.ftp_port = newJournalSetting.ftp_port;
    this.journalSettings.ftp_uname = newJournalSetting.ftp_uname;
    this.journalSettings.ftp_passwd = newJournalSetting.ftp_passwd;
    this.journalSettings.ftp_path = newJournalSetting.ftp_path;
    this.journalSettings.ha_ftp_path = newJournalSetting.appln_name;
    this.journalSettings.mac_id = newJournalSetting.mac_id;
    this.journalSettings.is_active = true;
    this.journalSettings.is_record = this.allowRecording;
    this.journalSettings.is_upload = this.allowUploading;
    this.journalSettings.rep_mac_addr = "";
    this.journalSettings.host_url = "journal.haappyapp.com";
    this.journalSettings.host_port = "1935";
    this.journalSettings.suname = "live.journal";
    this.journalSettings.spwd = "JournaL";
    this.journalSettings.ha_ftp_host = "35.154.228.200";
    this.journalSettings.ha_ftp_port = 21;
    this.journalSettings.ha_ftp_uname = "happyj-ftp";
    this.journalSettings.ha_ftp_passwd = "HappyApp";
    this.journalSettings.output_url_hls = this.output_url_hls_baseurl + this.journalSettings.appln_name + "/" + this.journalSettings.stream_name + "/playlist.m3u8";
    this.journalSettings.output_url_rtsp = this.output_url_rtsp_baseurl + this.journalSettings.appln_name + "/" + this.journalSettings.stream_name;
    this.journalSettings.created_by = "SA";
    this.journalSettings.updated_by = "SA";
    console.log(this.journalSettings);
    this.journalService.createNewJournalSettingAndDevice(this.journalSettings).subscribe(
      createResponse => {
        console.log(createResponse);
        window.location.reload();
        // alert("Settings created");
      },
      error => {
        console.log(error);
        // alert("something went wrong");
      }
    );
  }

  
}

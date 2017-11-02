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
  selector: 'app-journalDevice',
  templateUrl: './journalDevice.component.html',
  providers: [BroadcasterService, JournalService, CommonService]
})
export class JournalDeviceComponent implements OnInit {
  setting: JournalDevice;
  Id: number;
  settingId: number;
  journalSetting: JournalSetting[];
  errorMessage: string;
  journaldeviceall: JournalDevice[];
  journalDeviceForm;
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
    this.journalDevice = new JournalDevice();
    this.journalId = 0;
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
      this.getBroadcasterAllGrid();
    } else if (this.broadcasterUser) {
      this.getBroadcasterChannels(this.loginResponse.client_id);
    }
  }

  getBroadcasterAllGrid()
  {
      this.journalService.getAllJournalDevices()
    .subscribe(
     (journalDeviceResponse)=>{
         
          this.journaldeviceall=journalDeviceResponse;
         
     }),
    error => this.errorMessage = <any>error;
  };

  initForm() {
    this.journalDeviceForm = this.fb.group({
      userActiveStatus: new FormControl(""),
      userDeviceName: [null, [Validators.required]],
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

  getStreamNameByJournalId(journalId: number) {
    this.journalService.getJournalSettingByJournalId(journalId).subscribe(
      streamname => {
        this.journalSetting =streamname;
      },
      error => {
        console.log(error);
      }
    );
  }

  getJournalDeviceBySettingsId(settingId: number){
    this.journalService.getJournalDeviceBySettingsId(settingId).subscribe(
      streamId => {
        this.setting =streamId;
      },
      error => {
        console.log(error);
      }
    );

  }


  onJournalSelect(journalId: number) {
    this.journalId = journalId;
    this.getStreamNameByJournalId(journalId);
    console.log(this.journalId);
  }

  onStreamNameSelect(settingId: number)  {
    this.settingId=settingId;
    this.getJournalDeviceBySettingsId(settingId);
  }

  onStreamNameId(settingId: number)  {
  this.Id=settingId;
  }

  
  updateJournal(){
    const newJournalDevice = this.journalDeviceForm.value;
    this.journalDevice.id=this.Id;
    this.journalDevice.journal_setting_id=this.settingId;
    this.journalDevice.mac_id=newJournalDevice.userDeviceName;
    this.journalDevice.is_active = newJournalDevice.userActiveStatus;
    this.journalDevice.created_by = "uma";
    this.journalDevice.updated_by = "uma";
    
    this.journalService.updateJournalDevice(this.journalDevice).subscribe(
    createResponse => {
      console.log('output'+createResponse);
        // alert("journaldevice updated");
        window.location.reload();
        },
        error => 
        {
          // alert("Something went wrong!");
          console.log('error in '+ error);
        }
   ); 
  } 
  
}

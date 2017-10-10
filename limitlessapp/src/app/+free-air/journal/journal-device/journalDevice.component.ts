import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterVideos } from '../../../shared/models/broadcasterVideos';
import { CommonService } from '../../../shared/server/service/common.service';
import { UtilityService } from "../../../shared/server/service/utility-service"
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { VideoUploadResponse } from '../../../shared/models/videoUploadResponse';
import { CreateResponse } from '../../../shared/models/createResponse';
import { NotificationService } from "../../../shared/utils/notification.service";
import { AppConfig } from "../../../shared/server/api/app-config";
import { BroadcasterChannelsService } from '../../../shared/server/service/broadcaster-channels.service';
import { JournalDevice } from '../../../shared/models/journal-device';
import { AppSettings } from "../../../shared/server/api/api-settings";
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
import { JournalSetting } from '../../../shared/models/journal-setting';


@Component({
  selector: 'app-journalDevice',
  templateUrl: './journalDevice.component.html',
  providers: [BroadcasterChannelsService,BroadcasterService,JournalService,]
})
export class JournalDeviceComponent implements OnInit  {
  Id: number;
  setting: JournalDevice;
  settingId: number;
  journal_setting_id: number;
  journalsettingid: number;
  broadcasterUser: boolean;
  journaldevices: JournalDevice[];
  journaldeviceall: JournalDevice[];
  journaldevice:JournalDevice;
  is_active: boolean;
  id: number;
  journalDeviceForm;
  channelId: number;
  journalId: number;
  errorMessage: string;
  appSettings:AppSettings;
  loginResponse: LoginResponse;
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  broadcasterId: number;
  broadcasterChannelId: number;
  createResponse: CreateResponse;
  channelsList: BroadcasterChannel[];
  journalList:Journal[];
  journalSetting:JournalSetting[];
  channelSelected: boolean;
  
 
  

constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
  private cookieService: CookieService, private broadcasterService: BroadcasterService,
  private journalService: JournalService) {
  this.superAdmin = false;
  this.broadcasterUser = false;
  this.loginResponse = new LoginResponse();
  this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
  this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    if (this.loginResponse.user_type === 'Entertainment') {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.entertainmentUser = true;
      this.superAdmin = false;
    } else if (this.loginResponse.user_type === 'Super Admin') {
      this.entertainmentUser = false;
      this.superAdmin = true;
    }
    this.channelSelected = false;
    this.createResponse = new CreateResponse();
   
  }

  ngOnInit() {
  this.getBroadcasterAllGrid();
    this.initForm();
    if (this.superAdmin) {
      this.getAllBroadcasters();
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
      channels => {
        this.channelsList = channels;
      },
      error => {
        console.log(error);
      }
    );
  }

  getJournals(channelId: number) {
    this.journalService.getJournalsByChannel(channelId).subscribe(
      journals => {
        this.journalList =journals;
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

  onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.getBroadcasterChannels(broadcasterId);
  }

  onChannelSelect(channelId: number) {
    this.channelId=channelId;
    this.getJournals(channelId);
    
  }

  onJournalSelect(journalId: number) {
    this.journalId=journalId;
    this.getStreamNameByJournalId(journalId);
  
 }

  onStreamNameSelect(settingId: number)  {
      this.settingId=settingId;
      this.getJournalDeviceBySettingsId(settingId);
  }

  onStreamNameId(settingId: number)  {
    this.Id=settingId;
  }

  updateJournal() {
    const newJournal = this.journalDeviceForm.value;
    this.journaldevice = new JournalDevice();
    this.journaldevice.id=this.Id;
      this.journaldevice.journal_setting_id=this.settingId;
      this.journaldevice.mac_id=newJournal.userDeviceName;
      this.journaldevice.is_active = newJournal.userActiveStatus;
      this.journaldevice.created_by = "uma";
      this.journaldevice.updated_by = "uma";
      
      this.journalService.updateJournalDevice(this.journaldevice).subscribe(
      createResponse => {
        console.log('output'+createResponse);
          alert("journaldevice updated");
          window.location.reload();
          },
          error => 
          {
            alert("Something went wrong!");
            console.log('error in '+ error);
          }
    );  
  }


}

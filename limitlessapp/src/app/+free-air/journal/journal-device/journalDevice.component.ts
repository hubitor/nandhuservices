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
import { JournalDeviceService } from '../../../shared/server/service/journal-device.service';
import { JournalDevice } from '../../../shared/models/journal-device';
import { AppSettings } from "../../../shared/server/api/api-settings";
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
import { JournalSetting } from '../../../shared/models/journal-setting';


@Component({
  selector: 'app-journalDevice',
  templateUrl: './journalDevice.component.html',
  providers: [BroadcasterChannelsService,BroadcasterService,JournalDeviceService,JournalService,]
})
export class JournalDeviceComponent implements OnInit  {
  journal_setting_id:JournalSetting;
  // journal_setting_id:number;
  journaldevices: JournalDevice[];
  journaldeviceall: JournalDevice[];
  journaldevice:JournalDevice;

  is_active: boolean;
  mobile: number;
  last_name: string;
  first_name: string;
  emp_id: number;
  email: string;
  Id: number;
  journalDeviceForm;
  channelId: number;
  journalChannelId: number;
  id: number;
  errorMessage: string;
  channel_id:number;
  appSettings:AppSettings;

  user: User;
  loginResponse: LoginResponse;
  broadcasterVideo: BroadcasterVideos;
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  broadcasterId: number;
  broadcasterChannelId: number;
  createResponse: CreateResponse;
  broadcasterChannel: BroadcasterChannel;
  channelsList: BroadcasterChannel[];
  journalList:Journal[];
  primaryChannelId: number;
  channelSelected: boolean;
  
 
  

constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
  private cookieService: CookieService, private broadcasterService: BroadcasterService,private journalService: JournalService,
  private journalDeviceService:JournalDeviceService) {
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
    this.initForm();
    this.getAllBroadcaster();
    this.getAllChannels(this.broadcasterId);
    this.getBroadcasterAllGrid();
  }

getBroadcasterAllGrid()
  {
      this.journalDeviceService.getAllJournalDevices()
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
getAllBroadcaster() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
      },
      error => {
        alert("Something went wrong. Broadcaster list not loaded");
      }
    );
  }

getAllChannels(broadcasterId: number) {
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.channelsList = channels;
      },
      error => {
        alert("Something went wrong. Channels list not loaded");
      }
    );
  }

getJournals(channelId: number) {
    this.journalService.getJournalsByChannelId(channelId).subscribe(
      journals => {
        this.journalList =journals;
      },
      error => {
        alert("Something went wrong. Channels list not loaded");
      }
    );
  }


onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.getAllChannels(broadcasterId);
  }

onChannelSelect(channelId: number) {
    this.channelId=channelId;
    this.getJournals(channelId);
    
  }

onJournalSelect(channelId: number) {
    this.id=channelId;
  
     }

createJournal() {
  const newJournal = this.journalDeviceForm.value;
    this.journaldevice = new JournalDevice();
      this.journaldevice.id=newJournal.id;
      // this.journaldevice.journal_setting_id =newJournal.journal_setting_id;
      this.journaldevice.journal_setting_id =newJournal.id;
      this.journaldevice.mac_id=newJournal.userDeviceName;
      this.journaldevice.is_active = newJournal.userActiveStatus;
      this.journaldevice.created_by = "uma";
      this.journaldevice.updated_by = "uma";
      this.journalDeviceService.createJournal(this.journaldevice)
        .subscribe(
          createResponse => {
            console.log('output'+createResponse);
            alert("journal created successfully...");
            window.location.reload();
          },
          error => 
          {
            alert("Something went wrong!");
            console.log('error in '+ error);
          }
        
        );  
    }

cancelJournal() {
  this.journaldevice = new JournalDevice();
    this.journalDeviceService.cancelJournal(this.journaldevice).subscribe(
            journaldevice => this.journaldevices = journaldevice,
          error => this.errorMessage = <any>error
        );
      }

}

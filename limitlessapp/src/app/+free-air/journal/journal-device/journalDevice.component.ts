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


@Component({
  selector: 'app-journalDevice',
  templateUrl: './journalDevice.component.html',
  providers: [BroadcasterChannelsService,BroadcasterService,JournalDeviceService]
})
export class JournalDeviceComponent implements OnInit  {
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
  public uploader:FileUploader;
  broadcasterId: number;
  broadcasterChannelId: number;
  createResponse: CreateResponse;
  broadcasterChannel: BroadcasterChannel;
  channelsList: BroadcasterChannel[];
  primaryChannelId: number;
  channelSelected: boolean;
  
 
  

  constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
    private cookieService: CookieService, private broadcasterService: BroadcasterService
    ,private journalDeviceService:JournalDeviceService) {
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
    // this.getJournals();
    // this. getChannelByJournalId(this.channel_id);
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
    //   userLastName: [null, [Validators.required]]
     
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


  onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.getAllChannels(broadcasterId);
  }

  onChannelSelect(channelId: number) {
    this.channelId=channelId;
    
  }
  // onJournalSelect(channel_id: number) {
  //   this.id=channel_id;
  //   this.getChannelByJournalId(channel_id);
  //    }

  // onJournalChannelSelect(channel_id: number) {
  //   this.channel_id = channel_id;
  //   }


  createJournal() {
    const newJournal = this.journalDeviceForm.value;
 this.journaldevice = new JournalDevice();
      this.journaldevice.id=newJournal.email;
      this.journaldevice.journal_setting_id = newJournal.emp_id;
    //   this.journaldevice.first_name =newJournal.first_name;
      this.journaldevice.mac_id=newJournal.last_name;
      this.journaldevice.is_active = newJournal.is_active;
      this.journaldevice.created_by = "uma";
      this.journaldevice.updated_by = "uma";
      this.journalDeviceService.createJournal(this.journaldevice)
        .subscribe(
            journaldevice => this.journaldevices = journaldevice,
          // createResponse => {
          //   console.log('output'+createResponse);
          //   alert("journal created successfully...");
          //   window.location.reload();
          // },
          error => this.errorMessage = <any>error);  
    }

  // createProduct(journal) {
      
  //         this.journalService.createJournal(this.journal)
  //           .subscribe(
  //             journal=> this.journals = journal,
  //           error => this.errorMessage = <any>error);
      
  //       }

  cancelJournal() {
    this.journaldevice = new JournalDevice();
      this.journalDeviceService.cancelJournal(this.journaldevice)
        .subscribe(
            journaldevice => this.journaldevices = journaldevice,
          error => this.errorMessage = <any>error
        );
      }

}

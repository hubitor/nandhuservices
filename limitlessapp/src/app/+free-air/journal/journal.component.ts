import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { BroadcasterVideos } from '../../shared/models/broadcasterVideos';
import { Language } from '../../shared/models/language';
import { CommonService } from '../../shared/server/service/common.service';
import { UtilityService } from "../../shared/server/service/utility-service"
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { VideoUploadResponse } from '../../shared/models/videoUploadResponse';
import { CreateResponse } from '../../shared/models/createResponse';
import { NotificationService } from "../../shared/utils/notification.service";
import { AppConfig } from "../../shared/server/api/app-config";
import { BroadcasterChannelsService } from '../../shared/server/service/broadcaster-channels.service';
import { JournalService } from '../../shared/server/service/journal.service';
import { Journal } from '../../shared/models/journal';
import { AppSettings } from "../../shared/server/api/api-settings";
import sha256 from 'crypto-js/sha256';



@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  providers: [BroadcasterChannelsService,BroadcasterService,JournalService]
})
export class JournalComponent implements OnInit  {
  journalList: Journal[];
  journalall: Journal[];
  is_active: boolean;
  mobile: number;
  last_name: string;
  first_name: string;
  emp_id: number;
  email: string;
  Id: number;
  journalForm;
  channelId: number;
  journalChannelId: number;
  journalChannels: Journal[];
  id: number;
  journals: Journal[];
  journal: Journal;
  errorMessage: string;
  channel_id:number;
  appSettings:AppSettings;

  user: User;
  loginResponse: LoginResponse;
  broadcasterVideo: BroadcasterVideos;
  languages: Language[];
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  public uploader:FileUploader;
  videoUploadResponse: VideoUploadResponse;
  broadcasterId: number;
  broadcasterChannelId: number;
  languageId: number;
  createResponse: CreateResponse;
  broadcasterChannel: BroadcasterChannel;
  channelsList: BroadcasterChannel[];
  primaryChannelId: number;
  channelName: string;
  channelImage: string;
  channelSelected: boolean;
  // private s_statusId: boolean;
  
 
  

  constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
    private cookieService: CookieService, private broadcasterService: BroadcasterService
    ,private journalService:JournalService) {
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
      this.journalService.getAllJournals()
    .subscribe(
     (journalResponse)=>{
         
          this.journalall=journalResponse;
         
     }),
    error => this.errorMessage = <any>error;
  };

  initForm() {
    this.journalForm = this.fb.group({
      userActiveStatus: new FormControl(""),
      // userId:new FormControl(""),
      userFirstName: [null, [Validators.required]],
      userLastName: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      userPasswd:[null,[Validators.required]],
      userEmpid:[null,[Validators.required]],
      
     
    });
  }

  // handleStatusUpdated(value) {
  //   this.s_statusId = value;
  // }

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
    const newJournal = this.journalForm.value;
      this.journal = new Journal();
      // this.journal.id=newJournal.userId;
      this.journal.email=newJournal.userEmail;
      this.journal.password =sha256(newJournal.userPasswd).toString();
      this.journal.emp_id = newJournal.userEmpid
      this.journal.first_name =newJournal.userFirstName;
      console.log('firdse'+this.journal.first_name);
      this.journal.last_name=newJournal.userLastName;
      this.journal.mobile =newJournal.userMobile;
      console.log('mobiel'+this.journal.mobile);
      this.journal.is_active = newJournal.userActiveStatus;
      console.log('activeut'+this.journal.is_active );
      this.journal.created_by = "uma";
      this.journal.updated_by = "uma";
      this.journalService.createJournal(this.journal).subscribe(
     journal => this.journals = journal,
          // createResponse => {
          //   alert("journal created successfully...");
          //   window.location.reload();
          // },
          error =>
          {
            alert("Something went wrong!");
            console.log('error in creating'+error);
          }
          // this.errorMessage = <any>error
        );  
    }

  // createProduct(journal) {
      
  //         this.journalService.createJournal(this.journal)
  //           .subscribe(
  //             journal=> this.journals = journal,
  //           error => this.errorMessage = <any>error);
      
  //       }

  cancelJournal() {
    this.journal = new Journal();
      this.journalService.cancelJournal(this.journal)
        .subscribe(
          journal => this.journals = journal,
          error => this.errorMessage = <any>error
        );
      }

}

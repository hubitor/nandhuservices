import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CommonService } from '../../shared/server/service/common.service';
import { UtilityService } from "../../shared/server/service/utility-service"
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { CreateResponse } from '../../shared/models/createResponse';
import { NotificationService } from "../../shared/utils/notification.service";
import { AppConfig } from "../../shared/server/api/app-config";
import { JournalService } from '../../shared/server/service/journal.service';
import { Journal } from '../../shared/models/journal';
import { AppSettings } from "../../shared/server/api/api-settings";
import sha256 from 'crypto-js/sha256';


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  providers: [CommonService, BroadcasterService,UtilityService,JournalService]
})
export class JournalComponent implements OnInit {
  broadcasterUser: boolean;
  journalall: Journal[];
  journal:Journal;
  journals:Journal[];
  errorMessage: string;
  journalForm;
  user: User;
  loginResponse: LoginResponse;
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  broadcasterId: number;
  broadcasterChannelId: number;
  createResponse: CreateResponse;

  constructor(private fb: FormBuilder, private commonService: CommonService, private cookieService: CookieService,
        private broadcasterService: BroadcasterService
        ,private utilityService:UtilityService
      , private journalService:JournalService) {
    this.user = new User();
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    this.superAdmin = false;
    this.entertainmentUser = false;
    if(this.loginResponse.user_type === 'Super Admin'){
      this.superAdmin = true;
      this.entertainmentUser = false;
    } else if(this.loginResponse.user_type === 'Entertainment'){
      this.getChannels(parseInt(localStorage.getItem("broadcaster_id")));
      this.superAdmin = false;
      this.entertainmentUser = true;
    }
    this.broadcasters = new Array();
    this.createResponse = new CreateResponse();
   }

  ngOnInit() {
    this.initForm();
    if (this.superAdmin) {
    this.getBroadcastersall();
    this.getBroadcasterAllGrid();
    }
    else if (this.broadcasterUser) {
    this.getChannels(this.loginResponse.client_id);
    }
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

  initForm(){
    this.journalForm = this.fb.group({
      userActiveStatus: new FormControl(""),
      userFirstName: [null, [Validators.required]],
      userLastName: [null, [Validators.required]],
      userMobile: [null, [Validators.required]],
      userEmail: [null, [Validators.required]],
      userPasswd:[null,[Validators.required]],
      userEmpid:[null,[Validators.required]]
    });
  }

  

  getBroadcastersall(){
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

  getChannels(broadcasterId: number){
    this.broadcasterId = broadcasterId;
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
      }
    );
  };

  onChannelSelect(broadcasterChannelId: number){
    this.broadcasterChannelId = broadcasterChannelId;
    console.log(this.broadcasterChannelId);
  }

  createJournal() {
    const newJournal = this.journalForm.value;
      this.journal = new Journal();
      this.journal.channel_id = this.broadcasterChannelId;
      this.journal.email=newJournal.userEmail;
      this.journal.password =sha256(newJournal.userPasswd).toString();
      this.journal.emp_id = newJournal.userEmpid
      this.journal.first_name =newJournal.userFirstName;
      this.journal.last_name=newJournal.userLastName;
      this.journal.mobile =newJournal.userMobile;
      this.journal.is_active = newJournal.userActiveStatus;
      this.journal.created_by = "uma";
      this.journal.updated_by = "uma";
      this.journalService.createJournal(this.journal).subscribe(
          createResponse => {
            // alert("journal created successfully...");
            window.location.reload();
          },
          error =>
          {
            // alert("Something went wrong!");
            console.log('error in '+ error);
          }
        );  
  }

  amendJournal() {
    const newJournal = this.journalForm.value;
      this.journal = new Journal();
        this.journalService.amendJournal(this.journal).subscribe(
          journal => this.journals = journal,
          error => this.errorMessage = <any>error
          );
        }

}

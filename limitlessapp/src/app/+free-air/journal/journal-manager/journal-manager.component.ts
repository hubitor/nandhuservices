import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterVideos } from '../../shared/models/broadcasterVideos';
import { Language } from '../../shared/models/language';
import { CommonService } from '../../../shared/server/service/common.service';
import { UtilityService } from "../../../shared/server/service/utility-service"
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { VideoUploadResponse } from '../../shared/models/videoUploadResponse';
import { CreateResponse } from '../../../shared/models/createResponse';
import { NotificationService } from "../../shared/utils/notification.service";
import { AppConfig } from "../../shared/server/api/app-config";
import { BroadcasterChannelsService } from '../../../shared/server/service/broadcaster-channels.service';
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
import { AppSettings } from "../../../shared/server/api/api-settings";
import sha256 from 'crypto-js/sha256';
export class videoURL
{
    video_url:string=''
}
@Component({
  selector: 'app-journal-manager',
  templateUrl: './journal-manager.component.html',
  providers: [BroadcasterChannelsService,BroadcasterService,JournalService]
})


export class JournalManagerComponent implements OnInit  {
  broadcasterChannelId: number;
  is_active: boolean;
  
  Id: number;
  journalManagerForm;
  channelId: number;
  errorMessage: string;
  
  superAdmin: boolean;
  entertainmentUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  loginResponse: LoginResponse;
  broadcasterId: number;
  languageId: number;
  createResponse: CreateResponse;
  broadcasterChannel: BroadcasterChannel;
  channelsList: BroadcasterChannel[];
  primaryChannelId: number;
  channelName: string;
  channelImage: string;
  channelSelected: boolean;
  videoList:Array<string> = [];
  constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
    private cookieService: CookieService, private broadcasterService: BroadcasterService
    ) {
    debugger;
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
    this.videoList = new Array();
  }

ngOnInit()
  {
    this.initForm();
    this.getAllBroadcasters();
    //parseInt(localStorage.getItem("broadcaster_id"))
  }



initForm() {
    this.journalManagerForm = this.fb.group({
      jchannelId: [null, [Validators.required]],
      jbroadcasterId: [null, [Validators.required]]
    });
  }


getAllBroadcasters(){
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        if(this.broadcasters.length>0)
        {
            this.journalManagerForm.get('jbroadcasterId').setValue(this.broadcasters[0].id);
            this.getChannels(+this.broadcasters[0].id);
        }
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
        if(this.broadcasterChannels.length>0)
        {
            this.journalManagerForm.get('jchannelId').setValue(this.broadcasterChannels[0].id);
            this.onChannelSelect();
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  formatURL(appl_name,s_name):string
  {
    return "http://journal.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
  }

  
onChannelSelect(){
    debugger;
    var f_broadcaster;
    var j_appl_name;
    if(this.broadcasters.length >0)
    {
        f_broadcaster = this.broadcasters.filter(
            broadcasterId => broadcasterId.id.toString() === this.journalManagerForm.value.jbroadcasterId.toString());
            j_appl_name=f_broadcaster.length>0?f_broadcaster[0].w_j_appl_name:'';
        if(j_appl_name!='')
        {
            this.broadcasterService.getStreamActiveJournal(j_appl_name)
            .subscribe(
            response => 
            {
               if(response.instanceList.length>0)
               {
                   if(response.instanceList[0].incomingStreams.length>0)
                   {
                       var incomingStreams=response.instanceList[0].incomingStreams;
                       incomingStreams.forEach((ics) => { // foreach statement 
                        
                        if(ics.isConnected)
                        {
                            this.videoList.push(this.formatURL(j_appl_name,ics.name));
                        }
                       
                    })  
                   }
                   else
                   {
                    console.log('No journals streams are active');
                   }
               }
               else
               {
                console.log('No journals are active');
               }     
            },
            error => this.errorMessage = <any>error);
        }
        else
        {
            console.log('No application are active');
        }
  
          
    }
  }




}

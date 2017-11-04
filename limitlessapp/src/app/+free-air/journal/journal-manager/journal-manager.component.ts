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
declare var videojs : any;
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
  videoList:videoURL[] = [];
  videourl:videoURL;
  bind_url:string[]=[];
  video_demo:string[]=["http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8"
                       ,"http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8"
                       ,"http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8"
                       ,"http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8"]
  ishowPreview:boolean=true;
  preview_url:string="http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8";
  private videoJSplayer: any;
  constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
    private cookieService: CookieService, private broadcasterService: BroadcasterService
    ) {
    ;
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
    this.videourl=new videoURL();
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
  };

  ngAfterViewInit(){
    this.videoJSplayer = videojs(document.getElementById('preview_8'), {}, function() {
              this.play();
        } );
     }

ngOnDestroy() {
this.videoJSplayer.dispose();
}

  previewVideo()
  {
    (function ($) {
      $(document).ready(function () {
  
          // An example of playing with the Video.js javascript API
          // Will start the video and then switch the source 3 seconds latter
          // You can look at the doc there: http://docs.videojs.com/docs/guides/api.html
          videojs('preview_8_html5_api').ready(function () {
              var myPlayer = this;
              myPlayer.src({type: 'application/x-mpegURL', src: 'http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8'});
  
              $("#change").on('click', function () {
                ;
                  myPlayer.src({type: 'application/x-mpegURL', src: 'http://live.haappyapp.com:1935/ka-ayush/ayush-devotee/ayush-devotee/playlist.m3u8'});
              });
          });
  
      });
  })(jQuery);
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

  formatLiveURL(appl_name,s_name):string
  {
    //return "http://live.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
    return "http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8";
  }

  formatJournalURL(appl_name,s_name):string
  {
    return "http://journal.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
  }

  

  
onChannelSelect(){
    ;
    var f_broadcaster;
    var j_appl_name;
    if(this.broadcasters.length >0)
    {
        f_broadcaster = this.broadcasters.filter(
            broadcasterId => broadcasterId.id.toString() === this.journalManagerForm.value.jbroadcasterId.toString());
            j_appl_name=f_broadcaster.length>0?f_broadcaster[0].w_j_appl_name:'';
            j_appl_name="ka-praaja";
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
                        this.videourl=new videoURL();
                        if(ics.isConnected)
                        {
                            this.videourl.video_url=this.formatLiveURL(j_appl_name,ics.name).toString();
                            var v_url=this.formatLiveURL(j_appl_name,ics.name).toString();
                            this.bind_url.push(v_url);
                            this.bind_url.push(v_url);
                            this.bind_url.push(v_url);
                            this.bind_url.push(v_url);
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

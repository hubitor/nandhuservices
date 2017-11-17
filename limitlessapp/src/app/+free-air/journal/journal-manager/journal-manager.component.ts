import { Component, OnInit,Input  } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../shared/models/userModel';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { CreateResponse } from '../../../shared/models/createResponse';
import { AppConfig } from "../../shared/server/api/app-config";
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
import { AppSettings } from "../../../shared/server/api/api-settings";
declare var videojs : any;
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
export class videoURL
{
    video_url:string=''
}
@Component({
  selector: 'app-journal-manager',
  templateUrl: './journal-manager.component.html',
  providers: [BroadcasterService,JournalService]
})


export class JournalManagerComponent implements OnInit  {
  @Input() status: string;
  journal: Journal;
  public email:string;
  public first_name:string;
  broadcasterChannelId: number;
  is_active: boolean;
  isOnline:boolean;
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
  createResponse: CreateResponse;
  primaryChannelId: number;
  channelSelected: boolean;
  videoList:videoURL[] = [];
  videourl:videoURL;
  public bind_url:string[]=[];
  appl_name:string;
  s_name:string;
  url:string;
  journals: any; 
  public userName:string;
  public incomingStreams:any;
  public sourceIp:any;
  public displayDuration = "01:53";
  journalList: Journal[];
  journalLive: Journal;
  public onlineFlag =navigator.onLine;
  public v_url:string;
  video_demo:string[]=[];
  public finalUrl:string[];
  private videoJSplayer: any;
  public result:string;
  constructor(private fb: FormBuilder, private journalService: JournalService,
    private cookieService: CookieService, private broadcasterService: BroadcasterService) {
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
  }



  initForm() {
    this.journalManagerForm = this.fb.group({
      jchannelId: [null, [Validators.required]],
      jbroadcasterId: [null, [Validators.required]],
    });
  };

  ngAfterViewInit(){
    this.videoJSplayer = videojs(document.getElementById('preview_8_html5_api'), {}, function() {
              this.play();
        } );
     }

  ngOnDestroy() 
  {
  this.videoJSplayer.dispose();
  }

  formatJournalURL(appl_name,s_name):string
  {
    var streamName=s_name.split("-");
   this.userName =streamName[streamName.length-1];
    console.log("User Name::::"+this.userName);
  var type;
    switch(type){
      case 'http':
      this.result="http://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
      break;
      case 'rtmp':
      this.result="rtmp://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"";
      break;
      case 'rtsp':
      this.result="rtsp://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"";
      break;
      default:
      this.result="http://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";

    };
        return  this.result;
    // var http:string="http://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
    // var rtmp:string="rtmp://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"";
    // var rtsp:string="rtsp://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"";

    // return "http://journal2.haappyapp.com:1935/"+appl_name+"/"+s_name+"/playlist.m3u8";
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
            this.getJournalsVideos(+this.broadcasterChannels[0].id);
            this.onChannelSelect();
        }
      },
      error => {
        console.log(error);
      }
    );
  };


  getJournalsVideos(channelId: number) {
    this.journalService.getJournalsByChannel(channelId).subscribe(
      journals => {
        this.journals = journals;
        if(this.journals.length>0){
          this.channelSelected = true;
          this.journalList = [];
          var journalLength= this.journals.length;
          for(var i=0; i<journalLength; i++){
            if(this.journals.is_active === true){
              this.journalLive = this.journals[i];
            
            } else {
              this.journalList.push(this.journals[i]);
              this.first_name = this.journals[i].first_name;
              console.log("First Name:::"+this.first_name);
              this.email = this.journals[i].email;
              console.log("Email:::"+this.email);
              this.onlineCheck();
             
            }
          }
        }
       
      },
      error => {
        console.log("journal list::"+error);
       
      }
    );
  }

  onlineCheck()
  {
    let xhr = new XMLHttpRequest();
    return new Promise((resolve, reject)=>{
        xhr.onload = () => {
          
            this.isOnline = true;
            resolve(true);
            console.log("user is in online "+this.isOnline);
        };
        xhr.onerror = () => {
           
            this.isOnline = false;
            reject(false);
            console.log("user is in offline "+this.isOnline);

        };
        xhr.open('GET',this.email, true);
        console.log("online User "+this.email);
        xhr.send();
    });



  }

  clickHandler() 
  {
    this.onlineCheck().then(() => {
       
    }).catch(() => {
       
        alert('Sorry, no internet.');
    });
  }

  previewVideo()
  {
    var mainUrl:string[]=this.finalUrl;
    (function ($) {
      $(document).ready(function () {
          // An example of playing with the Video.js javascript API
          // Will start the video and then switch the source 3 seconds latter
          // You can look at the doc there: http://docs.videojs.com/docs/guides/api.html
          videojs('preview_8_html5_api').ready(function () {
              var myPlayer = this;
              myPlayer.src({type: 'application/x-mpegURL', src:mainUrl});
              console.log("screen output"+mainUrl);

              $("#change").on('click', function () {
                ;
                  myPlayer.src({type: 'application/x-mpegURL', src:mainUrl});
                  console.log("output"+mainUrl);
              });
          });
  
      });
  })(jQuery);
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
        if(j_appl_name!='')
        {
            this.broadcasterService.getStreamTargetJournal(j_appl_name)
            .subscribe(
                response => 
            {
              console.log('length ::'+response.instanceList.length)
               if(response.instanceList.length>0)
               {
                 console.log('instance ::'+JSON.stringify(response.instanceList[0]));
                   if(response.instanceList[0].incomingStreams.length>0)
                   {
                    console.log('instance :length:'+response.instanceList[0].incomingStreams.length);
                       this.incomingStreams=response.instanceList[0].incomingStreams;
                       console.log('incomingStreams::'+JSON.stringify(this.incomingStreams));
                       this.incomingStreams.forEach((ics) => { // foreach statement 
                        this.videourl=new videoURL();
                        console.log("video Url"+ this.videourl)
                        if(ics.isConnected)
                        {
                          console.log('ics.isConnected::'+ics.isConnected);
                            this.videourl.video_url=this.formatJournalURL(j_appl_name,ics.name).toString();
                            var v_url=this.formatJournalURL(j_appl_name,ics.name).toString();
                            console.log('videourl::'+this.videourl.video_url);
                            console.log('v_url::'+v_url);
                            this.bind_url.push(v_url);
                            this.finalUrl=this.bind_url;
                            console.log("finalUrl:::"+this.finalUrl);
                            console.log('this.bind_url::'+this.bind_url);
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

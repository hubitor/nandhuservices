import { Component, OnInit, Input } from '@angular/core';
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
declare var videojs: any;
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { DatePipe } from '@angular/common';
import { Request } from '@angular/http/src/static_request';
import { request } from 'http';
import { JournalManagerRequest } from '../../../shared/models/journal-manager-request';
import {JournalAndSetting} from '../../../shared/models/journalAndSetting';
import { ChannelCategory } from "../../../shared/models/channelCategory";
import { JournalSetting } from '../../../shared/models/journal-setting';


export class videoURL {
  video_url: string = ''
}
@Component({
  selector: 'app-journal-manager',
  templateUrl: './journal-manager.component.html',
  providers: [BroadcasterService, JournalService, DatePipe]
})


export class JournalManagerComponent implements OnInit {
  journal: Journal;
  public email: string;
  public first_name: string;
  public thumbnailUrl:string;
  public stream_name:string;
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
  createResponse: CreateResponse;
  primaryChannelId: number;
  channelSelected: boolean;
  videoList: videoURL[] = [];
  videourl: videoURL;
  journalManagerRequest: JournalManagerRequest
  public bind_url: string[] = [];
  appl_name: string;
  s_name: string;
  journals: Journal[];
  onlineJournal: Journal;
  public userName: string;
  public incomingStreams: any;
  public sourceIp: any;
  public displayDuration = "01:53";
  journalList: JournalManagerRequest[];
  journalLive: Journal;
  public onlineFlag = navigator.onLine;
  public v_url: string;
  public finalUrl: string[];
  private videoJSplayer: any;
  public result: string;
  onlineStatus: string;
  public hlsurl: string;
  public rtmpurl: string;
  public rtspurl: string;
  journalwithSetting: JournalAndSetting[];
  channelCategories: ChannelCategory;
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
    this.journalList = new Array();
    this.videourl = new videoURL();
    // this.journalLive = new Journal();
  }

  ngOnInit() {
    this.initForm();
    this.getAllBroadcasters();
  }



  initForm() {
    this.journalManagerForm = this.fb.group({
      jchannelId: [null, [Validators.required]],
      jbroadcasterId: [null, [Validators.required]],
    });
  };

  ngAfterViewInit() {
    this.videoJSplayer = videojs(document.getElementById('preview_8_html5_api'), {}, function () {
      this.play();
    });
  }

  ngOnDestroy() {
    this.videoJSplayer.dispose();
  }

 

  formatThumbnailURL(appl_name, s_name): string
  {
      //http://[wowza-ip-address]:8086/transcoderthumbnail?application=live&streamname=myStream&format=jpeg&size=320x240
      return "http://journal2.haappyapp.com:8086/transcoderthumbnail?application="+appl_name+"&streamname=" + s_name + "&format=jpeg&size=200x150"
  }

  formatJournalURL(appl_name, s_name, type): string {
    var streamName = s_name.split("-");
    this.userName = streamName[streamName.length - 1];
    console.log("User Name::::" + this.userName);
    var type;
    switch (type) {
      case "http": {
        type = "http";
        this.result = "http://journal2.haappyapp.com:1935/" + appl_name + "/" + s_name + "/playlist.m3u8";
        break;
      }


      case "rtmp": {
        type = "rtmp";
        this.result = "rtmp://journal2.haappyapp.com:1935/" + appl_name + "/" + s_name;
        break;
      }

      case "rtsp": {
        type = "rtsp";
        this.result = "rtsp://journal2.haappyapp.com:1935/" + appl_name + "/" + s_name;
        break;
      }

      default: {
        type = 'http';
        this.result = "http://journal2.haappyapp.com:1935/" + appl_name + "/" + s_name + "/playlist.m3u8";
        break;
      }

    };
    return this.result;
  }



  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        if (this.broadcasters.length > 0) {
          this.journalManagerForm.get('jbroadcasterId').setValue(this.broadcasters[0].id);
          this.getChannels(+this.broadcasters[0].id);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getChannels(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        if (this.broadcasterChannels.length > 0) {
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
    var f_journal;
    this.journalService.getJournalsByChannel(channelId).subscribe(
      journals => {
        this.journals=journals;
        if (this.journals.length > 0) {
          this.channelSelected = true;
          this.journalList = [];
          var journalLength = this.journals.length;
          for (var i = 0; i < journalLength; i++) {
            var jmrequest = new JournalManagerRequest();
            jmrequest = null;
          }
        }

      },
      error => {
        console.log("journal list::" + error);

      }
    );
  }

  onStreamName(journalSetting){
    var f_journal;
    if(journalSetting.length>0){
      this.journals=journalSetting;
      var filterSetting=journalSetting.filter(sachannel => sachannel.journal_id === journalSetting.id);
      this.channelCategories = filterSetting.length > 0 ? filterSetting[0].journal_settings : [];
      f_journal = this.journals.filter(
        // jId => jId.id.toString() === journalSetting.id.toString());
        broadcasterId => broadcasterId.id === this.journals[0].id);
        
        // this.stream_name = f_broadcaster.length > 0 ? f_broadcaster[0].stream_name : '';
        this.stream_name=f_journal.length && filterSetting[0].journal_settings.length>0? f_journal[0].journal_settings[0].stream_name:'';
        console.log("StreamNAme"+this.stream_name);
        

    }
  }


  previewVideo() {
    var mainUrl: string = this.hlsurl;
    (function ($) {
      $(document).ready(function () {
        // An example of playing with the Video.js javascript API
        // Will start the video and then switch the source 3 seconds latter
        // You can look at the doc there: http://docs.videojs.com/docs/guides/api.html
        videojs('preview_8_html5_api').ready(function () {
          var myPlayer = this;
          myPlayer.src({ type: 'application/x-mpegURL', src: mainUrl });
          console.log("screen output:::" +mainUrl);

          $("#change").on('click', function () {
            ;
            myPlayer.src({ type: 'application/x-mpegURL', src: mainUrl });
            console.log("output:::" + mainUrl);
          });
        });

      });
    })(jQuery);
  }

  onChannelSelect() {
    ;
    var f_broadcaster;
    var j_appl_name;
    var type;
    var w_get_target_url ;
    if (this.broadcasters.length > 0) {
      f_broadcaster = this.broadcasters.filter(
        broadcasterId => broadcasterId.id.toString() === this.journalManagerForm.value.jbroadcasterId.toString());
      j_appl_name = f_broadcaster.length > 0 ? f_broadcaster[0].w_j_appl_name : '';
      w_get_target_url = f_broadcaster.length > 0 ? f_broadcaster[0].w_get_target_url : '';
      if (j_appl_name != '') {
        this.broadcasterService.getStreamTargetJournal(j_appl_name)
          .subscribe(
          response => {
            if (response.instanceList.length > 0) {
              if (response.instanceList[0].incomingStreams.length > 0) {
                this.incomingStreams = response.instanceList[0].incomingStreams;
                this.incomingStreams.forEach((ics) => { // foreach statement 
                  this.videourl = new videoURL();
                  if (ics.isConnected) {
                    this.videourl.video_url = this.formatJournalURL(j_appl_name, ics.name, type).toString();
                    var v_url = this.formatJournalURL(j_appl_name, ics.name, type).toString();
                    this.bind_url.push(v_url);
                    this.finalUrl = this.bind_url;
                    let onlineuser = this.journals.filter(journal => {
                      console.log(journal.first_name + '::journal.first_name');
                      console.log(ics.name + '::ics.name');
                      if (ics.name.search(journal.first_name) != -1) { return true; } else {
                        return false;
                      }
                    });
                    let offLineUser = this.journals.filter(journal => {
                      console.log(journal.first_name + '::journal.first_name');
                      console.log(ics.name + '::ics.name');

                      if (ics.name.search(journal.first_name) == -1) { return true; } else {
                        return false;
                      }
                    });
                    console.log('++++++onlineuser+++++++' + JSON.stringify(onlineuser));
                    console.log('**onlineuser**' + onlineuser.length);
                    if (onlineuser && onlineuser.length > 0) {
                      this.journals.forEach(jornal => {
                        if (jornal.first_name == onlineuser[0].first_name) {
                          var jmrequest = new JournalManagerRequest();
                          this.onlineJournal = onlineuser[0];
                          jmrequest.onlineStatus = 'online';

                          jmrequest.hlsurl = this.formatJournalURL(j_appl_name, ics.name, "http");
                          console.log("http::::::" + "ics.name::" + ics.name + ':::j_appl_name::' + j_appl_name + ":::" + jmrequest.hlsurl);
                          this.hlsurl = jmrequest.hlsurl;

                          jmrequest.rtmpurl = this.formatJournalURL(j_appl_name, ics.name, "rtmp");
                          console.log("rtmp:::::" + jmrequest.rtmpurl);
                          this.rtmpurl = jmrequest.rtmpurl;

                          jmrequest.rtspurl = this.formatJournalURL(j_appl_name, ics.name, "rtsp");
                          console.log("rtsp::::::" + jmrequest.rtspurl);
                          this.rtspurl = jmrequest.rtspurl;


                          jmrequest.first_name = onlineuser[0].first_name;
                          console.log('name :::::::::::' + jmrequest.first_name);
                          this.first_name = jmrequest.first_name;

                          jmrequest.thumbnailUrl = this.formatThumbnailURL(j_appl_name, ics.name);
                          console.log("thumbnailUrl::::::" + jmrequest.thumbnailUrl);
                          this.thumbnailUrl = jmrequest.thumbnailUrl;



                          this.journalList.push(jmrequest);

                        } else {
                          if (this.onlineJournal) {
                            var index = this.journals.indexOf(this.onlineJournal, 0);
                            if (index > -1) {
                              this.journals.splice(index, 1);
                            }
                          }
                          this.journals.forEach(joun => {
                            var jmrequest = new JournalManagerRequest();
                            jmrequest.first_name = joun.first_name;
                            jmrequest.onlineStatus = 'OffLine';
                            jmrequest.hlsurl='OffLine';
                            jmrequest.rtmpurl='OffLine';
                            jmrequest.rtspurl='OffLine';
                            jmrequest.thumbnailUrl ="http://www.cascadeumc.org/fullpanel/uploads/files/cascade-livestreaming-01.jpg";
                            this.thumbnailUrl = jmrequest.thumbnailUrl;                            
                            this.journalList.push(jmrequest);
                          });
                        }
                      });


                    }

                  } else {
                    console.log('not connected');
                    console.log('No journals are active');
                    console.log(this.journals.length);
                    if (this.onlineJournal) {
                      var index = this.journals.indexOf(this.onlineJournal, 0);
                      if (index > -1) {
                        this.journals.splice(index, 1);
                      }
                    }
                    this.journals.forEach(joun => {
                      var jmrequest = new JournalManagerRequest();
                      jmrequest.first_name = joun.first_name;
                      jmrequest.onlineStatus = 'OffLine';
                      jmrequest.hlsurl='OffLine';
                      jmrequest.rtmpurl='OffLine';
                      jmrequest.rtspurl='OffLine';
                      jmrequest.thumbnailUrl ="http://www.cascadeumc.org/fullpanel/uploads/files/cascade-livestreaming-01.jpg";
                      this.thumbnailUrl = jmrequest.thumbnailUrl;   
                      this.journalList.push(jmrequest);
                    });
                  }
                })
              }
              else {
                console.log('No journals streams are active');
                console.log('No journals are active');
                console.log(this.journals.length);
                if (this.onlineJournal) {
                  var index = this.journals.indexOf(this.onlineJournal, 0);
                  if (index > -1) {
                    this.journals.splice(index, 1);
                  }
                }
                this.journals.forEach(joun => {
                  var jmrequest = new JournalManagerRequest();
                  jmrequest.first_name = joun.first_name;
                  jmrequest.onlineStatus = 'OffLine';
                  jmrequest.hlsurl='OffLine';
                  jmrequest.rtmpurl='OffLine';
                  jmrequest.rtspurl='OffLine';
                  jmrequest.thumbnailUrl ="http://www.cascadeumc.org/fullpanel/uploads/files/cascade-livestreaming-01.jpg";
                  this.thumbnailUrl = jmrequest.thumbnailUrl;  
                  this.journalList.push(jmrequest);
                });
              }
            }
            else {
              console.log('No journals are active');
              console.log(this.journals.length);
              if (this.onlineJournal) {
                var index = this.journals.indexOf(this.onlineJournal, 0);
                if (index > -1) {
                  this.journals.splice(index, 1);
                }
              }
              var f_journal=this.journals.forEach(joun => {
               
                var jmrequest = new JournalManagerRequest();
                jmrequest.first_name = joun.first_name;
                console.log("firstName"+joun.first_name);

                jmrequest.onlineStatus = 'OffLine';
                jmrequest.hlsurl='OffLine';
                jmrequest.rtmpurl='OffLine';
                jmrequest.rtspurl='OffLine';
                
                // var journalUser = this.journals.filter(
                // destKey => destKey.id === this.journals[0].id);

                jmrequest.thumbnailUrl ="http://www.cascadeumc.org/fullpanel/uploads/files/cascade-livestreaming-01.jpg";
                this.thumbnailUrl = jmrequest.thumbnailUrl;  
                this.journalList.push(jmrequest);
                jmrequest=null;
              });
            }
          },
          error => this.errorMessage = <any>error);
      }

      else {
        console.log('No application are active');
      }


    }

  }

}
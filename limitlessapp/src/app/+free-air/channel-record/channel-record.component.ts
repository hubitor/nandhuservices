import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { CreateResponse } from '../../shared/models/createResponse';
import { AppConfig } from "../../shared/server/api/app-config";
import { AppSettings } from "../../shared/server/api/api-settings";
import { ChannelCategory } from "../../shared/models/channelCategory";
import { ChannelRecordRequest } from '../../shared/models/channel-record-request';
declare var videojs: any;
export class videoURL {
  video_url: string = ''
}
import videoJs from 'video.js';
import * as HLS from 'videojs-contrib-hls';

@Component({
  selector: 'app-channel-record',
  templateUrl: './channel-record.component.html',
  providers: [BroadcasterService, CookieService]
})
export class ChannelRecordComponent {
  stopUrl: string;
  startUrl: string;
  public finalUrl: string;
  public bind_url: string[] = [];
  broadcaster: Broadcasters;
  broadcasterChannelId: number;
  is_active: boolean;
  Id: number;
  channelRecordForm;
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
  channelCategories: ChannelCategory;
  client_id: number;
  user: LoginResponse;
  w_applicationName: string;
  public incomingStreams: any;
  public sourceIp: any;
  videoList: videoURL[] = [];
  videourl: videoURL;
  private videoJSplayer: any;
  public result: string;
  onlineChannels: BroadcasterChannel;
  channelList: ChannelRecordRequest[];
  public thumbnailUrl: string;
  public displayDuration = "01:53";

  constructor(private fb: FormBuilder,
    private cookieService: CookieService, private broadcasterService: BroadcasterService) {
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    this.w_applicationName = localStorage.getItem('w_appname');
    if (this.user.user_type === "Super Admin") {
      this.client_id = 1064;
      this.user.client_id = 1064;
      this.w_applicationName = "dev";

    }
    else {
      this.w_applicationName = this.user.w_appname;
      this.client_id = this.user.client_id;
    }
    this.channelSelected = false;
    this.createResponse = new CreateResponse();
  }

  ngOnInit() {
    this.initForm();
    this.getAllBroadcastersById(this.client_id);
  }

  initForm() {
    this.channelRecordForm = this.fb.group({
      jchannelId: [this.user.primary_channel_id ? this.user.primary_channel_id : 140, Validators.required],
      jbroadcasterId: [this.user.client_id ? this.user.client_id : 1064, Validators.required],
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

  getAllBroadcastersById(broadcaterId) {
    if (this.client_id === 1064) {
      this.broadcasterService.getAllBroadcasters()
        .subscribe(
        broadcasters => {
          this.broadcasters = broadcasters;
          this.getChannels(broadcaterId);
        },
        error => this.errorMessage = <any>error);
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcaterId)
        .subscribe(
        broadcasters => {
          this.broadcaster = broadcasters;
          this.getChannels(broadcaterId);

        },
        error => this.errorMessage = <any>error);
    }


  }


  getChannels(broadcasterId) {
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
        if (this.broadcasterChannels.length > 0) {
          this.channelRecordForm.get('jchannelId').setValue(this.broadcasterChannels[0].id);
          this.onChannelSelect(this.broadcasterChannels[0].id);
        }
      },
      error => {
        console.log(error);
      }
    );

  };

  formatThumbnailURL(appl_name, s_name): string {
    //http://[wowza-ip-address]:8086/transcoderthumbnail?application=live&streamname=myStream&format=jpeg&size=320x240

    return "http://live.haappyapp.com:8086/transcoderthumbnail?application=" + appl_name + "&streamname=" + s_name + "&format=jpeg&size=200x150"
  }

  formatChannelURL(appl_name, s_name, type): string {
    var type;
    switch (type) {
      case "http": {
        type = "http";
        this.result = "http://live.haappyapp.com:1935/" + appl_name + "/" + s_name + "/" + s_name + "/playlist.m3u8";
        break;
      }


      case "rtmp": {
        type = "rtmp";
        this.result = "rtmp://live.haappyapp.com:1935/" + appl_name + "/" + s_name + "/" + s_name;
        break;
      }

      case "rtsp": {
        type = "rtsp";
        this.result = "rtsp://live.haappyapp.com:1935/" + appl_name + "/" + s_name + "/" + s_name;
        break;
      }

      default: {
        type = 'http';
        this.result = "http://live.haappyapp.com:1935/" + appl_name + "/" + s_name + "/" + s_name + "/playlist.m3u8";
        break;
      }

    };
    return this.result;
  }

  startRecording() {
    var w_app_name;
    var c_stream;
    var channelrequest = new ChannelRecordRequest();
    this.broadcasterChannels.forEach(channels => {
      channelrequest.id = channels.id;
      channelrequest.w_application_name = channels.w_application_name;
      w_app_name = channelrequest.w_application_name;
      channelrequest.ch_stream_name = channels.ch_stream_name;
      c_stream = channelrequest.ch_stream_name;
    });
    this.broadcasterService.getStartRecording(w_app_name, c_stream).subscribe(
      response => {
        if (response.instanceList.length > 0) {
          return "true";
        }

      },
      error => {
        console.log(error);
      }
    );
  }


  stopRecording() {
    var w_app_name;
    var c_stream;
    var channelrequest = new ChannelRecordRequest();
    this.broadcasterChannels.forEach(channels => {
      channelrequest.id = channels.id;
      channelrequest.w_application_name = channels.w_application_name;
      w_app_name = channelrequest.w_application_name;
      channelrequest.ch_stream_name = channels.ch_stream_name;
      c_stream = channelrequest.ch_stream_name;
    });
    this.broadcasterService.getStopRecording(w_app_name, c_stream).subscribe(
      response => {
        if (response.instanceList.length > 0) {
          return "true";
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  previewVideo(finalUrl) {
    var mainUrl: string = finalUrl;
    (function ($) {
      $(document).ready(function () {
        // An example of playing with the Video.js javascript API
        // Will start the video and then switch the source 3 seconds latter
        // You can look at the doc there: http://docs.videojs.com/docs/guides/api.html
        videojs('preview_8_html5_api').ready(function () {
          var myPlayer = this;
          myPlayer.src({ type: 'application/x-mpegURL', src: mainUrl });
          console.log("screen output:::" + mainUrl);

          $("#change").on('click', function () {
            ;
            myPlayer.src({ type: 'application/x-mpegURL', src: mainUrl });
            console.log("output::::::" + mainUrl);
          });
        });

      });
    })(jQuery);
  }

  onChannelSelect(broadcasterId) {
    var type;
    var f_broadcaster;
    var w_appl_name;
    var w_get_target_api;
    var channel_id;
    this.channelList = [];
    this.broadcasterChannels.forEach(channels => {
      var channelrequest = new ChannelRecordRequest();
      channelrequest.channel_name = channels.channel_name;
      channelrequest.id = channels.id;
      channel_id = channelrequest.id;
      channelrequest.w_application_name = channels.w_application_name;
      w_appl_name = channelrequest.w_application_name;
      channelrequest.w_get_target_api = channels.w_get_target_api;
      w_get_target_api = channelrequest.w_get_target_api;
      channelrequest.ch_stream_name = channels.ch_stream_name;
      channelrequest.broadcaster_id = channels.broadcaster_id;

      if (w_appl_name != '') {
        this.broadcasterService.getStreamActiveChannel(w_appl_name, channelrequest.broadcaster_id, w_get_target_api)
          .subscribe(
          response => {
            if (response.instanceList.length > 0) {
              if (response.instanceList[0].incomingStreams.length > 0) {
                var incomingStreams = response.instanceList[0].incomingStreams;
                incomingStreams.forEach((ics) => { // foreach statement 
                  this.videourl = new videoURL();
                  if (ics.isConnected) {
                    this.videourl.video_url = this.formatChannelURL(w_appl_name, channelrequest.ch_stream_name, type).toString();
                    var v_url = this.formatChannelURL(w_appl_name, channelrequest.ch_stream_name, type).toString();
                    this.bind_url.push(v_url);
                    channelrequest.finalUrl = v_url;
                    this.finalUrl=channelrequest.finalUrl;
                    channelrequest.thumbnailUrl ="https://d3c243y8mg3na8.cloudfront.net/streaming_images/offline_thumbnailurl.jpg";
                    this.thumbnailUrl = channelrequest.thumbnailUrl;
                    this.channelList.push(channelrequest);
                  }

                })
              }
              else {
                console.log('No channels streams are active');
              }
            }
            else {
              console.log('No channels are active');
            }
          },
          error => this.errorMessage = <any>error);
      }

    });



  }

}

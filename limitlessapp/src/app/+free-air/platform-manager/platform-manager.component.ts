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
import { StreamTargetRequest } from "../../shared/models/stream-target-request";
import { DatePipe } from '@angular/common';
import { StreamNotificationRequest } from "../../shared/models/stream-notify-request"
import { NotificationService } from '../../shared/utils/notification.service';
import { BroadcasterVideos } from "../../shared/models/broadcasterVideos"
import { error } from 'selenium-webdriver';
import { DestinationRequest } from '../../shared/models/destination-request';
import { ChannelVideos } from 'app/shared/models/channel-videos';
@Component({
  selector: 'app-platform-manager',
  templateUrl: './platform-manager.component.html',
  providers: [BroadcasterService, DatePipe]
})


export class PlatformManagerComponent implements OnInit {
  broadcasterVideosList: any[];
  destination_name: any;
  broadcaster_channel_id: number;
  destination_image: string;
  destinationList: DestinationRequest[];
  broadcaster: Broadcasters;
  destination: DestinationRequest[];
  destinations: DestinationRequest;
  w_applicationName: string;
  client_id: number;
  user: LoginResponse;
  channelCategories: ChannelCategory;
  broadcasterChannelId: number;
  platformManagerForm;
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
  streamTargetRequest: StreamTargetRequest;
  broadcasterDestinations;
  public streamTargetVal: any;
  w_get_target_url: string
  public Status: any;
  ytStatus = "OffLine";
  fbStatus = "OffLine";
  psStatus = "OffLine";
  haStatus = "OffLine";
  fb1Status = "OffLine";
  fb2Status = "OffLine";
  fb3Status = "OffLine";
  fb4Status = "OffLine";
  fb5Status = "OffLine";
  fp_start_time: string;
  yt_start_time: string;
  ps_start_time: string;
  ha_start_time: string;
  fb1_start_time: string;
  fb2_start_time: string;
  fb3_start_time: string;
  fb4_start_time: string;
  fb5_start_time: string;
  public d_id: number;
  fb_destination_image: string;
  yt_destination_image: string;
  ha_destination_image: string;
  ps_destination_image: string;
  fb1_destination_image: string;
  fb2_destination_image: string;
  fb3_destination_image: string;
  fb4_destination_image: string;
  fb5_destination_image: string;
  onDestination: DestinationRequest;
  public selectedChannel: any;
  broadcasterVideos: BroadcasterVideos[];
  showAll: boolean;
  showOneChannel: boolean;
  public broadcasterchannel: string[];
  public broadcasterChannelname: string;
  channelVideosList: ChannelVideos[];
  channelVideos: ChannelVideos;



  constructor(private fb: FormBuilder, private cookieService: CookieService,
    private datePipe: DatePipe, private notificationService: NotificationService,
    private broadcasterService: BroadcasterService) {

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
    this.showAll = true;
    this.showOneChannel = false;
    this.channelVideosList = new Array();
    this.channelVideos = new ChannelVideos();


  }

  ngOnInit() {
    this.initForm();
    this.getAllBroadcastersById(this.client_id);
  }



  initForm() {
    this.platformManagerForm = this.fb.group({
      broadcasterName: [this.user.client_id ? this.user.client_id : 1064, Validators.required],
      broadcasterChannelCategoryName: [this.user.primary_channel_id ? this.user.primary_channel_id : 140, Validators.required],

    });
  };

  getAllBroadcastersById(broadcaterId) {
    if (this.client_id === 1064) {
      this.broadcasterService.getAllBroadcasters()
        .subscribe(
        broadcasters => {

          this.broadcasters = broadcasters;
          this.getChannels(broadcasters);
          this.setChannelselectedValue(broadcasters = broadcasters);
          var filterBroadcaster = broadcasters.filter(sachannel => sachannel.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
          this.w_get_target_url = broadcasters.length > 0 ? broadcasters[0].w_get_target_url : '';
          console.log(this.w_get_target_url);
          this.w_applicationName = broadcasters.length > 0 ? broadcasters[0].w_application_name : '';
          console.log(this.w_applicationName);

        },
        error => this.errorMessage = <any>error);
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcaterId)
        .subscribe(
        broadcasters => {
          this.broadcaster = broadcasters;
          this.getChannels(broadcasters);
          this.setChannelselectedValue(broadcasters = broadcasters);
        },

        error => this.errorMessage = <any>error);
    }
    // this.streamTargetKeyResponse(this.w_applicationName.trim(), this.platformManagerForm.value.broadcasterName, this.w_get_target_url));

  }



  getChannels(broadcaterId) {
    this.broadcasterService.getChannelsByBroadcasterId(this.broadcasterId).subscribe(
      channelCategories => {
        this.broadcasterChannels = channelCategories;
        var channellength = this.broadcasterChannels.length;
        if (this.broadcasterChannels.length > 0) {

          for (var j = 0; j < channellength; j++) {
            console.log("!!!!!!!" + this.broadcasterChannels[j].id);
            this.platformManagerForm.get('broadcasterChannelCategoryName').setValue(this.broadcasterChannels[0].id);
            this.getDestinationImage(+this.broadcasterChannels[j].id);
            // this.setChannelselected(+this.broadcasterChannels[j].id);
          }
        }

      },
      error => {
        console.log(error);
      }
    );

  };


  onChannelSelect(broadcasterChannelId) {
    this.broadcasterChannelId = broadcasterChannelId;
    this.showAll = false;
    this.showOneChannel = true;
    console.log(this.broadcasterChannelId);
    this.broadcasterchannel = broadcasterChannelId.split(",");
    this.broadcasterChannelId = parseInt(this.broadcasterchannel[0]);
    this.broadcasterChannelname = this.broadcasterchannel[1];
    this.getDestinationImage(broadcasterChannelId);
    this.getChannelVideos(broadcasterChannelId);

  }



  getDestinationImage(channelId: number) {
    var d_id;
    this.broadcasterService.getDestinationImagesByChannelId(channelId).subscribe(
      destimg => {

        this.destination = destimg;
        if (this.destination.length > 0) {
          this.destinationList = [];
          var destLength = this.destination.length;
          for (var i = 0; i < destLength; i++) {
            var destinationRequest = new DestinationRequest();
            this.d_id = this.destination[i].d_id;

            if (this.d_id === 1) {
              destinationRequest.fb_destination_image = this.destination[0].destination_image;
              this.fb_destination_image = destinationRequest.fb_destination_image;

            }
            else if (this.d_id === 2) {
              destinationRequest.yt_destination_image = this.destination[1].destination_image;
              this.yt_destination_image = destinationRequest.yt_destination_image;

            }
            else if (this.d_id === 3) {
              destinationRequest.ha_destination_image = this.destination[2].destination_image;
              this.ha_destination_image = destinationRequest.ha_destination_image;

            }
            else if (this.d_id === 4) {
              destinationRequest.ps_destination_image = this.destination[3].destination_image;
              this.ps_destination_image = destinationRequest.ps_destination_image;

            }
            else if (this.d_id === 5) {
              destinationRequest.fb1_destination_image = this.destination[4].destination_image;
              this.fb1_destination_image = destinationRequest.fb1_destination_image;

            }
            else if (this.d_id === 6) {
              destinationRequest.fb2_destination_image = this.destination[5].destination_image;
              this.fb2_destination_image = destinationRequest.fb2_destination_image;

            }
            else if (this.d_id === 7) {
              destinationRequest.fb3_destination_image = this.destination[6].destination_image;
              this.fb3_destination_image = destinationRequest.fb3_destination_image;

            }
            else if (this.d_id === 8) {
              destinationRequest.fb4_destination_image = this.destination[7].destination_image;
              this.fb4_destination_image = destinationRequest.fb4_destination_image;
            }
            else if (this.d_id === 9) {
              destinationRequest.fb5_destination_image = this.destination[8].destination_image;
              this.fb5_destination_image = destinationRequest.fb5_destination_image;
            }
            this.destinationList.push(destinationRequest);

          }
        }

      },
      error => this.errorMessage = error
    );


  }

  setChannelselected(channelId) {
    for (var i: number = 0; i < channelId.length; i++) {
      this.broadcasterService.getChannelLiveVideo(channelId[i].id).subscribe(
        channelVideos => {
          this.channelVideosList.push(channelVideos);
          console.log("selescted Videos" + JSON.stringify(this.channelVideos));
          var broadcastervideoRequest = new BroadcasterVideos();
          this.broadcasterVideosList = [];
          broadcastervideoRequest.fp_start_time = channelVideos.videos[0].fp_start_time;
          console.log("Fb  starttime" + channelVideos.videos[0].fp_start_time);
          this.fp_start_time = channelVideos.videos[0].fp_start_time;
          broadcastervideoRequest.yt_start_time = channelVideos.videos[0].yt_start_time;
          this.yt_start_time = channelVideos.videos[0].yt_start_time;
          broadcastervideoRequest.ha_start_time = channelVideos.videos[0].ha_start_time;
          this.ha_start_time = channelVideos.videos[0].ha_start_time;
          broadcastervideoRequest.ps_start_time = channelVideos.videos[0].ps_start_time;
          this.ps_start_time = channelVideos.videos[0].ps_start_time;
          broadcastervideoRequest.fb1_start_time = channelVideos.videos[0].fb1_start_time;
          this.fb1_start_time = channelVideos.videos[0].fb1_start_time;
          broadcastervideoRequest.fb2_start_time = channelVideos.videos[0].fb2_start_time;
          this.fb2_start_time = channelVideos.videos[0].fb2_start_time;
          broadcastervideoRequest.fb3_start_time = channelVideos.videos[0].fb3_start_time;
          this.fb3_start_time = channelVideos.videos[0].fb3_start_time;
          broadcastervideoRequest.fb4_start_time = channelVideos.videos[0].fb4_start_time;
          this.fb4_start_time = channelVideos.videos[0].fb4_start_time;
          broadcastervideoRequest.fb5_start_time = channelVideos.videos[0].fb5_start_time;
          this.fb5_start_time = channelVideos.videos[0].fb5_start_time;
          this.broadcasterVideosList.push(broadcastervideoRequest);
        }
      );
    }
    this.streamTargetKeyResponse();

  }

  getChannelVideos(channelId: number) {
    this.broadcasterService.getChannelLiveVideo(channelId).subscribe(
      channelVideos => {
        this.channelVideos = channelVideos;
        console.log("selescted Videos" + JSON.stringify(this.channelVideos));
        var broadcastervideoRequest = new BroadcasterVideos();
        this.broadcasterVideosList = [];
        broadcastervideoRequest.fp_start_time = channelVideos.videos[0].fp_start_time;
        console.log("Fb  starttime" + channelVideos.videos[0].fp_start_time);
        this.fp_start_time = channelVideos.videos[0].fp_start_time;
        broadcastervideoRequest.yt_start_time = channelVideos.videos[0].yt_start_time;
        this.yt_start_time = channelVideos.videos[0].yt_start_time;
        broadcastervideoRequest.ha_start_time = channelVideos.videos[0].ha_start_time;
        this.ha_start_time = channelVideos.videos[0].ha_start_time;
        broadcastervideoRequest.ps_start_time = channelVideos.videos[0].ps_start_time;
        this.ps_start_time = channelVideos.videos[0].ps_start_time;
        broadcastervideoRequest.fb1_start_time = channelVideos.videos[0].fb1_start_time;
        this.fb1_start_time = channelVideos.videos[0].fb1_start_time;
        broadcastervideoRequest.fb2_start_time = channelVideos.videos[0].fb2_start_time;
        this.fb2_start_time = channelVideos.videos[0].fb2_start_time;
        broadcastervideoRequest.fb3_start_time = channelVideos.videos[0].fb3_start_time;
        this.fb3_start_time = channelVideos.videos[0].fb3_start_time;
        broadcastervideoRequest.fb4_start_time = channelVideos.videos[0].fb4_start_time;
        this.fb4_start_time = channelVideos.videos[0].fb4_start_time;
        broadcastervideoRequest.fb5_start_time = channelVideos.videos[0].fb5_start_time;
        this.fb5_start_time = channelVideos.videos[0].fb5_start_time;
        this.broadcasterVideosList.push(broadcastervideoRequest);
      }
    );
  }

  setChannelselectedValue(broadcasters) {
    var f_broadcaster;
    var broadcaster_videos: BroadcasterVideos

    if (broadcasters.length > 0) {

      this.broadcasters = broadcasters;
      var filterBroadcaster = broadcasters.filter(sachannel => sachannel.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
      this.channelCategories = filterBroadcaster.length > 0 ? filterBroadcaster[0].broadcaster_channels : [];
      f_broadcaster = this.broadcasters.filter(
        broadcasterId => broadcasterId.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
      this.w_get_target_url = f_broadcaster.length > 0 ? f_broadcaster[0].w_get_target_url : '';
      this.w_applicationName = f_broadcaster.length > 0 ? f_broadcaster[0].w_application_name : '';

      var filterChannel = filterBroadcaster.length > 0 ? filterBroadcaster[0].broadcaster_channels : [];


      console.log("FilterChannel Length" + filterBroadcaster[0].broadcaster_channels.length);
      console.log("Filter channel Id" + filterBroadcaster[0].broadcaster_channels[0].id);

      var broadcastervideoRequest = new BroadcasterVideos();
      this.broadcasterVideosList = [];
      for (var i = 0; i < filterChannel.length; i++) {
        console.log("Filter channel Id" + filterChannel[i].id);
        var channelId = filterChannel[i].id;
        console.log(filterChannel[i].id + "channelId");
        // broadcastervideoRequest.fp_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fp_start_time : '';
        // console.log("Fb  starttime" + filterChannel[i].broadcaster_videos[0].fp_start_time);
        // this.fp_start_time = filterChannel[i].broadcaster_videos[0].fp_start_time;
        // broadcastervideoRequest.yt_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].yt_start_time : '';
        // this.yt_start_time = filterChannel[i].broadcaster_videos[0].yt_start_time;
        // console.log("Fb  starttime" + filterChannel[i].broadcaster_videos[0].yt_start_time);
        // broadcastervideoRequest.ps_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].ha_start_time : '';
        // this.ha_start_time = filterChannel[i].broadcaster_videos[0].ha_start_time;
        // broadcastervideoRequest.ha_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].ps_start_time : '';
        // this.ps_start_time = filterChannel[i].broadcaster_videos[0].ps_start_time;
        // broadcastervideoRequest.fb1_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fb1_start_time : '';
        // this.fb1_start_time = filterChannel[i].broadcaster_videos[0].fb1_start_time;
        // broadcastervideoRequest.fb2_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fb2_start_time : '';
        // this.fb2_start_time = filterChannel[i].broadcaster_videos[0].fb2_start_time;
        // broadcastervideoRequest.fb3_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fb3_start_time : '';
        // this.fb3_start_time = filterChannel[i].broadcaster_videos[0].fb3_start_time;
        // broadcastervideoRequest.fb4_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fb4_start_time : '';
        // this.fb4_start_time = filterChannel[i].broadcaster_videos[0].fb4_start_time;
        // broadcastervideoRequest.fb5_start_time = filterChannel.length > 0 ? filterChannel[i].broadcaster_videos[0].fb5_start_time : '';
        // this.fb5_start_time = filterChannel[i].broadcaster_videos[0].fb5_start_time;
        // this.broadcasterVideosList.push(broadcastervideoRequest);

        this.broadcasterService.getChannelLiveVideo(channelId).subscribe(
          channelVideos => {
            this.channelVideos = channelVideos;
            // this.channelId=channelId;
            console.log("selected Videos" + JSON.stringify(this.channelVideos));
            var broadcastervideoRequest = new BroadcasterVideos();
            this.broadcasterVideosList = [];
            broadcastervideoRequest.fp_start_time = channelVideos.videos[0].fp_start_time;
            console.log("Fb  starttime" + channelVideos.videos[0].fp_start_time);
            this.fp_start_time = channelVideos.videos[0].fp_start_time;
            broadcastervideoRequest.yt_start_time = channelVideos.videos[0].yt_start_time;
            this.yt_start_time = channelVideos.videos[0].yt_start_time;
            broadcastervideoRequest.ha_start_time = channelVideos.videos[0].ha_start_time;
            this.ha_start_time = channelVideos.videos[0].ha_start_time;
            broadcastervideoRequest.ps_start_time = channelVideos.videos[0].ps_start_time;
            this.ps_start_time = channelVideos.videos[0].ps_start_time;
            broadcastervideoRequest.fb1_start_time = channelVideos.videos[0].fb1_start_time;
            this.fb1_start_time = channelVideos.videos[0].fb1_start_time;
            broadcastervideoRequest.fb2_start_time = channelVideos.videos[0].fb2_start_time;
            this.fb2_start_time = channelVideos.videos[0].fb2_start_time;
            broadcastervideoRequest.fb3_start_time = channelVideos.videos[0].fb3_start_time;
            this.fb3_start_time = channelVideos.videos[0].fb3_start_time;
            broadcastervideoRequest.fb4_start_time = channelVideos.videos[0].fb4_start_time;
            this.fb4_start_time = channelVideos.videos[0].fb4_start_time;
            broadcastervideoRequest.fb5_start_time = channelVideos.videos[0].fb5_start_time;
            this.fb5_start_time = channelVideos.videos[0].fb5_start_time;
            this.broadcasterVideosList.push(broadcastervideoRequest);
          }
        );

      }

      this.streamTargetKeyResponse();
    }

  }

  streamTargetKeyResponse() {

    this.broadcasterService.getStreamTarget(this.w_applicationName.trim(), this.platformManagerForm.value.broadcasterName, this.w_get_target_url)
      .subscribe(
      response => this.streamTargetGetResponse(response = response),
      error => this.errorMessage = <any>error);
  }

  streamTargetGetResponse(getresponse) {

    var myDate = new Date();
    var sessionStatus;
    var streamTargetValYT, streamTargetValFB, streamTargetValPS;
    var streamTargetValHa, streamTargetValFB1, streamTargetValFB2;
    var streamTargetValFB3, streamTargetValFB4, streamTargetValFB5;
    var wowzaMapEntries: any;
    var fbStatus, ytStaus, psStatus, haStatus, fb1Status, fb2Status, fb3Status, fb4Status, fb5Status;
    this.streamTargetRequest = new StreamTargetRequest();
    var newStreamEntryName = this.w_applicationName;
    if (getresponse.mapEntries.length > 0) {
      wowzaMapEntries = getresponse.mapEntries;
      if (wowzaMapEntries.length > 0) {

        streamTargetValFB = wowzaMapEntries.filter(
          destKey => destKey.host === "rtmp-api.facebook.com");

        streamTargetValYT = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.youtube.com");

        streamTargetValPS = wowzaMapEntries.filter(
          destKey => destKey.host.toString().endsWith(".pscp.tv"));

        streamTargetValHa = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.haappyapp.com");

        streamTargetValFB1 = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.facebook1.com");

        streamTargetValFB2 = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.facebook2.com");

        streamTargetValFB3 = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.facebook3.com");

        streamTargetValFB4 = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.facebook4.com");

        streamTargetValFB5 = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.facebook5.com");


      }

      if (streamTargetValFB.length > 0) {
        if (streamTargetValFB[0].sessionStatus === "Active") {
          this.fbStatus = "OnLine";
        }
        else
          this.fbStatus = "OffLine";
      }

      if (streamTargetValYT.length > 0) {
        if (streamTargetValYT[0].sessionStatus.toString() === "Active") {
          this.ytStatus = "OnLine";
        }
        else
          this.ytStatus = "OffLine";
      }
      if (streamTargetValPS.length > 0) {
        if (streamTargetValPS[0].sessionStatus === "Active") {
          this.psStatus = "OnLine";
        }
        else
          this.psStatus = "OffLine";
      }
      if (streamTargetValHa.length > 0) {
        if (streamTargetValHa[0].sessionStatus === "Active") {
          this.haStatus = "OnLine";
        }
        else
          this.haStatus = "OffLine";
      }
      if (streamTargetValFB1.length > 0) {
        if (streamTargetValFB1[0].sessionStatus === "Active") {
          this.fb1Status = "OnLine";
        }
        else
          this.fb1Status = "OffLine";
      }
      if (streamTargetValFB2.length > 0) {
        if (streamTargetValFB2[0].sessionStatus === "Active") {
          this.fb2Status = "OnLine";
        }
        else
          this.fb2Status = "OffLine";
      }
      if (streamTargetValFB3.length > 0) {
        if (streamTargetValFB3[0].sessionStatus === "Active") {
          this.fb3Status = "OnLine";
        }
        else
          this.fb3Status = "OffLine";
      }
      if (streamTargetValFB4.length > 0) {
        if (streamTargetValFB4[0].sessionStatus === "Active") {
          this.fb4Status = "OnLine";
        }
        else
          this.fb4Status = "OffLine";
      }
      if (streamTargetValFB5.length > 0) {
        if (streamTargetValFB5[0].sessionStatus === "Active") {
          this.fb5Status = "OnLine";
        }
        else
          this.fb5Status = "OffLine";
      }



    }

  }
}  

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

@Component({
  selector: 'app-platform-manager',
  templateUrl: './platform-manager.component.html',
  providers: [BroadcasterService, DatePipe]
})


export class PlatformManagerComponent implements OnInit {
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
  fp_start_time:string;
  yt_start_time:string;
  ps_start_time:string;
  yt_stop_time:string;
  fb_stop_time:string;
  ps_stop_time:string;

  streamNotificationRequest: StreamNotificationRequest
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
        broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
        error => this.errorMessage = <any>error);
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcaterId)
        .subscribe(
        broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
        error => this.errorMessage = <any>error);
    }


  }

  updateDestinationId(destinations) {

    if (this.user.user_type === "Super Admin") {
      this.client_id = 1064;
      this.user.client_id = 1064;

    }

  }


  onBroadcasterSelect(broadcasterId, isLoad: boolean) {
    const broadcasterVal = this.platformManagerForm.value;

    if (!isLoad && this.user.user_type == "Super Admin") {
      this.broadcasterService.getAllBroadcasters().subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcasterId).subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }

  }

  setChannelselectedValue(broadcasters) {
    var f_broadcaster;
   
    if (broadcasters.length > 0) {
      this.broadcasters = broadcasters;
      if (this.user.user_type === "Super Admin") {

        var filterChannel = broadcasters.filter(sachannel => sachannel.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
        this.channelCategories = filterChannel.length > 0 ? filterChannel[0].broadcaster_channels : [];
       
        f_broadcaster = this.broadcasters.filter(
          broadcasterId => broadcasterId.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
        this.w_get_target_url = f_broadcaster.length > 0 ? f_broadcaster[0].w_get_target_url : '';
        this.w_applicationName = f_broadcaster.length > 0 ? f_broadcaster[0].w_application_name : '';
        this.fp_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].fp_start_time:'';
        this.yt_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].yt_start_time:'';
        this.ps_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].ps_start_time:'';
       
      }
      else {
        this.channelCategories = broadcasters[0].broadcaster_channels;
       
        f_broadcaster = this.broadcasters.filter(
          broadcasterId => broadcasterId.id.toString() === this.platformManagerForm.value.broadcasterName.toString());
        this.w_get_target_url = f_broadcaster.length > 0 ? f_broadcaster[0].w_get_target_url : '';
        this.w_applicationName = f_broadcaster.length > 0 ? f_broadcaster[0].w_application_name : '';
        this.fp_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].fp_start_time:'';
        this.yt_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].yt_start_time:'';
        this.ps_start_time=f_broadcaster.length > 0 ? f_broadcaster[0].ps_start_time:'';

      }

    }
    this.streamTargetKeyResponse();

  }

  streamTargetKeyResponse() {

    this.broadcasterService.getSampleStreamTarget(this.w_applicationName.trim(), this.platformManagerForm.value.broadcasterName, this.w_get_target_url)
      .subscribe(
      response => this.streamTargetGetResponse(response = response),
      error => this.errorMessage = <any>error);
  }

  streamTargetGetResponse(getresponse) {

    var myDate = new Date();
    var sessionStatus;
    var streamTargetValYT, streamTargetValFB, streamTargetValPS;
    var wowzaMapEntries: any;
    var fbStatus, ytStaus, psStatus;
    this.streamTargetRequest = new StreamTargetRequest();
    var newKeyDate = this.datePipe.transform(myDate, 'yyMMddhmmss');
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
      }

      if (streamTargetValFB.length > 0) {
        if (streamTargetValFB[0].sessionStatus === "Active") {
          this.fbStatus = "OnLine";
        }
        else
          this.fbStatus = "Offline";
      }

      if (streamTargetValYT.length > 0) {
        if (streamTargetValYT[0].sessionStatus.toString() === "Active") {
          this.ytStatus = "OnLine";
        }
        else
          this.ytStatus = "Offline";
      }
      if (streamTargetValPS.length > 0) {
        if (streamTargetValPS[0].sessionStatus === "Active") {
          this.psStatus = "Online";
        }
        else
          this.psStatus = "Offline";
      }



    }

  }


}
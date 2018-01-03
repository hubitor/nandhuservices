import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { BroadcasterService } from "../../shared/server/service/broadcaster-service"
import { NTemplateService } from "../../shared/server/service/ntemplate-service"
import { Observable } from 'rxjs/Observable';
import { Broadcasters } from "../../shared/models/broadcasters"
import { ChannelVideoKeyRequest } from "../../shared/models/channelVideoKeyRequest"
import { ChannelCategory } from "../../shared/models/channelCategory"
import { BroadcasterVideos } from "../../shared/models/broadcasterVideos"
import { CreateResponse } from "../../shared/models/createResponse";
import { LoginResponse } from "../../shared/models/loginResponse";
import 'rxjs/add/observable/of';
import { NotificationService } from "../../shared/utils/notification.service";
import { StreamTargetRequest } from "../../shared/models/stream-target-request"
import { BroadcasterDestination } from "../../shared/models/broadcaster-destination"
import { StreamNotificationRequest } from "../../shared/models/stream-notify-request"
import { DatePipe } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { ChannelRecordRequest } from '../../shared/models/channel-record-request';

@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
  providers: [BroadcasterService, DatePipe, NTemplateService]
})
export class ChannelStreamComponent implements OnInit {
  w_applicationName: string;
  user: LoginResponse;
  url: 'https://www.youtube.com/watch?v=AXcxZXJ73ZA';
  channelStreamForm: FormGroup;
  errorMessage: string;
  appid: number;
  client_id: number;
  broadcasters: Broadcasters;
  bChannelVideos: Broadcasters[];
  channelCategories: ChannelCategory;
  createResponse: CreateResponse;
  channelVideoKeyRequest: ChannelVideoKeyRequest;
  streamTargetRequest: StreamTargetRequest;
  streamNotificationRequest: StreamNotificationRequest
  streamTargetResponse;
  broadcasterDestinations;
  mode: 'Observable';
  broadcasterVideos;
  g_broadcasterId;
  w_application_name: string;
  notify_Templateid: 1;
  notify_DestinationId: 0;
  isLoopUntil: false;
  w_get_target_url: string;
  isnewKeyDisabled: false;
  broadcasterChannels: BroadcasterChannel[];
  channelList: ChannelRecordRequest[];
  broadcasterId: number;

  constructor(private broadcasterService: BroadcasterService
    , private fb: FormBuilder
    , private notificationService: NotificationService
    , private nTemplateService: NTemplateService
    , private datePipe: DatePipe) {
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    // this.w_applicationName=localStorage.getItem('w_appname');
    if (this.user.user_type === "Super Admin") {
      this.client_id = 1064;
      this.user.client_id = 1064;
    }
    else {
      this.client_id = this.user.client_id;
    }
    this.channelList = new Array();

    this.createForm();


  }

  createForm() {

    this.channelStreamForm = this.fb.group({
      broadcasterName: [this.user.client_id ? this.user.client_id : 1064, Validators.required],
      broadcasterChannelCategoryName: [this.user.primary_channel_id ? this.user.primary_channel_id : 140, Validators.required],
      channelCurrentStreamKey: [null, Validators.required],
      channelNewStreamKey: [null, [Validators.required, Validators.maxLength(300)]],
      channelVideoId: [null],
      // w_application_name: [null],
      broadcasterDestination: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllBroadcastersById(this.client_id);
    //    this.getAllBroadcasterDestination();
    this.streamNotificationRequest = new StreamNotificationRequest();
  }

  getAllBroadcasterDestination() {
    this.broadcasterService.getAllBroadcasterDestination()
      .subscribe(
      broadcasterDestination => {
        this.broadcasterDestinations = broadcasterDestination

      },

      error => this.errorMessage = <any>error);

  }


  getAllBroadcasterChannelDestination(channlId: number) {
    this.broadcasterService.getAllBroadcasterChannelDestination(channlId)
      .subscribe(
      broadcasterDestination => {
        this.broadcasterDestinations = broadcasterDestination
        if (this.broadcasterDestinations.length > 0) {
          this.channelStreamForm.get('broadcasterDestination').setValue(this.broadcasterDestinations[1].d_id);
        }
      },
      error => this.errorMessage = <any>error);

  }

  updateDestinationId(destinations) {

    if (this.user.user_type === "Super Admin") {
      this.client_id = 1064;
      this.user.client_id = 1064;

    }

    //this.getAllBroadcastersById(this.client_id);
  }

  getAllBroadcastersById(broadcasterId) {
    if (this.client_id === 1064) {
      this.broadcasterService.getAllBroadcasters()
        .subscribe(
        broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
        error => this.errorMessage = <any>error);
    }
    else {
      this.broadcasterService.getAllBroadcastersById(broadcasterId)
        .subscribe(
        broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
        error => this.errorMessage = <any>error);
    }


  }

  onBroadcasterSelect(broadcasterId, isLoad: boolean) {
    const broadcasterVal = this.channelStreamForm.value;

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
    if (broadcasters.length > 0) {
      this.broadcasters = broadcasters;
      if (this.user.user_type === "Super Admin") {

        var filterBroadcaster = broadcasters.filter(sachannel => sachannel.id.toString() === this.channelStreamForm.value.broadcasterName.toString());
        this.channelCategories = filterBroadcaster.length > 0 ? filterBroadcaster[0].broadcaster_channels : [];
        this.bChannelVideos = filterBroadcaster.length > 0 ? filterBroadcaster[0].broadcaster_channels : [];
        this.updatingResponse(filterBroadcaster);
      }
      else {
        this.channelCategories = broadcasters[0].broadcaster_channels;
        this.bChannelVideos = broadcasters[0].broadcaster_channels;
        this.updatingResponse(broadcasters);
      }

    }
  }

  onChannelCategorySelect(channelCategoryId) {
    const broadcasterVal = this.channelStreamForm.value;
    var broadcasterId = broadcasterVal.broadcasterName ? this.user.client_id : broadcasterVal.broadcasterName;
    this.broadcasterService.getAllBroadcastersByCategoryId(broadcasterId, channelCategoryId)
      .subscribe(broadcasterVideos => this.updatingResponse(this.broadcasterVideos = broadcasterVideos),
      error => this.errorMessage = error
      );
  }

  updatingResponse(broadcasterVideos) {
    var channelrequest = new ChannelRecordRequest();
    this.channelList = [];
    if (broadcasterVideos.length > 0) {
      var broadcasterVideo = broadcasterVideos.length > 0 && broadcasterVideos[0].broadcaster_channels.length > 0 ? broadcasterVideos[0].broadcaster_channels[0].broadcaster_videos : [];
      var broadcasterchannels = broadcasterVideos.length > 0 && broadcasterVideos[0].broadcaster_channels.length > 0 ? broadcasterVideos[0].broadcaster_channels : [];

      if (broadcasterchannels.length > 0) {
        console.log("Filter channel Id" + broadcasterchannels[0].id);
        var channelId = broadcasterchannels[0].id;
        channelrequest.channel_name = broadcasterchannels[0].channel_name;

        channelrequest.id = broadcasterchannels.length > 0 ? broadcasterchannels[0].id : '';
        channelrequest.w_application_name = broadcasterchannels.length > 0 ? broadcasterchannels[0].w_application_name : '';
        channelrequest.w_get_target_api = broadcasterchannels.length > 0 ? broadcasterchannels[0].w_get_target_api : '';
        channelrequest.ch_stream_name = broadcasterchannels.length > 0 ? broadcasterchannels[0].ch_stream_name : '';
        channelrequest.broadcaster_id = broadcasterchannels.length > 0 ? broadcasterchannels[0].broadcaster_id : '';
        this.w_application_name = channelrequest.w_application_name;
        this.isLoopUntil = broadcasterVideos[0].is_loop_until;
        this.w_get_target_url = channelrequest.w_get_target_api;
        this.isnewKeyDisabled = this.isLoopUntil;
        this.channelStreamForm.setValue({
          channelCurrentStreamKey: null,              // broadcasterVideo[0].yt_streamkey,
          broadcasterChannelCategoryName: broadcasterVideo[0].broadcaster_channel_id,
          channelNewStreamKey: null,
          broadcasterName: broadcasterVideos[0].id,
          channelVideoId: broadcasterVideo[0].id,
          broadcasterDestination: null
        });
        this.channelList.push(channelrequest);
        console.log(channelrequest);
        channelrequest = new ChannelRecordRequest();

        this.getAllBroadcasterChannelDestination(+ this.channelStreamForm.value.broadcasterChannelCategoryName);
      }

    }

  }

  amendChannelVideoKey(value: any) {
    this.showPopup(value);
  }

  stopChannelVideoKey(value: any) {
    var newKeyResponse;
    this.streamNotificationRequest = new StreamNotificationRequest();
    var destType = this.channelStreamForm.value.broadcasterDestination.toString();
    this.streamNotificationRequest.broadcaster_id = this.channelStreamForm.value.broadcasterName;
    this.streamNotificationRequest.template_id = 1;
    if (destType === "1") {
      newKeyResponse = {
        id: -1,
        fb_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
      this.streamNotificationRequest.destination_id = 2;
    }
    else if (destType === "2") {
      newKeyResponse = {
        id: -1,
        yt_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
      this.streamNotificationRequest.destination_id = 1;
    }
    else if (destType === "3") {
      newKeyResponse = {
        id: -1,
        ha_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
      this.streamNotificationRequest.destination_id = 5;
    }
    else if (destType === "4") {
      newKeyResponse = {
        id: -1,
        ps_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
      this.streamNotificationRequest.destination_id = 3;
    }
    this.streamTargetKeyResponse(newKeyResponse, value, this.streamNotificationRequest);
  }

  showPopup(isStop: boolean) {
    var contentValue = "";
    var selValue = this.channelStreamForm.value.broadcasterDestination.toString();
    if (selValue === "1")
      contentValue = "FaceBook";
    else if (selValue === "2")
      contentValue = "YouTube";
    else if (selValue = "3")
      contentValue = "Haappyapp";
    else if (selValue = "4")
      contentValue = "Periscope";

    this.notificationService.smartMessageBox({
      title: isStop ? "Channel Stream Stop" : "Channel Stream Key",
      content: isStop ? "Do you want to stop a <i  style='color:green'><b>" + contentValue + "<b></i> Stream ?Your stream will be stop automatically." : "Do you want to update new <i  style='color:green'><b>" + contentValue + "<b></i> Stream key?Your stream will be start automatically.",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        if (!isStop) {
          this.updateStreamkey();
        }
        else {
          console.log('Destination is continuous running! ');
          this.stopChannelVideoKey(isStop);
        }

      }
    });
  }

  updateStreamkey() {
    this.channelVideoKeyRequest = new ChannelVideoKeyRequest();
    this.streamNotificationRequest = new StreamNotificationRequest();
    const broadcasterVideoVal = this.channelStreamForm.value;
    const channelAppName = this.channelStreamForm.value;
    this.channelVideoKeyRequest.id = broadcasterVideoVal.channelVideoId;
    this.channelCategories.w_application_name = channelAppName.w_application_name;
    this.streamNotificationRequest.broadcaster_id = this.channelStreamForm.value.broadcasterName;
    this.streamNotificationRequest.template_id = 1;
    var type;
    var dest = broadcasterVideoVal.broadcasterDestination.toString().trim();
    switch (dest) {
      case "1": {
        type = "fb";
        this.channelVideoKeyRequest.fb_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
        this.streamNotificationRequest.destination_id = 2;
        break;
      }

      case "2": {
        type = "yt";
        this.channelVideoKeyRequest.yt_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
        this.streamNotificationRequest.destination_id = 1;
        break;
      }

      case "3": {
        type = "ha";
        this.channelVideoKeyRequest.ha_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
        this.streamNotificationRequest.destination_id = 5;
        break;
      }

      case "4": {
        type = "ps";
        this.channelVideoKeyRequest.ps_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
        this.streamNotificationRequest.destination_id = 3;
        break;
      }

      default: {
        type = "yt";
        this.channelVideoKeyRequest.yt_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
        this.streamNotificationRequest.destination_id = 1;
        break;
      }
    }


    this.broadcasterService.updateCategoryVideosKey(this.channelVideoKeyRequest, type)
      .subscribe(
      createresponse => this.streamTargetKeyResponse(this.createResponse = createresponse, false, this.streamNotificationRequest),
      error => this.errorMessage = <any>error);
  }


  streamTargetKeyResponse(newKeyResponse, isStop: boolean, streamNotificationRequest) {

    this.broadcasterService.getStreamTarget(this.w_application_name.trim(), this.channelStreamForm.value.broadcasterName, this.w_get_target_url)
      .subscribe(
      response => this.streamTargetGetResponse(response = response, newKeyResponse, isStop, streamNotificationRequest, this.streamNotificationRequest.broadcaster_id),
      error => this.errorMessage = <any>error);
  }
  streamTargetGetResponse(getresponse, newKeyResponse, isStop, streamNotificationRequest, broadcaster_id) {

    var myDate = new Date();
    var streamTargetVal;
    var wowzaMapEntries: any[];
    this.streamTargetRequest = new StreamTargetRequest();
    var newKeyDate = this.datePipe.transform(myDate, 'yyMMddhmmss');
    var newStreamEntryName = this.w_application_name.toString();
    //this.user.w_appname.trim();
    //+ "-" + newKeyDate;
    if (getresponse.mapEntries.length > 0) {
      wowzaMapEntries = getresponse.mapEntries;
      var destType = this.channelStreamForm.value.broadcasterDestination.toString();
      if (destType === "1") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "rtmp-api.facebook.com");
        newStreamEntryName = newStreamEntryName + "-facebook";
        this.streamTargetRequest.streamName = newKeyResponse.fb_streamkey ? newKeyResponse.fb_streamkey.toString().trim() : '';
      }
      else if (destType === "2") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "a.rtmp.youtube.com");
        newStreamEntryName = newStreamEntryName + "-youtube";
        this.streamTargetRequest.streamName = newKeyResponse.yt_streamkey ? newKeyResponse.yt_streamkey.toString().trim() : '';
      }
      else if (destType === "3") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "live.haappyapp.com");

        newStreamEntryName = newStreamEntryName + "-haappyapp";
        this.streamTargetRequest.streamName = "ha-mainstream";

        //this.streamTargetRequest.streamName = newKeyResponse.ha_streamkey?newKeyResponse.ha_streamkey.toString().trim():'';
      }

      else if (destType === "4") {
        streamTargetVal = wowzaMapEntries.filter(
          destKey => destKey.host === "sg.pscp.tv");
        // destKey => destKey.host.toString().endsWith(".pscp.tv"));

        newStreamEntryName = newStreamEntryName + "-Periscope";
        this.streamTargetRequest.streamName = newKeyResponse.ps_streamkey ? newKeyResponse.ps_streamkey.toString().trim() : '';
      }
      if (streamTargetVal.length > 0) {
        streamTargetVal = streamTargetVal[0];
      }
      //streamTargetVal = getresponse.mapEntries[0];

      this.streamTargetRequest.serverName = getresponse.serverName.trim();
      this.streamTargetRequest.sourceStreamName = streamTargetVal.sourceStreamName;
      this.streamTargetRequest.entryName = newStreamEntryName + "-" + newKeyDate.trim();

      this.streamTargetRequest.appInstance = streamTargetVal.appInstance;

      this.streamTargetRequest.port = streamTargetVal.port;
      this.streamTargetRequest.enabled = isStop ? false : true;
      this.streamTargetRequest.autoStartTranscoder = streamTargetVal.autoStartTranscoder;
      this.streamTargetRequest.profile = streamTargetVal.profile;
      this.streamTargetRequest.host = streamTargetVal.host;
      this.streamTargetRequest.application = streamTargetVal.application;
      this.streamTargetRequest.userName = streamTargetVal.userName ? streamTargetVal.userName : '';
      this.streamTargetRequest.password = streamTargetVal.password ? streamTargetVal.password : '';

    }

    this.broadcasterService.createStreamTarget(this.streamTargetRequest, this.w_application_name.trim(), this.streamTargetRequest.entryName, broadcaster_id, this.w_get_target_url)

      .subscribe(
      response => this.streamTargetcreateResponse(response, streamTargetVal.entryName, isStop, streamNotificationRequest, broadcaster_id),
      error => this.errorMessage = <any>error)

  }

  streamTargetcreateResponse(response, entryName: string, isStop, streamNotificationRequest, broadcaster_id) {
    this.broadcasterService.deleteStreamTarget(this.w_application_name, entryName, broadcaster_id, this.w_get_target_url)
      .subscribe(
      response => this.hasReload(response, isStop, streamNotificationRequest),
      error => this.errorMessage = <any>error)
  }

  refreshStreamKey() {


    if (this.channelStreamForm.value.broadcasterDestination != "2") {
      this.isLoopUntil = false;
      this.isnewKeyDisabled = false;
    }

    const broadcasterVideoKeyVal = this.channelStreamForm.value;
    var videoKeyValue;
    if (this.bChannelVideos.length > 0) {
      videoKeyValue = this.bChannelVideos.filter(
        destKey => destKey.id.toString() === broadcasterVideoKeyVal.broadcasterChannelCategoryName.toString());
    }

    if (videoKeyValue.length > 0) {

      var dest = broadcasterVideoKeyVal.broadcasterDestination.toString();
      switch (dest) {
        case "1": {
          this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].fb_streamkey : '');
          break;
        }

        case "2": {
          this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].yt_streamkey : '');
          break;
        }

        case "3": {

          this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].ha_streamkey : '');
          break;
        }

        case "4": {

          this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].ps_streamkey : '');
          break;
        }
        default: {

          this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length > 0 ? videoKeyValue[0].broadcaster_videos[0].yt_streamkey : '');
          break;
        }

      }
      if (this.isLoopUntil) {
        this.channelStreamForm.get('channelNewStreamKey').setValue(this.channelStreamForm.value.channelCurrentStreamKey);
      }
      else {
        this.channelStreamForm.get('channelNewStreamKey').setValue("");
      }
    }
  }

  stopStreamNotification(streamNotificationRequest) {
    this.nTemplateService.stopStreamingNotifcation(streamNotificationRequest)
      .subscribe(
      response => {
        if (response) {
          location.reload();
        }
      },
      error => this.errorMessage = <any>error)
  }

  startStreamNotification(streamNotificationRequest) {
    this.nTemplateService.startStreamingNotifcation(streamNotificationRequest)
      .subscribe(
      response => {
        if (response) {
          location.reload();
        }
      },
      error => this.errorMessage = <any>error)
  }

  hasReload(response, isStop, streamNotificationRequest) {
    if (isStop) {
      this.stopStreamNotification(streamNotificationRequest);
    }
    else {
      this.startStreamNotification(streamNotificationRequest);
    }


  }

}

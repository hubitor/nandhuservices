import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { BroadcasterService } from "../../shared/server/service/broadcaster-service"
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
  providers: [BroadcasterService,DatePipe]
})
export class ChannelStreamComponent implements OnInit {
  user: LoginResponse;
  channelStreamForm;
  errorMessage: string;
  appid: number;
  client_id: number;
  broadcasters: Broadcasters;
  channelCategories: ChannelCategory;
  createResponse: CreateResponse;
  channelVideoKeyRequest: ChannelVideoKeyRequest;
  streamTargetRequest: StreamTargetRequest;
  mode: 'Observable';
  broadcasterVideos;
  g_broadcasterId;
  w_applicationName: string;
  constructor(private broadcasterService: BroadcasterService
    , private fb: FormBuilder
    , private notificationService: NotificationService
    ,private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
    this.w_applicationName = this.user.w_appname;
    this.client_id = this.user.client_id;
    this.getAllBroadcasters();
    this.channelStreamForm = new FormGroup({
      broadcasterName: new FormControl(this.user.client_id),
      broadcasterChannelCategoryName: new FormControl(this.user.primary_channel_id),
      channelCurrentStreamKey: new FormControl(""),
      channelNewStreamKey: new FormControl(""),
      channelVideoId: new FormControl("")
    });
    this.onBroadcasterSelect(this.user.client_id)
  }

  getAllBroadcasters() {
    
    this.broadcasterService.getAllBroadcasters()
      .subscribe(
      broadcasters => this.broadcasters = broadcasters,
      error => this.errorMessage = <any>error);

  }

  onBroadcasterSelect(broadcasterId) {
    const broadcasterVal = this.channelStreamForm.value;
    broadcasterVal.broadcasterName = broadcasterId;
    this.g_broadcasterId = broadcasterId;
    this.broadcasterService.getAllBroadcastersById(broadcasterId).subscribe(
      channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
      error => this.errorMessage = error
    );


  }

  setChannelselectedValue(channelCategories) {
    if(channelCategories.length >0)
    {
      this.onChannelCategorySelect(this.user.primary_channel_id);
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
    if(broadcasterVideos.length>0)
    {
      broadcasterVideos= broadcasterVideos[0].broadcaster_channels[0].broadcaster_videos;

      this.channelStreamForm = this.fb.group({
        channelCurrentStreamKey: this.broadcasterVideos[0].yt_streamkey,
        broadcasterChannelCategoryName: this.broadcasterVideos[0].broadcaster_channel_id,
        channelNewStreamKey: '',
        broadcasterName: this.g_broadcasterId,
        channelVideoId: this.broadcasterVideos[0].id
      });
    }
    
  }



  amendChannelVideoKey() {
    this.showPopup();
  }

  showPopup() {

    this.notificationService.smartMessageBox({
      title: "Channel Stream Key",
      content: "Channel stream key has been updated successfully!Your stream will be start automatically.",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {

      this.channelVideoKeyRequest = new ChannelVideoKeyRequest();
      const broadcasterVideoVal = this.channelStreamForm.value;
      this.channelVideoKeyRequest.id = broadcasterVideoVal.channelVideoId;
      this.channelVideoKeyRequest.yt_streamkey = broadcasterVideoVal.channelNewStreamKey;
    this.broadcasterService.updateCategoryVideosKey(this.channelVideoKeyRequest)
      .subscribe(
      createresponse =>this.createResponse = createresponse,
      error => this.errorMessage = <any>error);

        this.broadcasterService.getStreamTarget(this.w_applicationName)
          .subscribe(
          response => this.streamTargetgetResponse(response, this.createResponse),
          error => this.errorMessage = <any>error)

      }
    });
  }

  streamTargetgetResponse(getresponse, newKeyResponse) {

    var myDate = new Date();
    var newKeyDate= this.datePipe.transform(myDate, 'yyMMddhmmss');
    var newStreamEntryName=this.user.w_appname+"-"+ newKeyDate;

    var streamTargetVal = getresponse.mapEntries[0];
    this.streamTargetRequest = new StreamTargetRequest();
    this.streamTargetRequest.serverName = getresponse.serverName;
    this.streamTargetRequest.sourceStreamName = streamTargetVal.sourceStreamName;
    this.streamTargetRequest.entryName = newStreamEntryName;
    this.streamTargetRequest.profile = streamTargetVal.profile;
    this.streamTargetRequest.host = streamTargetVal.host;
    this.streamTargetRequest.application = streamTargetVal.application;
    this.streamTargetRequest.userName = streamTargetVal.userName;
    this.streamTargetRequest.password = streamTargetVal.password;
    this.streamTargetRequest.streamName = newKeyResponse.yt_streamkey

    this.broadcasterService.createStreamTarget(this.streamTargetRequest, this.w_applicationName, this.streamTargetRequest.entryName)
      .subscribe(
      response => this.streamTargetcreateResponse(response, streamTargetVal.entryName),
      error => this.errorMessage = <any>error)

  }
  streamTargetcreateResponse(response, entryName: string) {
    this.broadcasterService.deleteStreamTarget(this.w_applicationName, entryName)
      .subscribe(
      response => this.hasReload (response),
      error => this.errorMessage = <any>error)
  }

  hasReload(response)
  {
    if(response)
    {
     location.reload();
    }
  }

}

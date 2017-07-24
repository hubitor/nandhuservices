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
import { AppSettings } from "../../shared/server/api/api-settings"
import 'rxjs/add/observable/of';
import {NotificationService} from "../../shared/utils/notification.service";
import { StreamTargetRequest } from "../../shared/models/stream-target-request"

@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
  providers: [BroadcasterService]
})
export class ChannelStreamComponent implements OnInit {
  channelStreamForm;
  errorMessage:string;
  appid:number;
  broadcasters:Broadcasters;
  channelCategories:ChannelCategory;
  createResponse: CreateResponse;
  channelVideoKeyRequest:ChannelVideoKeyRequest;
  streamTargetRequest:StreamTargetRequest;
  mode:'Observable';
  user;
  broadcasterVideos;
  g_broadcasterId;
  constructor(private broadcasterService:BroadcasterService
  ,private fb:FormBuilder
  ,private notificationService: NotificationService) { 

  }

  ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.getAllBroadcasters();
      this.channelStreamForm = new FormGroup({
      broadcasterName: new FormControl(""),
      broadcasterChannelCategoryName: new FormControl(""),
      channelCurrentStreamKey: new FormControl(""),
      channelNewStreamKey: new FormControl(""),
      channelVideoId:new FormControl("")
    });
  }

   getAllBroadcasters() {
    ;
    this.broadcasterService.getAllBroadcasters()
      .subscribe(
      broadcasters => this.broadcasters = broadcasters,
      error => this.errorMessage = <any>error);
  }

    onBroadcasterSelect(broadcasterId) {
     const broadcasterVal = this.channelStreamForm.value;
     broadcasterVal.broadcasterName=broadcasterId;
     this.g_broadcasterId=broadcasterId;
    this.broadcasterService.getAllBroadcastersById(broadcasterId).subscribe(
      channelCategories => this.channelCategories = channelCategories[0].broadcast_channel_categories,
      error => this.errorMessage = error
    );
   

  }

  onChannelCategorySelect(channelCategoryId) {
      const broadcasterVal = this.channelStreamForm.value;
      var broadcasterId=broadcasterVal.broadcasterName;
       this.broadcasterService.getAllBroadcastersByCategoryId(broadcasterId,channelCategoryId)
       .subscribe(broadcasterVideos => this.updatingResponse(this.broadcasterVideos = broadcasterVideos[0].broadcast_channel_categories[0].broadcaster_videos),
        error => this.errorMessage = error
    );
  }

  updatingResponse(broadcasterVideos)
  {
      ;
    this.channelStreamForm = this.fb.group({
            channelCurrentStreamKey: this.broadcasterVideos[0].yt_streamkey,
             broadcasterChannelCategoryName:this.broadcasterVideos[0].broadcaster_channel_id,
            channelNewStreamKey:'',
            broadcasterName:this.g_broadcasterId,
            channelVideoId:this.broadcasterVideos[0].id
    });
  }

  

  amendChannelVideoKey() {
    ;
    this.channelVideoKeyRequest=new ChannelVideoKeyRequest();
    const broadcasterVideoVal = this.channelStreamForm.value;
    this.channelVideoKeyRequest.id=broadcasterVideoVal.channelVideoId;
    this.channelVideoKeyRequest.yt_streamkey=broadcasterVideoVal.channelNewStreamKey;
    this.broadcasterService.updateCategoryVideosKey(this.channelVideoKeyRequest)
      .subscribe(
      createresponse => this.showPopup(this.createResponse = createresponse),
      error => this.errorMessage = <any>error);
  }

   

    showPopup(createResponse){
    this.notificationService.smartMessageBox({
      title : "Channel Stream Key",
      content : "Channel stream key has been updated successfully!Your stream will be start automatically.",
      buttons : '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {

       this.broadcasterService.deleteStreamTarget("AppName")
      .subscribe(
      response => Response,
      error => this.errorMessage = <any>error)

      this.broadcasterService.createStreamTarget( this.streamTargetRequest,"AppName")
      .subscribe(
      response => Response,
      error => this.errorMessage = <any>error)

        location.reload();
      }
    });
  }

}

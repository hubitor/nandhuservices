import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
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
import { BroadcasterDestination } from "../../shared/models/broadcaster-destination"
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
  providers: [BroadcasterService,DatePipe]
})
export class ChannelStreamComponent implements OnInit {
  user: LoginResponse;
  channelStreamForm:FormGroup;
  errorMessage: string;
  appid: number;
  client_id: number;
  broadcasters: Broadcasters;
  bChannelVideos:Broadcasters[];
  channelCategories: ChannelCategory;
  createResponse: CreateResponse;
  channelVideoKeyRequest: ChannelVideoKeyRequest;
  streamTargetRequest: StreamTargetRequest;
  streamTargetResponse;
  broadcasterDestinations;
  mode: 'Observable';
  broadcasterVideos;
  g_broadcasterId;
  w_applicationName: string;
  constructor(private broadcasterService: BroadcasterService
    , private fb: FormBuilder
    , private notificationService: NotificationService
    ,private datePipe: DatePipe) {
      this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
      this.createForm();
   

  }

  createForm()
  {
    this.channelStreamForm=this.fb.group({
      broadcasterName: [this.user.client_id,Validators.required],
      broadcasterChannelCategoryName: [this.user.primary_channel_id,Validators.required],
      channelCurrentStreamKey: [null,Validators.required],
      channelNewStreamKey:[null,[Validators.required,Validators.maxLength(300)]],
      channelVideoId: [null],
      broadcasterDestination:[null,Validators.required],
    });
  }
  
  ngOnInit() {
    this.w_applicationName = this.user.w_appname;
    this.client_id = this.user.client_id;
    this.getAllBroadcasterDestination();
  }

    getAllBroadcasterDestination() {
    this.broadcasterService.getAllBroadcasterDestination()
      .subscribe(
      broadcasterDestination =>this.updateDestinationId(this.broadcasterDestinations= broadcasterDestination),
      error => this.errorMessage = <any>error);

  }

  updateDestinationId(destinations)
  {
    this.broadcasterDestinations=destinations;
    this.getAllBroadcastersById(this.client_id);
  }

  getAllBroadcastersById(broadcaterId) {

    this.broadcasterService.getAllBroadcastersById(broadcaterId)
      .subscribe(
      broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
      error => this.errorMessage = <any>error);

  }

  onBroadcasterSelect(broadcasterId,isLoad:boolean) {
    const broadcasterVal = this.channelStreamForm.value;
    broadcasterVal.broadcasterName = broadcasterId;
    broadcasterVal.broadcasterChannelCategoryName=this.user.primary_channel_id;
    this.g_broadcasterId = broadcasterId;
    if (!isLoad) {
      this.broadcasterService.getAllBroadcastersById(broadcasterId).subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }
    
  }

  setChannelselectedValue(broadcasters) {
    if(broadcasters.length >0)
    {
      this.broadcasters=broadcasters;
      this.channelCategories=broadcasters[0].broadcaster_channels;
      this.bChannelVideos=broadcasters[0].broadcaster_channels;
      this.updatingResponse(broadcasters);
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
    if (broadcasterVideos.length > 0) {
      var broadcasterVideo = broadcasterVideos[0].broadcaster_channels[0].broadcaster_videos;

      if (broadcasterVideo.length > 0) {

       this.channelStreamForm.setValue({
          channelCurrentStreamKey:null,              // broadcasterVideo[0].yt_streamkey,
          broadcasterChannelCategoryName: broadcasterVideo[0].broadcaster_channel_id,
          channelNewStreamKey: null,
          broadcasterName: this.user.client_id,
          channelVideoId: broadcasterVideo[0].id,
          broadcasterDestination:this.broadcasterDestinations.length>0?this.broadcasterDestinations[1].id:2
       });


        // this.channelStreamForm = this.fb.group({
         
         
        // });
      }
      
    }
    
  }

  amendChannelVideoKey(value: any) {
    this.showPopup();
  }

  showPopup() {

    var contentValue="";
    var selValue=this.channelStreamForm.value.broadcasterDestination.toString();
    if(selValue ==="1")
      contentValue="FaceBook";
    else if(selValue ==="2")
      contentValue="YouTube";
    else if(selValue ="3")
      contentValue="Haappyapp";

    this.notificationService.smartMessageBox({
      title: "Channel Stream Key",
      content: "Do you want to update new <i  style='color:green'><b>"+ contentValue +"<b></i> Stream key?Your stream will be start automatically.",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {

      this.channelVideoKeyRequest = new ChannelVideoKeyRequest();
      const broadcasterVideoVal = this.channelStreamForm.value;
      this.channelVideoKeyRequest.id = broadcasterVideoVal.channelVideoId;
         var type;
          var dest = broadcasterVideoVal.broadcasterDestination.toString().trim();
            switch (dest) {
              case "1": {
                  type="fb";
                  this.channelVideoKeyRequest.fb_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
                  break;
              }
              
              case "2": {
                  type="yt";
                  this.channelVideoKeyRequest.yt_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
                  break;
              }
              
              case "3": {
                  type="ha";
                  this.channelVideoKeyRequest.ha_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
                  break;
              }

              default: {
                  type="yt";
                  this.channelVideoKeyRequest.yt_streamkey = broadcasterVideoVal.channelNewStreamKey.trim();
                  break;
              }
            }

      
    this.broadcasterService.updateCategoryVideosKey(this.channelVideoKeyRequest,type)
      .subscribe(
      createresponse =>this.streamTargetKeyResponse(this.createResponse = createresponse),
      error => this.errorMessage = <any>error);

        
      }
    });
  }

  streamTargetKeyResponse(newKeyResponse) {

    this.broadcasterService.getStreamTarget(this.user.w_appname.trim())
      .subscribe(
      response => this.streamTargetGetResponse(response=response,newKeyResponse) ,
      error => this.errorMessage = <any>error);
  }
  streamTargetGetResponse(getresponse,newKeyResponse)
  {
    
    
    var myDate = new Date();
    var streamTargetVal;
    var wowzaMapEntries:any[];
    this.streamTargetRequest = new StreamTargetRequest();
    var newKeyDate = this.datePipe.transform(myDate, 'yyMMddhmmss');
    var newStreamEntryName = this.user.w_appname.trim() ;
    //+ "-" + newKeyDate;
    if (getresponse.mapEntries.length > 0) {
      wowzaMapEntries=getresponse.mapEntries;
      var destType=this.channelStreamForm.value.broadcasterDestination.toString();
      if(destType ==="1")
      {
           streamTargetVal= wowzaMapEntries.filter(
           destKey => destKey.host === "rtmp-api.facebook.com");
           newStreamEntryName=newStreamEntryName+"-facebook";
           this.streamTargetRequest.streamName = newKeyResponse.fb_streamkey?newKeyResponse.fb_streamkey.toString().trim():'';
      }
      else if(destType ==="2")
      {
           streamTargetVal= wowzaMapEntries.filter(
           destKey => destKey.host === "a.rtmp.youtube.com");
           newStreamEntryName=newStreamEntryName+"-youtube";
           this.streamTargetRequest.streamName = newKeyResponse.yt_streamkey?newKeyResponse.yt_streamkey.toString().trim():'';
      }
      else if(destType ==="3")
      {
           newStreamEntryName=newStreamEntryName+"-haappyapp";
           this.streamTargetRequest.streamName = newKeyResponse.ha_streamkey?newKeyResponse.ha_streamkey.toString().trim():'';
      }
      if(streamTargetVal.length >0)
      {
        streamTargetVal=streamTargetVal[0];
      }
       //streamTargetVal = getresponse.mapEntries[0];
      
      this.streamTargetRequest.serverName = getresponse.serverName.trim();
      this.streamTargetRequest.sourceStreamName = streamTargetVal.sourceStreamName.trim();
      this.streamTargetRequest.entryName = newStreamEntryName + "-" + newKeyDate.trim();
      this.streamTargetRequest.port = streamTargetVal.port;
      this.streamTargetRequest.enabled=streamTargetVal.enabled;
      this.streamTargetRequest.autoStartTranscoder=streamTargetVal.autoStartTranscoder;
      this.streamTargetRequest.profile = streamTargetVal.profile;
      this.streamTargetRequest.host = streamTargetVal.host.trim();
      this.streamTargetRequest.application = streamTargetVal.application;
      this.streamTargetRequest.userName = streamTargetVal.userName?streamTargetVal.userName:'';
      this.streamTargetRequest.password = streamTargetVal.password?streamTargetVal.password:'';
      
    }

    this.broadcasterService.createStreamTarget(this.streamTargetRequest, this.user.w_appname.trim(), this.streamTargetRequest.entryName)
      .subscribe(
      response => this.streamTargetcreateResponse(response, streamTargetVal.entryName),
      error => this.errorMessage = <any>error)

  }
  
  streamTargetcreateResponse(response, entryName: string) {
    this.broadcasterService.deleteStreamTarget(this.user.w_appname, entryName)
      .subscribe(
      response => this.hasReload (response),
      error => this.errorMessage = <any>error)
  }

  refreshStreamKey()
  {
    
  
     const broadcasterVideoKeyVal = this.channelStreamForm.value;
     var videoKeyValue;
     if(this.bChannelVideos.length>0)
     {
       videoKeyValue= this.bChannelVideos.filter(
       destKey => destKey.id.toString() === broadcasterVideoKeyVal.broadcasterChannelCategoryName.toString());
     }

     if(videoKeyValue.length>0)
     {
        
     var dest = broadcasterVideoKeyVal.broadcasterDestination.toString();
            switch (dest) {
              case "1": {
                  this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length>0?videoKeyValue[0].broadcaster_videos[0].fb_streamkey:'');
                  break;
              }
              
              case "2": {
                  this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length>0?videoKeyValue[0].broadcaster_videos[0].yt_streamkey:'');
                  break;
              }
              
              case "3": {
                 
                  this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length>0?videoKeyValue[0].broadcaster_videos[0].ha_streamkey:'');
                  break;
              }

              default: {
                  
                  this.channelStreamForm.get('channelCurrentStreamKey').setValue(videoKeyValue[0].broadcaster_videos.length>0?videoKeyValue[0].broadcaster_videos[0].yt_streamkey:'');
                  break;
              }
            }
     }


    
  }

  hasReload(response)
  {
    if(response)
    {
     location.reload();
    }
  }

}

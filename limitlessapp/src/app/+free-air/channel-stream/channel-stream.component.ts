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
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
  providers: [BroadcasterService,DatePipe]
})
export class ChannelStreamComponent implements OnInit {
  user: LoginResponse;
  url:'https://www.youtube.com/watch?v=AXcxZXJ73ZA';
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
      broadcasterName: [this.user.client_id?this.user.client_id:1064,Validators.required],
      broadcasterChannelCategoryName: [this.user.primary_channel_id?this.user.primary_channel_id:140,Validators.required],
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
    if(this.user.user_type ==="Super Admin")
      {
         this.client_id=1064;
         this.user.client_id=1064;
         
      }
     
    this.getAllBroadcastersById(this.client_id);
  }

  getAllBroadcastersById(broadcaterId) {
    if(this.client_id === 1064)
      {
           this.broadcasterService.getAllBroadcasters()
          .subscribe(
          broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
          error => this.errorMessage = <any>error);
      }
      else
        {
          this.broadcasterService.getAllBroadcastersById(broadcaterId)
          .subscribe(
          broadcasters => this.setChannelselectedValue(broadcasters = broadcasters),
          error => this.errorMessage = <any>error);
        }
    

  }

  onBroadcasterSelect(broadcasterId,isLoad:boolean) {
    const broadcasterVal = this.channelStreamForm.value;
  
    if (!isLoad && this.user.user_type == "Super Admin" ) {
      this.broadcasterService.getAllBroadcasters().subscribe(
        channelCategories => this.setChannelselectedValue(channelCategories = channelCategories),
        error => this.errorMessage = error
      );
    }
    else
      {
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
      if(this.user.user_type ==="Super Admin")
        {
        
            var filterChannel=broadcasters.filter(sachannel=>sachannel.id.toString() === this.channelStreamForm.value.broadcasterName.toString());
            this.channelCategories=filterChannel.length>0?filterChannel[0].broadcaster_channels:[];
            this.bChannelVideos=filterChannel.length>0?filterChannel[0].broadcaster_channels:[];
            this.updatingResponse(filterChannel);

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
  
    if (broadcasterVideos.length > 0) {
      var broadcasterVideo = broadcasterVideos.length>0 && broadcasterVideos[0].broadcaster_channels.length>0 ?broadcasterVideos[0].broadcaster_channels[0].broadcaster_videos:[];

      if (broadcasterVideo.length > 0) {
       this.user.w_appname=broadcasterVideos[0].w_application_name;
       this.channelStreamForm.setValue({
          channelCurrentStreamKey:null,              // broadcasterVideo[0].yt_streamkey,
          broadcasterChannelCategoryName: broadcasterVideo[0].broadcaster_channel_id,
          channelNewStreamKey: null,
          broadcasterName:  broadcasterVideos[0].id,
          channelVideoId: broadcasterVideo[0].id,
          broadcasterDestination:this.broadcasterDestinations.length>0?this.broadcasterDestinations[1].id:2
       });


       
      }
      
    }
    
  }

  amendChannelVideoKey(value: any) {
    this.showPopup(value);
  }

  stopChannelVideoKey(value: any) {
    var newKeyResponse;

    var destType = this.channelStreamForm.value.broadcasterDestination.toString();
    if (destType === "1") {
      newKeyResponse = {
        id: -1,
        fb_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
    }
    else if (destType === "2") {
      newKeyResponse = {
        id: -1,
        yt_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
    }
    else if (destType === "3") {
      newKeyResponse = {
        id: -1,
        ha_streamkey: this.channelStreamForm.value.channelCurrentStreamKey

      }
    }
    this.streamTargetKeyResponse(newKeyResponse, value);
  }



  showPopup(isStop:boolean) {

    var contentValue="";
    var selValue=this.channelStreamForm.value.broadcasterDestination.toString();
    if(selValue ==="1")
      contentValue="FaceBook";
    else if(selValue ==="2")
      contentValue="YouTube";
    else if(selValue ="3")
      contentValue="Haappyapp";

    this.notificationService.smartMessageBox({
      title: isStop?"Channel Stream Stop" : "Channel Stream Key",
      content:isStop? "Do you want to stop a <i  style='color:green'><b>"+ contentValue +"<b></i> Stream ?Your stream will be stop automatically." :"Do you want to update new <i  style='color:green'><b>"+ contentValue +"<b></i> Stream key?Your stream will be start automatically.",
      buttons: '[No][Yes]'

    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes") {
        if(!isStop)
          {
             this.updateStreamkey();
          }
            else
              {
                this.stopChannelVideoKey(isStop);
              }
       
      }
    });
  }

  updateStreamkey()
  {
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
      createresponse =>this.streamTargetKeyResponse(this.createResponse = createresponse,false),
      error => this.errorMessage = <any>error);
  }


  streamTargetKeyResponse(newKeyResponse,isStop:boolean) {

    this.broadcasterService.getStreamTarget(this.user.w_appname.trim())
      .subscribe(
      response => this.streamTargetGetResponse(response=response,newKeyResponse,isStop) ,
      error => this.errorMessage = <any>error);
  }
  streamTargetGetResponse(getresponse,newKeyResponse,isStop)
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
      this.streamTargetRequest.enabled=isStop?false:true;
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

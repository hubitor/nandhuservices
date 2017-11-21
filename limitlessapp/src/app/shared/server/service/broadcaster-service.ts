import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';
import {AppSettings} from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Broadcasters } from "../../models/broadcasters";
import { ChannelVideoKeyRequest } from "../../models/channelVideoKeyRequest";
import { BroadcasterVideos } from "../../models/broadcasterVideos";
import { CreateResponse } from "../../models/createResponse";
import { headerDict} from "../../models/header";
import { wowzaheaderDict} from "../../models/wowza-header";
import { StreamTargetRequest } from "../../models/stream-target-request";
import { BroadcasterDestination } from "../../models/broadcaster-destination";
import { BroadcasterOnBoardRequest } from "../../models/broadcasterOnBoardRequest";
import { BroadcasterChannel } from "../../models/broadcaster-channel";
import { ChannelCategory } from "../../models/channelCategory";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};

const wowzaHeader={
    wowzaHeader:new Headers(wowzaheaderDict)
};

@Injectable()
export class BroadcasterService {
    broadcasterChannel:BroadcasterChannel[]
    constructor(private http: Http) {
        
    }

    getAllBroadcasterDestination(): Observable<BroadcasterDestination> {

        return this.http.get(AppConfig.get_BroadcasterDest, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllBroadcasterChannelDestination(channelId:number): Observable<BroadcasterDestination> {

        return this.http.get(AppConfig.get_BroadcasterChannelDest+channelId, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllBroadcasterChannel(): Observable<BroadcasterChannel> {

        return this.http.get(AppConfig.get_BroadcasterChannel, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllChannelCategory(): Observable<ChannelCategory[]> {

        return this.http.get(AppConfig.get_ChannelCategory, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    createBroadcasterDestination(broadcasterDestination:BroadcasterDestination): Observable<any> {
        
                return this.http.post(AppConfig.create_Destination,broadcasterDestination, headerObj)
                            .map(ResponseData.extractData)
                            .catch(ResponseData.handleError);
            };



    getAllBroadcasters(): Observable<Broadcasters[]> {

        return this.http.get(AppConfig.get_Broadcasters, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

   getAllBroadcastersById(broadcasterId:number): Observable<Broadcasters>{
        return this.http.get(AppConfig.get_BroadcastersById+broadcasterId,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    getAllBroadcastersByCategoryId(broadcasterId:number,channelCategoryId:number): Observable<BroadcasterVideos>{
        return this.http.get(AppConfig.get_BroadcastersByCategoryId+broadcasterId+"/"+channelCategoryId,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

     createBroadcasterVideos(broadcasterVideos:BroadcasterVideos): Observable<CreateResponse> {

        return this.http.post(AppConfig.new_BroadcasterVideokey,broadcasterVideos, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    updateCategoryVideosKey(channelvideokeyrequest:ChannelVideoKeyRequest,type:string): Observable<CreateResponse> {
        var endpoint_video_url;
        var dest = type;
            switch (dest) {
              case "yt": {
                  endpoint_video_url=AppConfig.update_BroadcasterytVideokey;
                  break;
              }
              
              case "fb": {
                  endpoint_video_url=AppConfig.update_BroadcasterfbVideokey;
                  break;
              }
              
              case "ha": {
                  endpoint_video_url=AppConfig.update_BroadcasterhaVideokey;
                  break;
              }
                case "ps": {
                  endpoint_video_url=AppConfig.update_BroadcasterpsVideokey;
                  break;
              }

              default: {
                  endpoint_video_url=AppConfig.update_BroadcasterytVideokey;
                  break;
              }
            }


        return this.http.put(endpoint_video_url,channelvideokeyrequest,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getStreamTarget(applicationName:string,broadcaster_id:number,w_get_target_url:string)
    {
        
        var get_api_url=w_get_target_url+applicationName+"/pushpublish/mapentries";

        //  if(broadcaster_id === 1090) //1026 -suddi
        //  {
        //     get_api_url="";
        //     get_api_url=AppConfig.get_streamTarget_suddi+applicationName+"/pushpublish/mapentries";
        //  }
         return this.http.get(get_api_url, wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    getSampleStreamTarget(applicationName:string,broadcaster_id:number,w_get_target_url:string)
    {
        // w_get_target_url="http://live.haappyapp.com:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications";
        var get_api_url=w_get_target_url+applicationName+"/pushpublish/mapentries";
        console.log(get_api_url);

        //  if(broadcaster_id === 1090) //1026 -suddi
        //  {
        //     get_api_url="";
        //     get_api_url=AppConfig.get_streamTarget_suddi+applicationName+"/pushpublish/mapentries";
        //  }
         return this.http.get(get_api_url, wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }


    getStreamActiveJournal(applicationName:string)
    {
        applicationName="ka-praaja";
         return this.http.get(AppConfig.get_channel_active+applicationName+"/instances", wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    getStreamTargetJournal(applicationName:string)
    {
        //applicationName="ka-praaja";
         return this.http.get(AppConfig.get_journal_active+applicationName+"/instances", wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    createStreamTargetJournal(streamTargetRequest:StreamTargetRequest,applicationName:string,entryName:string,broadcaster_id:number)
    {
        
        var get_api_url=AppConfig.create_streamTarget_journal+applicationName+"/pushpublish/mapentries/"+entryName;
        
        // if(broadcaster_id === 1026)
        // {
        //     get_api_url="";
        //     get_api_url=AppConfig.create_streamTarget_suddi+applicationName+"/pushpublish/mapentries/"+entryName;
        // }

          return this.http.post(get_api_url, streamTargetRequest,wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    deleteStreamTargetJournal(applicationName:string,entryName:string,broadcaster_id:number)
    {
        
        var get_api_url=AppConfig.delete_streamTarget_journal+applicationName+"/pushpublish/mapentries/"+entryName;
        
        // if(broadcaster_id === 1026)
        // {
        //     get_api_url="";
        //     get_api_url=AppConfig.delete_streamTarget_suddi+applicationName+"/pushpublish/mapentries/"+entryName;
        // }

          return this.http.delete(get_api_url , wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    deleteStreamTarget(applicationName:string,entryName:string,broadcaster_id:number,w_get_target_url:string)
    {
        
        var get_api_url=w_get_target_url+applicationName+"/pushpublish/mapentries/"+entryName;
        //var get_api_url=AppConfig.delete_streamTarget+applicationName+"/pushpublish/mapentries/"+entryName;
        
        // if(broadcaster_id === 1090)//1026-suddi
        // {
        //     get_api_url="";
        //     get_api_url=AppConfig.delete_streamTarget_suddi+applicationName+"/pushpublish/mapentries/"+entryName;
        // }

          return this.http.delete(get_api_url , wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

     createStreamTarget(streamTargetRequest:StreamTargetRequest,applicationName:string,entryName:string,broadcaster_id:number,w_get_target_url:string)
    {
        
        //var get_api_url=AppConfig.create_streamTarget+applicationName+"/pushpublish/mapentries/"+entryName;
        var get_api_url=w_get_target_url+applicationName+"/pushpublish/mapentries/"+entryName;
                
        // if(broadcaster_id === 1090)//1026 -suddi
        // {
        //     get_api_url="";
        //     get_api_url=AppConfig.create_streamTarget_suddi+applicationName+"/pushpublish/mapentries/"+entryName;
        // }

          return this.http.post(get_api_url, streamTargetRequest,wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    createBroadcasterOnboardFlow(broadcasterOnBoardRequest:BroadcasterOnBoardRequest)
    {
        return this.http.post(AppConfig.new_BroadcasterOnBoard,broadcasterOnBoardRequest, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    getChannelsByBroadcasterId(broadcasterId: number): Observable<any>{
        return this.http.get(AppConfig.get_BroadcasterChannelByID+broadcasterId, headerObj)
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }
    
}
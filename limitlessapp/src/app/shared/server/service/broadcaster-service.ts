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

    getAllBroadcasterDestination(channelid:number): Observable<BroadcasterDestination> {

        return this.http.get(AppConfig.get_BroadcasterDest+channelid, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllBroadcasterChannel(): Observable<BroadcasterChannel> {

        return this.http.get(AppConfig.get_BroadcasterChannel, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllChannelCategory(): Observable<ChannelCategory> {

        return this.http.get(AppConfig.get_ChannelCategory, headerObj)
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

    getStreamTarget(applicationName:string)
    {
         return this.http.get(AppConfig.get_streamTarget+applicationName+"/pushpublish/mapentries", wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

    deleteStreamTarget(applicationName:string,entryName:string)
    {
          return this.http.delete(AppConfig.delete_streamTarget+applicationName+"/pushpublish/mapentries/"+entryName, wowzaHeader)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }

     createStreamTarget(streamTargetRequest:StreamTargetRequest,applicationName:string,entryName:string)
    {
          return this.http.post(AppConfig.create_streamTarget+applicationName+"/pushpublish/mapentries/"+entryName, streamTargetRequest,wowzaHeader)
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
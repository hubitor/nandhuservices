import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Broadcasters } from "../../models/broadcasters";
import { BroadcasterVideos } from "../../models/broadcasterVideos";
import { BroadcasterChannel } from "../../models/broadcaster-channel";
import { ChannelCategory } from "../../models/channelCategory";
import { CookieService } from "ngx-cookie";
import { CreateResponse } from "../../models/createResponse";

@Injectable()
export class BroadcasterChannelsService {
  private headers: Headers;
  authToken: string;
  constructor(private http: Http, private cookieService: CookieService) {
    this.authToken = this.cookieService.get("HAUAK")
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
   }

   getPrimaryChannelVideos(broadcasterId: number): Observable<BroadcasterChannel>{
     return this.http.get(AppConfig.getPrimaryChannelVideos+broadcasterId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
   };

   createNewChannel(channel: BroadcasterChannel): Observable<CreateResponse>{
    return this.http.post(AppConfig.createNewChannel, channel, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
   };

   getChannelVideos(channelId: number): Observable<BroadcasterChannel>{
     return this.http.get(AppConfig.getChannelVideos+channelId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
   }

   updateChannelManager(broadcasterChannel:BroadcasterChannel): Observable<BroadcasterChannel> {
    return this.http.put(AppConfig.update_channelManager,broadcasterChannel, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  };

}

import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CreateResponse } from "../../models/createResponse";
import { CookieService } from "ngx-cookie";
import { LogoAds } from "../../models/logo-ads";
import { AdEvent } from "../../models/ad-event";
import { VideoAd } from '../../models/video-ad';

@Injectable()
export class AdsService {
  private headers: Headers;
  authToken: string;

  constructor(private cookieService: CookieService, private http: Http) {
    this.authToken = this.cookieService.get("HAUAK")
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
  }

  createLogoAd(logoAds: LogoAds): Observable<CreateResponse>{
    return this.http.post(AppSettings.API_ENDPOINT+"ads/logo/new", logoAds, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getLogoAdsByChannelId(channelId: number): Observable<LogoAds[]> {
    return this.http.get(AppSettings.API_ENDPOINT+"ads/logo/get/channel/"+channelId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  assignLogoAds(adEvent: AdEvent): Observable<CreateResponse>{
    return this.http.post(AppSettings.API_ENDPOINT+"ads/logo/assign", adEvent, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  createdVideoAd(videoAd: VideoAd): Observable<CreateResponse> {
    return this.http.post(AppSettings.API_ENDPOINT+"ads/videoad/new", videoAd, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

}

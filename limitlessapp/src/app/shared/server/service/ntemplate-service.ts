import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';
import {AppSettings} from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CreateResponse } from "../../models/createResponse";
import { headerDict} from "../../models/header";
import { wowzaheaderDict} from "../../models/wowza-header";
import { NotificationTemplate } from "../../models/notification-template";
import { StreamNotificationRequest } from "../../models/stream-notify-request";




const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};

const wowzaHeader={
    wowzaHeader:new Headers(wowzaheaderDict)
};

@Injectable()
export class NTemplateService {
    notificationTemplate:NotificationTemplate[]
    streamNotificationRequest:StreamNotificationRequest
    constructor(private http: Http) {
        
    }

    stopStreamingNotifcation(nRequest:StreamNotificationRequest): Observable<NotificationTemplate> {

        return this.http.post(AppConfig.stop_stream_url+nRequest.template_id+"/"+nRequest.destination_id+"/"+nRequest.broadcaster_id, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

     startStreamingNotifcation(nRequest:StreamNotificationRequest): Observable<NotificationTemplate> {

        return this.http.post(AppConfig.start_stream_url+nRequest.template_id+"/"+nRequest.destination_id+"/"+nRequest.broadcaster_id, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

   
    
}
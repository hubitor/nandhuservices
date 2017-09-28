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
import { JournalDevice } from "../../models/journal-device";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};

const wowzaHeader={
    wowzaHeader:new Headers(wowzaheaderDict)
};

@Injectable()
export class JournalDeviceService {
  journalDevice:JournalDevice[]
    constructor(private http: Http) {
        
    }

getAllJournalDevices(): Observable<JournalDevice[]> {
    return this.http.get(AppConfig.jdevices_all, headerObj)
                          .map(ResponseData.extractData)
                          .catch(ResponseData.handleError);
     };

createJournal(journalDevice:JournalDevice): Observable<JournalDevice[]> {
  return this.http.post(AppConfig.new_JournalDevice,journalDevice , headerObj)
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };
cancelJournal(journalDevice:JournalDevice): Observable<JournalDevice[]> {
    return this.http.patch(AppConfig.cancel_JournalDevice,journalDevice, headerObj)
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };

   
   
    
}

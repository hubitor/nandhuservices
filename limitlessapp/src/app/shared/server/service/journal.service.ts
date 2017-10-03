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
import { Journal } from "../../models/journal";
// import { JournalListRequest } from "../../models/journal-list-request";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};

const wowzaHeader={
    wowzaHeader:new Headers(wowzaheaderDict)
};

@Injectable()
export class JournalService {
  journal:Journal[]
    constructor(private http: Http) {
        
    }

getJournalsByChannelId(channel_id:number): Observable<Journal[]> {

  return this.http.get(AppConfig.journal_list_url+channel_id, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
getAllJournals(): Observable<Journal[]> {
    return this.http.get(AppConfig.journal_all_list_url, headerObj)
                          .map(ResponseData.extractData)
                          .catch(ResponseData.handleError);
     };

createJournal(journal:Journal): Observable<any> {
  return this.http.post(AppConfig.new_Journal,journal , headerObj)
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };
amendJournal(journal:Journal): Observable<Journal[]> {
    return this.http.patch(AppConfig.amend_Journal,journal, headerObj)
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };

   
   
    
}

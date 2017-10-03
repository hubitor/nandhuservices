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
import { CookieService } from "ngx-cookie";
import { JournalSetting } from '../../models/journal-setting';
import { JournalDevice } from '../../models/journal-device';

@Injectable()
export class JournalService {
	private headers: Headers;
	authToken: string;
  journal:Journal[];
  
    constructor(private http: Http, private cookieService: CookieService) {
    this.authToken = this.cookieService.get("HAUAK")
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
  }

getJournalsByChannelId(channel_id:number): Observable<Journal[]> {

  return this.http.get(AppConfig.journal_list_url+channel_id, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
getAllJournals(): Observable<Journal[]> {
    return this.http.get(AppConfig.journal_all_list_url, {headers: this.headers})
                          .map(ResponseData.extractData)
                          .catch(ResponseData.handleError);
     };

createJournal(journal:Journal): Observable<any> {
  return this.http.post(AppConfig.new_Journal,journal ,{headers: this.headers})
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };
amendJournal(journal:Journal): Observable<Journal[]> {
    return this.http.patch(AppConfig.amend_Journal,journal, {headers: this.headers})
                                .map(ResponseData.extractData)
                                .catch(ResponseData.handleError);
                };
				
	getJournalsByChannel(channelId: number): Observable<Journal[]>{
    return this.http.get("http://localhost:3000/journal/list/channel/"+channelId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getJournalSettingByJournalId(journalId: number): Observable<JournalSetting[]>{
    return this.http.get("http://localhost:3000/journal/get/settings/"+journalId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getJournalDeviceBySettingsId(settingId: number): Observable<JournalDevice>{
    return this.http.get("http://localhost:3000/journal/get/device/"+settingId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getJournalSettingBySettingId(settingId: number): Observable<JournalSetting>{
    return null;
  }
}

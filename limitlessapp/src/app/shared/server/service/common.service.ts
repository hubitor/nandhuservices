import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie';
import { Language } from 'app/shared/models/language';

@Injectable()
export class CommonService {
  private headers: Headers;
  authToken: string;

  constructor(private http: Http, private cookieService: CookieService) {
    console.log('category service is initialized');
    this.authToken = this.cookieService.get("HAUAK")
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
  }

  getAllLanguages(): Observable<Language[]>{
    return this.http.get(AppConfig.get_language, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

}

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

@Injectable()
export class UploadService {
  private headers: Headers;
  authToken: string;

  constructor(private http: Http, private cookieService: CookieService) {
    this.authToken = this.cookieService.get("HAUAK")
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
  }

  uploadFileToYoutube(formData: FormData, access_token: string): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT+'upload/tester/'+access_token, formData)
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

}

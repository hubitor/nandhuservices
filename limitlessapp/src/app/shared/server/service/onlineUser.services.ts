// import { Injectable } from '@angular/core';
// import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
// import { AppSettings } from '../api/api-settings'
// import { ResponseData } from "../service/response-data";
// import { AppConfig } from "../api/app-config";
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// import { LoginRequest } from '../../models/loginRequest';
// import { JournalLoginResponse } from '../../models/journalLoginResponse';
// import { UserRolesModel } from '../../models/userRolesModel';
// import { JournalService } from '../../../shared/server/service/journal.service';
// import { Journal } from '../../../shared/models/journal';
// @Injectable()
// export class OnlineUserService {
//   private headers: Headers;
//     journalId:number; 
//     journalState;

//   constructor(private http:Http,journalService:JournalService) 
//   {
//     this.headers = new Headers();
//     this.headers.append('Content-Type', 'application/json');
//     this.headers.append('Accept', 'application/json');
//     this.headers.append('Authorization', 'NDI0OS57InJvbGUiOiJqb3VybmFsIiwidmFsdWUiOiIxMzI0NjA0NmJiMjg2Njg5YmU2ZmQ2ZWRiM2QzNGI3NjE3NzExYzI1NTZiM2FiMzUzMDUxOWYyMThmYWJlMmNhIiwia2V5IjoxMH0=');
//   }

//   journalLogin(loginRequest: LoginRequest): Observable<JournalLoginResponse> {
//     return this.http.post(AppSettings.API_ENDPOINT + "journal/login", loginRequest, { headers: this.headers })
//       .map(ResponseData.extractData)
//       .catch(ResponseData.handleError);
//   };

//   getUserRoles(journalId: number): Observable<UserRolesModel[]> {
//     return this.http.get(AppSettings.API_ENDPOINT+"user/roles/"+journalId, {headers: this.headers})
//       .map(ResponseData.extractData)
//       .catch(ResponseData.handleError);
//   }

// }

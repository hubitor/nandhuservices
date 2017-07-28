import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LoginRequest } from '../../models/loginRequest';
import { LoginResponse } from '../../models/loginResponse';
import { UserRolesModel } from '../../models/userRolesModel';

@Injectable()
export class AuthServiceService {
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', 'NzBhOGE1ZGYyZDdmNzE3ZjQ3M2RhNzM5YjcyNjhkOWY5ZTZkNTk4ODM5NWRhYjk3YmVmYmIyY2ViODg1NTZlOWMwNGFkOTNmYzM5NDIzZjJhMjQ4ZGZmNzRmYzRkZmUwZGJjMDVjZjhhNjYyYzVmM2NiZDU0NmU5NGY0MjI3NmMwZDg4MGUxOGE3ZDI0MGU0NmI2ZTVkNWJlMDliZWU5ZTY5NmJmMDgxYjQ3MzY3MzU2YmY5YTgwOTQ1MTMyN2IwNGI0NjYzMmRjZTI2NThhMzBmZjIzZDMzODgyZWM4ZGE3YmQ0MGI1MTQzMTY2Ng==');
  }

  userLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post(AppSettings.LOCAL_API + "user/login", loginRequest, { headers: this.headers })
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  };

  getUserRoles(userId: number): Observable<UserRolesModel[]> {
    return this.http.get(AppSettings.API_ENDPOINT+"user/roles/"+userId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

}

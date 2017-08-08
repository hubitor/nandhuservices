import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams }       from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Application } from "app/shared/models/application";
import { CookieService } from "ngx-cookie";
import { User } from "app/shared/models/userModel";
import { CreateResponse } from "app/shared/models/createResponse";
import { ApplicationUsersRole } from "app/shared/models/applicationUsersRole";

@Injectable()
export class ApplicationService {
    private headers: Headers;
    authToken: string;

    constructor(private http: Http, private cookieService: CookieService) {
        console.log('applicaion service is initialized');
        this.authToken = this.cookieService.get("HAUAK")
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', this.authToken);
    }

    getApplicationList(): Observable<Application[]>{
        return this.http.get("http://localhost:3000/applications/app/all", {headers: this.headers})
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    };

    getApplication(id:number): Observable<Application> {

        return this.http.get(AppConfig.get_Appl+"/"+id)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    newUserRegisteration(user: User): Observable<any>{
        return this.http.post("http://localhost:3000/user/register", user, {headers: this.headers})
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }

    getAllRoles(): Observable<any>{
        return this.http.get("http://localhost:3000/applications/app/role/all", {headers: this.headers})
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }
}
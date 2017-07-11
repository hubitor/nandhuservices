import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams }       from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Application } from "app/shared/models/application";

@Injectable()
export class ApplicationService {

    constructor(private http: Http) {
        console.log('video service is initialized');
    }

    getApplication(id:number): Observable<Application> {

        return this.http.get(AppConfig.get_Appl+"/"+id)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
}
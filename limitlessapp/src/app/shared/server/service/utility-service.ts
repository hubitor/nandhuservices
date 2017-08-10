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
import { Country } from "../../models/country";
import { State } from "../../models/state";
import { City } from "../../models/city";
import { Rank } from "../../models/rank";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
};

@Injectable()
export class UtilityService {
    
    constructor(private http: Http) {
        
    }

    getState(countryId:number): Observable<State> {

        return this.http.get(AppConfig.get_state+countryId, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getCountry(): Observable<Country> {

        return this.http.get(AppConfig.get_country, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

      getCity(stateId:number): Observable<City> {

        return this.http.get(AppConfig.get_city+stateId, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

     getRank(): Observable<Rank> {

        return this.http.get(AppConfig.get_rank, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
    
    
    
}
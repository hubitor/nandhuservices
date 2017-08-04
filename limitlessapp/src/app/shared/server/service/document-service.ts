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
import { Document } from "../../models/document";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict)
  
};


@Injectable()
export class DocumentService {
    
    constructor(private http: Http) {
        
    }

    getAllDcoumentType(): Observable<Document> {

        return this.http.get(AppConfig.get_DocumentType, headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
    
    
}
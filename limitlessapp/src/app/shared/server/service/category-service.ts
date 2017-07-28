import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';
import {AppSettings} from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Category } from "../../models/category";
import { CreateResponse } from "../../models/createResponse";
import { CategoryUpdateResponse } from "../../models/categoryUpdateResponse";
import { CookieService } from 'ngx-cookie';

@Injectable()
export class CategoryService {
    private headers: Headers;
    authToken:string;

    constructor(private http: Http, private cookieService: CookieService) {
        console.log('category service is initialized');
        this.authToken = this.cookieService.get("HAUAK")
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', this.authToken);
    }

    getAllCategory(): Observable<Category> {

        return this.http.get(AppConfig.get_Category, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
     createCategory(category:Category): Observable<CreateResponse> {

        return this.http.post(AppConfig.new_Category,category, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
    amendCategory(category:Category): Observable<Category> {

        return this.http.patch(AppConfig.amend_Category,category, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getCategory(id:number): Observable<CategoryUpdateResponse>{
        return this.http.get(AppConfig.getid_category+"/"+id, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    }
}
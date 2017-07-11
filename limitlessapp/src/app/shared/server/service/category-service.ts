import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Category } from "../../models/category";
import { CreateResponse } from "../../models/createResponse";
import { CategoryUpdateResponse } from "../../models/categoryUpdateResponse";

@Injectable()
export class CategoryService {
    private headers: Headers;

    constructor(private http: Http) {
        console.log('category service is initialized');
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', 'NzBhOGE1ZGYyZDdmNzE3ZjQ3M2RhNzM5YjcyNjhkOWY5ZTZkNTk4ODM5NWRhYjk3YmVmYmIyY2ViODg1NTZlOWMwNGFkOTNmYzM5NDIzZjJhMjQ4ZGZmNzRmYzRkZmUwZGJjMDVjZjhhNjYyYzVmM2NiZDU0NmU5NGY0MjI3NmMwZDg4MGUxOGE3ZDI0MGU0NmI2ZTVkNWJlMDliZWU5ZTY5NmJmMDgxYjQ3MzY3MzU2YmY5YTgwOTQ1MTMyN2IwNGI0NjYzMmRjZTI2NThhMzBmZjIzZDMzODgyZWM4ZGE3YmQ0MGI1MTQzMTY2Ng==');
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
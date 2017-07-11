import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams }       from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Product } from "../../models/product";
import { headerDict} from "../../models/header";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict), 
};

@Injectable()
export class ProductService {

    constructor(private http: Http) {
        console.log('Product service is initialized');
    }

    getAllProducts(): Observable<Product[]> {
        return this.http.get(AppConfig.get_Products,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
     createProduct(product:Product): Observable<Product> {

        return this.http.post(AppConfig.new_Product,product)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
    amendProduct(product:Product): Observable<Product> {

        return this.http.patch(AppConfig.amend_Product,product)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };
}
import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams }       from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Category } from "../../models/category";
import { SubCategory } from "../../models/sub-category";
import { IsStatus } from "../../models/isStatus";
// import { Country } from "../../models/country";
import { headerDict} from "../../models/header";

const headerObj = {                                                                                                                                                                                 
  headers: new Headers(headerDict), 
};

@Injectable()
export class DropdownService {
    public isStatus: IsStatus[];
    public subcategories:SubCategory[];
    constructor(private http: Http) {       
        console.log('Dropdown service is initialized');
       this.isStatus=[];
       this.subcategories=[];
    }

    getAllCategory(): Observable<Category[]> {
      

        return this.http.get(AppConfig.get_Category,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getAllSubCategory(categoryId): Observable<SubCategory[]> {
        return this.http.get(AppConfig.get_Subcategory+categoryId,headerObj)
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
    };

    getStatus():IsStatus[]{
         this.isStatus.push({
            value_field:true,
            text_field:"Active"
        });
        this.isStatus.push({
            value_field:false,
            text_field:"Passive"
        });
         return this.isStatus;
    }

//     getCountries() {
//     return [
//      new Country(1, 'USA' ),
//      new Country(2, 'India' ),
//      new Country(3, 'Australia' )
//     ];
//   }

    
     
}
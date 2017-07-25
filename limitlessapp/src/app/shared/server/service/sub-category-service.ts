import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SubCategory } from "../../models/sub-category";
import { headerDict} from "../../models/header";
import { CreateResponse } from "../../models/createResponse";
import { FileDeleteRequest } from "../../models/fileDeleteRequest"
import { AppSettings } from "../api/api-settings";

@Injectable()
export class SubCategoryService {
  private headers: Headers;
  constructor(private http: Http) {
        console.log('category service is initialized');
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', 'NzBhOGE1ZGYyZDdmNzE3ZjQ3M2RhNzM5YjcyNjhkOWY5ZTZkNTk4ODM5NWRhYjk3YmVmYmIyY2ViODg1NTZlOWMwNGFkOTNmYzM5NDIzZjJhMjQ4ZGZmNzRmYzRkZmUwZGJjMDVjZjhhNjYyYzVmM2NiZDU0NmU5NGY0MjI3NmMwZDg4MGUxOGE3ZDI0MGU0NmI2ZTVkNWJlMDliZWU5ZTY5NmJmMDgxYjQ3MzY3MzU2YmY5YTgwOTQ1MTMyN2IwNGI0NjYzMmRjZTI2NThhMzBmZjIzZDMzODgyZWM4ZGE3YmQ0MGI1MTQzMTY2Ng==');
    }

  getAllSubcategory(categoryId): Observable<SubCategory[]> {
    return this.http.get(AppConfig.get_Subcategory+categoryId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  };
  CreatesubCategory(subcategory:SubCategory): Observable<CreateResponse>
  {
    return this.http.post(AppConfig.new_Subcategory,subcategory, {headers: this.headers})
                    .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
  };
  amendsubCategory(subcategory:SubCategory): Observable<SubCategory> {

        return this.http.put(AppConfig.amend_Subcategory,subcategory, {headers: this.headers})
                .map(ResponseData.extractData)
                    .catch(ResponseData.handleError);
   };

   getSubcategoryById(subcategoryId): Observable<SubCategory> {
     return this.http.get(AppConfig.get_subcategory_by_id+subcategoryId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
   };

   deleteSubcategoryImage(fileDeleteRequest:FileDeleteRequest): Observable<any> {
     return this.http.put(AppSettings.API_ENDPOINT+ "upload/image/delete", fileDeleteRequest, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
   };
}

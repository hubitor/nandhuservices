import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie';
import { Shop } from 'app/shared/models/shop';
import { CreateResponse } from 'app/shared/models/createResponse';
import { ShopCreateResponse } from 'app/shared/models/shopCreateResponse';

@Injectable()
export class ShopService {
  private headers: Headers;
  authToken: string;

  constructor(private http: Http, private cookieService: CookieService) {
    console.log('shop service initialized');
    this.authToken = this.cookieService.get("HAUAK");
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', this.authToken);
  }

  createShop(shop: Shop): Observable<ShopCreateResponse>{
    return this.http.post("http://localhost:3000/user/shop/new", shop, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getAllShops(): Observable<Shop[]>{
    return this.http.get("http://localhost:3000/user/shop/all", {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

}

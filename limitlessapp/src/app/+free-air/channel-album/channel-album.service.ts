import { Injectable } from '@angular/core';

import { Http,Headers, Response,RequestOptions,URLSearchParams }       from '@angular/http';

import { ChannelAlbum } from "../channel-album/channel-album";

import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ChannelAlbumService {

//private albumUrl="https://services.beinglimitless.in/engage/broadcast/video/get";
//private albumUrl="https://services.beinglimitless.in/engage/broadcast/channel/category/get";
//private albumUrl="https://services.beinglimitless.in/engage/broadcast/channel/category/get";
 //private albumUrl="https://ifsc.razorpay.com/SBIN0015418";
  //private albumUrl="http://localhost:47503/api/Products";

  private albumUrl="http://localhost:4500/application/5";
constructor(private http: Http) {
  console.log('video service is initialized');
}

getAlbums(): Observable<ChannelAlbum[]> {
  console.log('get albums service is called');
  let headers = new Headers();

     //headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    //  headers.append('Authorization', 'NTkueyJyb2xlIjoiY3VzdG9tZXIiLCJ2YWx1ZSI6IjNlNmRhMjQ3ZjE4MTFkMjBmYjU1ZGJkNDkzMTdlNjEyZjI2ZmE0ZmYwZDYzOTQxZTNjMmI1ZTU4NDkwNTM2YWUiLCJrZXkiOjR9');
    //  headers.append('Access-Control-Allow-Origin','https://services.beinglimitless.in');
    //  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
     // Set to true if you need the website to include cookies in  requests
     //headers.append('Access-Control-Allow-Credentials', 'true');

   // let options = new RequestOptions({ headers: headers });
    // return this.http.get(this.albumUrl)
    //                 .map(this.extractData)
    //                 .catch(this.handleError);

     return this.http.get(this.albumUrl)
                    .map(this.extractData)
                    .catch(this.handleError);

    
  }

private extractData(res: Response) {
    debugger;
    let body = res.json();
    return body.data || { };
  }

private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

}
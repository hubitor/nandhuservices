import { Observable }     from 'rxjs/Observable';
import { Response }       from '@angular/http';

export class ResponseData
{
    public static extractData(res: Response) { 
      ;  
    let body = res.json();
    return body || { };
    //return body.data || { };
  }

  public static handleError (error: Response | any) {
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
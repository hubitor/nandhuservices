import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AppSettings } from '../api/api-settings'
import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { LoginRequest } from '../../models/loginRequest';
import { LoginResponse } from '../../models/loginResponse';
import { UserRolesModel } from '../../models/userRolesModel';
import { GoogleClientKeys } from '../../models/google-client-keys';
import { JournalService } from '../../../shared/server/service/journal.service';
import { Journal } from '../../../shared/models/journal';
@Injectable()
export class OnlineUserService {
  private headers: Headers;
    mouseEvents: Subscription;
    timer: Subscription;
    journalId:number; 
    journalState;
    db;
    afAuth;

  constructor(private http:Http,journalService:JournalService) 
  {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Authorization', 'NzBhOGE1ZGYyZDdmNzE3ZjQ3M2RhNzM5YjcyNjhkOWY5ZTZkNTk4ODM5NWRhYjk3YmVmYmIyY2ViODg1NTZlOWMwNGFkOTNmYzM5NDIzZjJhMjQ4ZGZmNzRmYzRkZmUwZGJjMDVjZjhhNjYyYzVmM2NiZDU0NmU5NGY0MjI3NmMwZDg4MGUxOGE3ZDI0MGU0NmI2ZTVkNWJlMDliZWU5ZTY5NmJmMDgxYjQ3MzY3MzU2YmY5YTgwOTQ1MTMyN2IwNGI0NjYzMmRjZTI2NThhMzBmZjIzZDMzODgyZWM4ZGE3YmQ0MGI1MTQzMTY2Ng==');
    
        // this.journalState
        //     .do(juser => {
        //       if (juser) 
        //       {
        //          this.journalId =juser.id
        //          this.updateOnConnect();
        //          this.updateOnDisconnect(); 
        //          this.updateOnIdle();
        //       }
        //     })
        // .subscribe();
  }

  journalLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post(AppSettings.API_ENDPOINT + "journal/login", loginRequest, { headers: this.headers })
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  };

  getUserRoles(journalId: number): Observable<UserRolesModel[]> {
    return this.http.get(AppSettings.API_ENDPOINT+"user/roles/"+journalId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }

  getGoogleClientKeys(journalId: number): Observable<GoogleClientKeys> {
    return this.http.get("http://localhost:3000/user/get/client_keys/"+journalId, {headers: this.headers})
      .map(ResponseData.extractData)
      .catch(ResponseData.handleError);
  }
   
  private updateStatus(status: string) {
      if (!this.journalId) 
      return this.db.object(`users/` + this.journalId).update({ status: status })
    }
 
  private updateOnConnect() {
    return this.db.object('.info/connected')
                  .do(connected => {
                      let status = connected.$value ? 'online' : 'offline'
                      this.updateStatus(status)
                  })
                  .subscribe()
  }

   
   private updateOnDisconnect()
  {
    // database().ref().child(`users/${this.journalId}`)
    //         .onDisconnect()
    //         .update({status: 'offline'})
  }

  
   private updateOnIdle() 
  {

    this.mouseEvents = Observable.fromEvent(document, 'mousemove').throttleTime(2000)
      .do(() => {
                  this.updateStatus('online')
                  this.resetTimer()
                }).subscribe()
  }
 
  private resetTimer() 
  {
    if (this.timer) this.timer.unsubscribe()
    this.timer = Observable.timer(5000)
      .do(() => {
                  this.updateStatus('away')
                }
          ).subscribe()
  }
 
  signOut() {
    this.updateStatus('offline')
    this.mouseEvents.unsubscribe()
    this.timer.unsubscribe()
    this.afAuth.auth.signOut();
    
  }

}

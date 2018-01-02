import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { ResponseData } from "../service/response-data";
import { AppConfig } from "../api/app-config";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Application } from "app/shared/models/application";
import { CookieService } from "ngx-cookie";
import { User } from "app/shared/models/userModel";
import { CreateResponse } from "app/shared/models/createResponse";
import { ApplicationUsersRole } from "app/shared/models/applicationUsersRole";
import { SuperUserRequest } from "../../../shared/models/superUserRequest";
import { AssignedUserRoleModule } from  "../../../shared/models/assigned-user-role-module";
import { ApplicationModule } from "../../../shared/models/applicationModule";

@Injectable()
export class ApplicationService {
    private headers: Headers;
    authToken: string;

    constructor(private http: Http, private cookieService: CookieService) {
        console.log('applicaion service is initialized');
        this.authToken = this.cookieService.get("HAUAK")
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', this.authToken);
    }

    getApplicationList(): Observable<Application[]> {
        return this.http.get(AppConfig.get_application, { headers: this.headers })
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    };

    getApplication(id: number): Observable<Application> {

        return this.http.get(AppConfig.get_Appl + "/" + id)
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    };

    newUserRegisteration(user: User): Observable<any> {
        return this.http.post(AppConfig.new_user, user, { headers: this.headers })
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);

    }

    getAllRoles(): Observable<ApplicationUsersRole[]> {
        return this.http.get(AppConfig.user_roleAll, { headers: this.headers })
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }

    getAllModules(): Observable<ApplicationModule[]> {
        return this.http.get(AppConfig.user_moduleAll, { headers: this.headers })
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }



    getApplicationUserByClientId(ClientId:number): Observable<Application[]> {
        return this.http.get(AppConfig.get_appUser+ClientId, { headers: this.headers })
            .map(ResponseData.extractData)
            .catch(ResponseData.handleError);
    }

    updateRolesModule(assignedUserRoleModule:AssignedUserRoleModule): Observable<AssignedUserRoleModule[]> {
        return this.http.put(AppConfig.update_roles_module,assignedUserRoleModule, {headers: this.headers})
                                                   .map(ResponseData.extractData)
                                                   .catch(ResponseData.handleError);
      };
}

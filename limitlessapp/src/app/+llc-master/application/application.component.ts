import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "app/shared/server/service/application-service";
import { Observable }     from 'rxjs/Observable';
import { Application } from "app/shared/models/application";
@Component({
  selector: 'llc-appl',
  templateUrl: './application.component.html',
   providers: [ApplicationService]
})
export class ApplicationComponent implements OnInit {
  errorMessage: string;
  appid:number;
  application:any;
  mode = 'Observable';
  constructor(private applicationService: ApplicationService) { }
  
  ngOnInit() {
    console.log('intialize channel album');
     this.getApplication(this.appid);
  }
getApplication(id:number) {
    console.log('getalbums is called');
    this.applicationService.getApplication(5)
                     .subscribe(
                       application => this.application = application,
                       error =>  this.errorMessage = <any>error);
                      
  }

}
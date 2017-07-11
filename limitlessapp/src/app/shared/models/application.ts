export class Application
{
    applicationName:string;
    applicationShortName:string;
    description:string;
    isActive:boolean;
    createdBy:string;
    createdOn:Date;
    lastUpdatedBy:string;
    lastUpdatedOn:Date;

    constructor(application:any) {
    this.applicationName = application.applicationName;
    this.applicationShortName = application.applicationShortName;
    this.description=application.description;
    this.isActive=application.isActive;
    this.createdBy=application.createdBy;
    this.lastUpdatedBy=application.lastUpdatedBy;
    //this.rating = this.calculateRating(userInfo);
  }

}
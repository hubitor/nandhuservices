import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { BroadcasterService } from "../../shared/server/service/broadcaster-service";
import { DocumentService } from "../../shared/server/service/document-service"
import { UtilityService } from "../../shared/server/service/utility-service"
import { Observable } from 'rxjs/Observable';
import { Broadcasters } from "../../shared/models/broadcasters";
import { CreateResponse } from "../../shared/models/createResponse";
import { LoginResponse } from "../../shared/models/loginResponse";
import 'rxjs/add/observable/of';
import { NotificationService } from "../../shared/utils/notification.service";
import { DatePipe } from '@angular/common';
import { BroadcasterOnBoardRequest } from "../../shared/models/broadcasterOnBoardRequest";
import { BroadcasterChannel } from "../../shared/models/broadcaster-channel";
import { Document } from "../../shared/models/document";
import { Country } from "../../shared/models/country";
import { State } from "../../shared/models/state";
import { City } from "../../shared/models/city";
import { ChannelCategory } from "../../shared/models/channelCategory";
import { BroadcasterVideos } from "../../shared/models/broadcasterVideos";

@Component({
    selector: 'app-broadcaster',
    templateUrl: './broadcaster.component.html',
    providers: [BroadcasterService,DocumentService,UtilityService, DatePipe]
})
export class BroadcasterComponent implements OnInit {
    user: LoginResponse;
    broadcasterForm: FormGroup;
    errorMessage: string;
    appid: number;
    client_id: number;
    broadcasters: Broadcasters;
    createResponse: CreateResponse;
    channelCategories;
    documents;
    countries;
    states;
    cities;
    ranks;
    broadcasterOnBoardRequest:BroadcasterOnBoardRequest;
    mode: 'Observable';
    constructor(private broadcasterService: BroadcasterService
        , private fb: FormBuilder
        , private notificationService: NotificationService
        , private datePipe: DatePipe
        , private documentService:DocumentService
        , private utilityService:UtilityService) {
        this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
        this.createForm();
        this.getChannelCategory();
        this.getDocumentType();
        this.getCountry();
        this.getRank();
    }

    createForm() {
        this.broadcasterForm = this.fb.group({
            broadcasterNamecontrol: [null, Validators.required],
            broadcasterDescriptionControl: [null],
            broadcasterChannelCategoryControl:[null],
            broadcasterPrimaryChannelControl: [null, Validators.required],
            broadcasterEmailControl: [null, [Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]],
            broadcasterWebsiteControl: [null],
            broadcasterTagControl: [null],
            broadcasterLatitudeControl:["0.000000",Validators.required],
            broadcasterLongtitudeControl:["0.000000",Validators.required],
            broadcasterDocumentTypeControl:[null],
            broadcasterDocumenttextControl:[null],
            broadcasterPubDNSControl:[null],
            broadcasterPrivateDNSControl:[null],
            broadcasterWApplicationControl:[null],
            broadcasterStatusControl:[null],
            broadcasterCityControl:[null],
            broadcasterStateControl:[null],
            broadcasterCountryControl:[null],
            broadcasterRankControl:[null,Validators.required]

        });
    }

    ngOnInit() {

        this.client_id = this.user.client_id;

    }

    showPopup() {

        var contentValue = "";


        this.notificationService.smartMessageBox({
            title: "Channel Stream Key",
            content: "Do you want to update new <i  style='color:green'><b>" + contentValue + "<b></i> Stream key?Your stream will be start automatically.",
            buttons: '[No][Yes]'

        }, (ButtonPressed) => {
            if (ButtonPressed == "Yes") {

            }
        });
    }

    getBroadcasterChannel()
    {
        this.broadcasterService.getAllBroadcasterChannel()
      .subscribe(
       bChannelResponse=>{
            this.channelCategories=bChannelResponse;
       }),
      error => this.errorMessage = <any>error;
    };

    getChannelCategory()
    {
        this.broadcasterService.getAllChannelCategory()
      .subscribe(
       categoryResponse=>{
            this.channelCategories=categoryResponse;
       }),
      error => this.errorMessage = <any>error;
    };


     getCountry()
    {
        this.utilityService.getCountry()
      .subscribe(
       countryResponse=>{
            this.countries=countryResponse;
           
            
       }),
      error => this.errorMessage = <any>error;
    };

    getState(countryId:number)
    {
        this.utilityService.getState(countryId)
      .subscribe(
       stateResponse=>{
            this.states=stateResponse;
              
       }),
      
      error => this.errorMessage = <any>error;
      
    };    

    getCity(stateId:number)
    {
        this.utilityService.getCity(stateId)
      .subscribe(
       cityResponse=>{
            this.cities=cityResponse;
       }),
      error => this.errorMessage = <any>error;
    };

    populateApplicationName(channelName:string)
    {
        
              var stateCode=this.states.filter(st=>st.id.toString() === this.broadcasterForm.value.broadcasterStateControl);
              //var categoryCode=this.channelCategories.filter(cg=>cg.id.toString() === this.broadcasterForm.value.broadcasterChannelCategoryControl);
              var appName="";
              appName=stateCode.length>0?stateCode[0].state_code:"" +" - "+ channelName;
              this.broadcasterForm.patchValue({
                    broadcasterWApplicationControl:appName
                });
    }

    getDocumentType()
    {
        this.documentService.getAllDcoumentType()
      .subscribe(
       documentResponse=>{
            this.documents=documentResponse;
       }),
      error => this.errorMessage = <any>error;
    }

    getRank()
    {
        this.utilityService.getRank()
      .subscribe(
       rankResponse=>{
            this.ranks=rankResponse;
       }),
      error => this.errorMessage = <any>error;
    };

    createBroadcasterOnBoardFlow()
    {
       var bc_onboardRequest=new BroadcasterOnBoardRequest();
       
    }

    hasReload(response) {
        if (response) {
            location.reload();
        }
    }

}

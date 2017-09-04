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
import { CommonService } from '../../shared/server/service/common.service';

@Component({
    selector: 'app-broadcaster',
    templateUrl: './broadcaster.component.html',
    providers: [BroadcasterService,DocumentService,UtilityService,CommonService, DatePipe]
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
    languages;
    broacasterall:Broadcasters[];
    broadcasterOnBoardRequest:BroadcasterOnBoardRequest;
    mode: 'Observable';
    constructor(private broadcasterService: BroadcasterService
        , private fb: FormBuilder
        , private notificationService: NotificationService
        , private datePipe: DatePipe
        , private documentService:DocumentService
        , private utilityService:UtilityService
        ,private commonService:CommonService) {
        this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
        this.createForm();
        
        this.getChannelCategory();
        this.getDocumentType();
        this.getCountry();
        this.getRank();
        this.getAllLanguages();
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
            broadcasterRankControl:[null,Validators.required],
            broadcasterLanguageControl:[null]

        });
    }

    ngOnInit() {

        this.client_id = this.user.client_id;
        this.getBroadcasterAllGrid();
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

      getBroadcasterAllGrid()
    {
        this.broadcasterService.getAllBroadcasters()
      .subscribe(
       broadcasterResponse=>{
           
            this.broacasterall=broadcasterResponse;
       }),
      error => this.errorMessage = <any>error;
    };

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

    populateApplicationName(channelName:string,statecode:string):string
    {
         return channelName.toLowerCase() +"-"+ statecode.toLowerCase();
    }

     populateVideoURLName(applicationName:string,streamName:string):string
    {
         return "http://live.haappyapp.com:1935/"+ applicationName+"/"+ streamName +"/"+ streamName +"/playlist.m3u8";
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

     getAllLanguages(){
    this.commonService.getAllLanguages().subscribe(
      languages => {
        this.languages = languages;
       
      },
      error => {
        console.log(error);
        
      }
    );
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
      var cntry,state,city;
       var bc_onboardRequest=new BroadcasterOnBoardRequest();
       var b_ControlValue=this.broadcasterForm.value;
       bc_onboardRequest.broadcaster_name=b_ControlValue.broadcasterNamecontrol;
       bc_onboardRequest.broadcaster_description=b_ControlValue.broadcasterDescriptionControl;
       bc_onboardRequest.category_id= cntry = b_ControlValue.broadcasterChannelCategoryControl;
       cntry=  this.countries.filter(c=>c.id.toString() === b_ControlValue.broadcasterCountryControl ) ;
       bc_onboardRequest.country_code=cntry.length>0?cntry[0].country_code:"";
       state=  this.states.filter(s=>s.id.toString() === b_ControlValue.broadcasterStateControl ) ;
       bc_onboardRequest.state_code=state.length>0?state[0].state_code:"";
       city=  this.cities.filter(ci=>ci.id.toString() === b_ControlValue.broadcasterCityControl ) ;
       bc_onboardRequest.city_code=city.length>0?city[0].city_code:"";
       bc_onboardRequest.broadcaster_channel_name=b_ControlValue.broadcasterPrimaryChannelControl;
       bc_onboardRequest.broadcaster_email=b_ControlValue.broadcasterEmailControl;
       bc_onboardRequest.broadcaster_website=b_ControlValue.broadcasterWebsiteControl;
       bc_onboardRequest.broadcaster_tags=b_ControlValue.broadcasterTagControl;
       bc_onboardRequest.broadcaster_loc_latitude=b_ControlValue.broadcasterLatitudeControl;
       bc_onboardRequest.broadcaster_loc_longitude=b_ControlValue.broadcasterLongtitudeControl;
       bc_onboardRequest.broadcast_kyc_doc_type=b_ControlValue.broadcasterDocumentTypeControl;
       bc_onboardRequest.broadcast_kyc_doc_value=b_ControlValue.broadcasterDocumenttextControl;
       bc_onboardRequest.server_pu_dns_name=b_ControlValue.broadcasterPubDNSControl;
       bc_onboardRequest.server_pr_dns_name=b_ControlValue.broadcasterPrivateDNSControl;
       bc_onboardRequest.w_application_name=this.populateApplicationName(bc_onboardRequest.state_code,bc_onboardRequest.broadcaster_channel_name);
       bc_onboardRequest.rank=b_ControlValue.broadcasterRankControl;
       bc_onboardRequest.is_active=b_ControlValue.broadcasterStatusControl;
       bc_onboardRequest.broadcaster_image=bc_onboardRequest.broadcaster_channel_name;
       bc_onboardRequest.seller_id=5000217;// Haappyapp broadecaster id 
       
        var bc=new BroadcasterChannel();
        bc.application_id=this.user.user_app_id;
        bc.broadcaster_id=0;
        bc.lang_id=b_ControlValue.broadcasterLanguageControl;
        bc.category_id=bc_onboardRequest.category_id;
        bc.channel_name=bc_onboardRequest.broadcaster_channel_name;
        bc.yt_streamtarget_name="";
        bc.fb_streamtarget_name="";
        bc.ha_streamtarget_name="";
        bc.channel_image="";
        bc.image_file_name="";
        bc.rank=0;
        bc.is_hd=false;
        bc.ha_is_active=true;
        bc.ha_rank=0;
        bc.deprecated=false;
        bc.is_active=true;
        bc.created_by=this.user.user_name;
        bc.updated_by=this.user.user_name;
       bc_onboardRequest.broadcaster_channels=bc

       var bv=new BroadcasterVideos();
       bv.broadcaster_channel_id=0;
       bv.video_name=bc_onboardRequest.broadcaster_channel_name;
       bv.rank=0;
       bv.video_thumbnail="https://d3c243y8mg3na8.cloudfront.net/ProductImages/s5000170/livetv.png";
       bv.video_description=bv.video_name;
       var category=this.channelCategories.filter(ct=>ct.id.toString() === bc.category_id.toString())
       var streamName=bc_onboardRequest.broadcaster_channel_name +"-"+ (category.length>0?category[0].category_name:"");
       bv.url=this.populateVideoURLName(bc_onboardRequest.w_application_name.toLowerCase(),streamName.toLowerCase());
       bv.is_active=true;
       bv.language_id=b_ControlValue.broadcasterLanguageControl;
       bv.is_live=true;
       bv.is_youtube=false;
       bv.duration=0;
       bv.is_primary=true;
       bv.live_ads=false;
       bv.p160=false;
       bv.p360=false;
       bv.p720=false;
       bv.p720=false;
       bv.p1080=false;
       bv.p_uhd=false;
       bv.yt_streamkey="";
       bv.fb_streamkey="";
       bv.ha_streamkey="";
       bv.created_by=this.user.user_name;
       bv.updated_by=this.user.user_name;
       bc_onboardRequest.broadcaster_videos=bv;

       this.broadcasterService.createBroadcasterOnboardFlow(bc_onboardRequest)
      .subscribe(
      response => {
            location.reload();
      }),
      error => this.errorMessage = <any>error;
    }

    hasReload(response) {
        if (response) {
            location.reload();
        }
    }

}

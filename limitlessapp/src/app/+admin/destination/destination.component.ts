import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Language } from '../../../shared/models/language';
import { CommonService } from '../../shared/server/service/common.service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { ChannelVideoKeyRequest } from "../../shared/models/channelVideoKeyRequest";
import { BroadcasterDestination } from "../../shared/models/broadcaster-destination";
import { CreateResponse } from "../../shared/models/createResponse";
import { Destination } from './destination';
import { NotificationService } from "../../shared/utils/notification.service";


@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  providers: [BroadcasterService, CommonService]
})
export class DestinationComponent implements OnInit {
  // broadcasterChannelname: string;
  id: number;
  destination: string;
  // broadcasterChannelId: number;
  createResponse: CreateResponse;
  destinationForm;
  broadcasters: Broadcasters[];
  broadcasterChannels: BroadcasterChannel[];
  superAdminUser: boolean;
  broadcasterUser: boolean;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasterDestination:BroadcasterDestination;
  public dest:string[];
  public destinationId:number;
  public destinationname:string;
  public broadcasterchannel:string[];
  public broadcasterChannelId: number;
  public broadcasterChannelname:string;


  public Destination:Destination = new Destination(2, 'YouTube');
  destinations = [
     new Destination(1, 'FaceBook' ),
     new Destination(2, 'YouTube' ),
     new Destination(3, 'Haappyapp' ),
     new Destination(4, 'Periscope'),
     new Destination(5, 'FaceBook-Page1' ),
     new Destination(6, 'FaceBook-Page2' ),
     new Destination(7, 'FaceBook-Page3' ),
     new Destination(8, 'FaceBook-Page4' ),
     new Destination(9, 'FaceBook-Page5' )
  ];
  

  public selectedDestination: Destination = this.destinations[0];

  constructor(private broadcasterService: BroadcasterService,private notificationService: NotificationService,
    private cookieService: CookieService, private fb: FormBuilder, private commonService: CommonService) {
    this.superAdminUser = false;
    this.broadcasterUser = false;
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    if (this.loginResponse.user_type === 'Entertainment') {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.broadcasterUser = true;
      this.superAdminUser = false;
    } else if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
      this.broadcasterUser = false;
    }
    this.broadcasters = new Array();
    this.broadcasterDestination = new BroadcasterDestination();
    // this.destinationId=0;
    
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    } else if (this.broadcasterUser) {
      this.getBroadcasterChannels(this.loginResponse.client_id);
    }
  }

 

  initForm() {
    this.destinationForm = this.fb.group({
      userActiveStatus: new FormControl(""),
      // userbroadcasterDestination: new FormControl(""),
      });
  }


  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        console.log(error);
      }
    );
  }

  getBroadcasterChannels(broadcasterId: number) {
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      broadcasterChannels => {
        this.broadcasterChannels = broadcasterChannels;
        console.log(this.broadcasterChannels);
      },
      error => {
        console.log(error);
      }
    );
  }
  onChannelSelect(broadcasterChannelId:string){
    // this.broadcasterChannelId = broadcasterChannelId;
    // console.log(this.broadcasterChannelId);
    this.broadcasterchannel=broadcasterChannelId.split(",");
    this.broadcasterChannelId=parseInt(this.broadcasterchannel[0]);
    this.broadcasterChannelname= this.broadcasterchannel[1];
  }

  onDestinationIdSelect(destination:string) { 
  
   this.dest=destination.split(",");
  this.destinationId=parseInt(this.dest[0]);
  this.destinationname= this.dest[1];
    // console.log(dest[0]);
    // console.log(dest[1]);

  }

  createbroadcasterdestination()
  {
    const destination = this.destinationForm.value;
    this.broadcasterDestination.broadcaster_channel_id = this.broadcasterChannelId;
    this.broadcasterDestination.d_id = this.destinationId;
    this.broadcasterDestination.destination_name = this.destinationname ;
    this.broadcasterDestination.description = this.destinationname;
    this.broadcasterDestination.is_active = true;
    this.broadcasterService.createBroadcasterDestination(this.broadcasterDestination).subscribe(
        createResponse => {
          console.log('output'+createResponse);
            // alert("destination created");
            window.location.reload();
            },
            error => 
            {
              // alert("Something went wrong!");
              this.notificationService.smartMessageBox({
                title:"Already Exists",
                content:"Destination already exists for this channel",
                buttons:'[Ok]'
              },(ButtonPressed)=>{
                console.log('destination already exists');
              }
            );
            }
       ); 

  }
  

}

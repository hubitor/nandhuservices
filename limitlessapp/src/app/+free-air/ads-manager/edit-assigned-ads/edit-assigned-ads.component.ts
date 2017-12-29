import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie';
import { LoginResponse } from '../../../shared/models/loginResponse';
import { BroadcasterService } from '../../../shared/server/service/broadcaster-service';
import { BroadcasterChannel } from '../../../shared/models/broadcaster-channel';
import { LogoAds } from '../../../shared/models/logo-ads';
import { AdsService } from '../../../shared/server/service/ads.service';
import { AdEvent } from '../../../shared/models/ad-event';
import { AssignLogoAds } from 'app/shared/models/assign-logo-ads';

@Component({
  selector: 'app-edit-assigned-ads',
  templateUrl: './edit-assigned-ads.component.html',
  providers: [BroadcasterService, AdsService]
})
export class EditAssignedAdsComponent implements OnInit {
  editAssignedAdsForm;
  editDetailsForm;
  loginResponse: LoginResponse;
  broadcasterId: number;
  broadcasterChannels: BroadcasterChannel[];
  adEvents: AdEvent[];
  adEvent: AdEvent;
  channelId: number;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private broadacasterSevice: BroadcasterService, private adsService: AdsService) { 
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get('HAU'));
    this.broadcasterId = parseInt(localStorage.getItem('broadcaster_id'));
    this.adEvents = new Array();
    this.adEvent = new AdEvent();
  }

  ngOnInit() {
    this.initForm();
    this.getBroadcasterChannels();
  }

  initForm() {
    this.editAssignedAdsForm = this.fb.group({
      selectedEventDate: [null, [Validators.required]]
    });
    this.editDetailsForm = this.fb.group({
      eventName: [null, [Validators.required]],
      eventDate: [null, [Validators.required]],
      eventDuration: [null, [Validators.required]],
      eventStartTime: [null, [Validators.required]],
      eventEndTime: [null, [Validators.required]],
      adWindow: [null, [Validators.required]]
    }); 
  }

  onChannelSelect(channelId: number) {
    this.channelId = channelId;
  }

  getBroadcasterChannels() {
    this.broadacasterSevice.getChannelsByBroadcasterId(this.broadcasterId).subscribe(
      channels => {
        this.broadcasterChannels = channels;
      },
      error => {
        console.log(error);
        alert('something went wrong');
      }
    );
  }

  // getEvents() {
  //   const getAssignedAds = this.editAssignedAdsForm.value;
  //   console.log(getAssignedAds.selectedEventDate);
  //   this.adsService.getAssignedEventsByDate(this.channelId, getAssignedAds.selectedEventDate).subscribe(
  //     adEvents => {
  //       this.adEvents = adEvents;
  //     },
  //     error => {
  //       console.log(error);
  //       alert('something went wrong');
  //     }
  //   );
  // }

}

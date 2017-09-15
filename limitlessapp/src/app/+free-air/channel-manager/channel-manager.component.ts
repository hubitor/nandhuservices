import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { User } from '../../shared/models/userModel';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CookieService } from 'ngx-cookie';
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { BroadcasterChannelsService } from '../../shared/server/service/broadcaster-channels.service';
import { ChannelCategory } from '../../shared/models/channelCategory';
import { CommonService } from '../../shared/server/service/common.service';
import { Language } from '../../shared/models/language';

@Component({
  selector: 'app-channel-manager',
  templateUrl: './channel-manager.component.html',
  providers: [BroadcasterChannelsService, BroadcasterService, CommonService]
})
export class ChannelManagerComponent implements OnInit {
  newChannelForm;
  broadcasters: Broadcasters[];
  broadcasterChannel: BroadcasterChannel;
  loginResponse: LoginResponse;
  superAdminUser: boolean;
  channelCategories: ChannelCategory[];
  languages: Language[];
  broadcasterId: number;
  categoryId: number;
  languageId: number;
  isHD: boolean;

  constructor(private broadcasterService: BroadcasterService,
    private broadcasterChannelsService: BroadcasterChannelsService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private commonService: CommonService) {
    this.broadcasterChannel = new BroadcasterChannel();
    this.loginResponse = new LoginResponse();
    this.superAdminUser = false;
    this.loginResponse = JSON.parse(localStorage.getItem("haappyapp-user"));
    if (this.loginResponse.user_type === 'Entertainment') {
      this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
      this.superAdminUser = false;
    } else if (this.loginResponse.user_type === 'Super Admin') {
      this.superAdminUser = true;
    }
    this.isHD = false;
  }

  ngOnInit() {
    this.initForm();
    if (this.superAdminUser) {
      this.getAllBroadcasters();
    }
    this.getAllBroadcastersCategories();
    this.getAllLanguages();
  }

  initForm() {
    this.newChannelForm = this.fb.group({
      channel_name: [null, [Validators.required]],
      channel_description: [null, [Validators.required]]
    });
  }

  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        alert('Broadcasters not loaded');
      }
    );
  }

  getAllBroadcastersCategories() {
    this.broadcasterService.getAllChannelCategory().subscribe(
      channelCategories => {
        this.channelCategories = channelCategories;
        console.log(this.channelCategories);
      },
      error => {
        alert("Categories not loaded");
      }
    );
  }

  getAllLanguages() {
    this.commonService.getAllLanguages().subscribe(
      languages => {
        this.languages = languages;
        console.log(this.languages);
      },
      error => {
        alert('Languages not loaded');
      }
    );
  }

  onBroadcasterSelect(broadcasterId: number){
    this.broadcasterId = broadcasterId;
  }

  onCategorySelect(categoryId: number){
    this.categoryId = categoryId;
  }

  onLanguageSelect(languageId: number){
    this.languageId = languageId;
  }

  onHDSelect(isHD: boolean){
    this.isHD = isHD;
  }

  createNewChannel(){
    const newChannel = this.newChannelForm.value;
    this.broadcasterChannel.application_id = 3;
    this.broadcasterChannel.broadcaster_id = this.broadcasterId;
    this.broadcasterChannel.category_id = this.categoryId;
    this.broadcasterChannel.lang_id = this.languageId;
    this.broadcasterChannel.channel_name = newChannel.channel_name;
    this.broadcasterChannel.channel_description = newChannel.channel_description;
    this.broadcasterChannel.created_by = "SA";
    this.broadcasterChannel.deprecated = false;
    this.broadcasterChannel.fb_streamtarget_name = "";
    this.broadcasterChannel.ha_channel_image = "";
    this.broadcasterChannel.ha_is_active = true;
    this.broadcasterChannel.ha_rank = 1;
    this.broadcasterChannel.ha_streamtarget_name = "";
    this.broadcasterChannel.image_file_name = "";
    this.broadcasterChannel.is_active = true;
    this.broadcasterChannel.is_hd = this.isHD;
    this.broadcasterChannel.updated_by = "SA";
    this.broadcasterChannel.yt_streamtarget_name = "";
    console.log(this.broadcasterChannel);
    this.broadcasterChannelsService.createNewChannel(this.broadcasterChannel).subscribe(
      newChannelResponse => {
        console.log(newChannelResponse);
      },
      error => {
        console.log(error);
      }
    );
  }

}

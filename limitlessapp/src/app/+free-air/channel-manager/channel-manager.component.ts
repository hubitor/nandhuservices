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
import { NotificationService } from "../../shared/utils/notification.service";
import { LOCATION_INITIALIZED } from '@angular/common';

@Component({
  selector: 'app-channel-manager',
  templateUrl: './channel-manager.component.html',
  providers: [BroadcasterChannelsService, BroadcasterService, CommonService]
})
export class ChannelManagerComponent implements OnInit {
  errorMessage: string;
  channels: BroadcasterChannel;
  newChannelForm;
  broadcasters: Broadcasters[];
  broadcasterChannel: BroadcasterChannel;
  broadcasterChannels: BroadcasterChannel;
  loginResponse: LoginResponse;
  superAdminUser: boolean;
  channelCategories: ChannelCategory[];
  languages: Language[];
  broadcasterId: number;
  categoryId: number;
  languageId: number;
  isHD: boolean;
  status: boolean;
  visible = false;
  broadcaster: Broadcasters;
  channelId: number;
  updateButton: boolean;
  createButton: boolean;
  channelDescription: string;

  cancel() {
    this.visible = false;
  }

  hideChannelCreate() {
    this.newChannelForm = this.fb.group({
      broadcaster_id: null,
      category_id: null,
      language_id: null,
      channel_name: null,
      channel_description: null,
      is_hd: null,
      status: null
    });
    this.visible = true;
    this.createButton = true;
    this.updateButton = false;
  }

  hidechannelUpdate() {
    this.visible = true;
    this.createButton = false;
    this.updateButton = true;
  }


  constructor(private broadcasterService: BroadcasterService,
    private broadcasterChannelsService: BroadcasterChannelsService,
    private cookieService: CookieService,
    private fb: FormBuilder, private notificationService: NotificationService,
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
      this.getBroadcasterAllGrid();
    }
    this.getAllBroadcastersCategories();
    this.getAllLanguages();
  }

  getBroadcasterAllGrid() {
    this.broadcasterService.getAllBroadcasterChannel()
      .subscribe(
      (channelResponse) => {
        this.channels = channelResponse;
        console.log(this.channels);
      }),
      error => this.errorMessage = <any>error;
  };

  initForm() {
    this.newChannelForm = this.fb.group({
      channel_name: [null, [Validators.required]],
      channel_description: [null, [Validators.required]],
      category_name: [null, [Validators.required]],
      lang_name: [null, [Validators.required]],
      broadcaster_id: [null, [Validators.required]],
      is_hd: [null, [Validators.required]],
      status: [null, [Validators.required]],
      category_id: [null, [Validators.required]],
      language_id: [null, [Validators.required]]
    });
  }

  getAllBroadcasters() {
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
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
      },
      error => {
        alert('Languages not loaded');
      }
    );
  }

  onBroadcasterSelect(broadcasterId: number) {
    this.broadcasterId = broadcasterId;
  }

  onCategorySelect(categoryId: number) {
    this.categoryId = categoryId;
  }

  onLanguageSelect(languageId: number) {
    this.languageId = languageId;
  }

  onHDSelect(isHD: boolean) {
    this.isHD = isHD;
  }

  onStatusSelect(status: boolean) {
    this.status = status;
  }

  getChannelRecord(channel_emit_data: any) {
    let dataObj = JSON.parse(channel_emit_data);
    localStorage.removeItem('channel_emit_data');
    this.newChannelForm = this.fb.group({
      broadcaster_id: [dataObj.broadcaster_id],
      category_id: [dataObj.category_id],
      language_id: [dataObj.lang_id],
      channel_name: [dataObj.channel_name],
      channel_description: [dataObj.channel_description],
      is_hd: [dataObj.is_hd],
      status: [dataObj.is_active]
    });
  }

  createNewChannel() {
    this.createButton = true;
    this.updateButton = false;
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
    this.broadcasterChannel.rank = 1;
    this.broadcasterChannel.ha_streamtarget_name = "";
    this.broadcasterChannel.image_file_name = "";
    this.broadcasterChannel.is_active = this.status;
    this.broadcasterChannel.is_hd = this.isHD;
    this.broadcasterChannel.updated_by = "SA";
    this.broadcasterChannel.yt_streamtarget_name = "";
    this.notificationService.smartMessageBox(
      {
        title: "Create Channel",
        content: "Do you want to create a new channel?<i  style='color:green'></i>",
        buttons: '[No][Yes]'
      }, (ButtonPressed) => {
        if (ButtonPressed == "Yes") {
          this.broadcasterChannelsService.createNewChannel(this.broadcasterChannel).subscribe(
            newChannelResponse => {
              location.reload();
            },
            error => {
              console.log("error");
            }
          );
        }
        else if (ButtonPressed == "No") {
        }
      });
  }

  updateChannel() {
    this.createButton = false;
    this.updateButton = true;
    const updateChannel = this.newChannelForm.value;
    this.broadcasterChannel.id = this.channelId;
    this.broadcasterChannel.broadcaster_id = this.broadcasterId;
    this.broadcasterChannel.channel_name = updateChannel.channel_name;
    this.broadcasterChannel.is_hd = this.isHD;
    this.broadcasterChannel.channel_description = updateChannel.channel_description;
    this.broadcasterChannel.lang_id = this.languageId;
    this.broadcasterChannel.category_id = this.categoryId;
    this.broadcasterChannel.is_active = this.status;
    this.broadcasterChannel.created_by = "SA";
    this.broadcasterChannel.updated_by = "SA";
    this.notificationService.smartMessageBox(
      {
        title: "Update Channel",
        content: "Do you want to update channel details..?<i  style='color:green'></i>",
        buttons: '[No][Yes]'
      }, (ButtonPressed) => {
        if (ButtonPressed == "Yes") {
          this.broadcasterChannelsService.updateChannelManager(this.broadcasterChannel).subscribe(
            createResponse => {
              location.reload();
            },
            error => {
              console.log('error in ' + error);
            }
          );
        }
        else if (ButtonPressed == "No") {
        }
      });
  }
}

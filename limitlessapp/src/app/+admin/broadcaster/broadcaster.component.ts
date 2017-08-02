import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { BroadcasterService } from "../../shared/server/service/broadcaster-service"
import { Observable } from 'rxjs/Observable';
import { Broadcasters } from "../../shared/models/broadcasters"
import { CreateResponse } from "../../shared/models/createResponse";
import { LoginResponse } from "../../shared/models/loginResponse";
import 'rxjs/add/observable/of';
import { NotificationService } from "../../shared/utils/notification.service";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-broadcaster',
    templateUrl: './broadcaster.component.html',
    providers: [BroadcasterService, DatePipe]
})
export class BroadcasterComponent implements OnInit {
    user: LoginResponse;
    broadcasterForm: FormGroup;
    errorMessage: string;
    appid: number;
    client_id: number;
    broadcasters: Broadcasters;
    createResponse: CreateResponse;
    mode: 'Observable';
    constructor(private broadcasterService: BroadcasterService
        , private fb: FormBuilder
        , private notificationService: NotificationService
        , private datePipe: DatePipe) {
        this.user = JSON.parse(localStorage.getItem('haappyapp-user'));
        this.createForm();
    }

    createForm() {
        this.broadcasterForm = this.fb.group({
            broadcasterNamecontrol: [null, Validators.required],
            broadcasterDescriptionControl: [null],
            broadcasterPrimaryChannelControl: [null, Validators.required],
            broadcasterEmailControl: [null, Validators.required],
            broadcasterWebsiteControl: [null],
            broadcasterTagControl: [null],
            broadcasterLatitudeControl:["0.000000",Validators.required],
            broadcasterLongtitudeControl:["0.000000",Validators.required],
            broadcasterDocumentTypeControl:[null],
            broadcasterDocumenttextControl:[null],
            broadcasterPubDNSControl:[null],
            broadcasterPrivateDNSControl:[null],
            broadcasterWApplicationControl:[null,Validators.required],
            broadcasterStatusControl:[null]

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



    hasReload(response) {
        if (response) {
            location.reload();
        }
    }

}

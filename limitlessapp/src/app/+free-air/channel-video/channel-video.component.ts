import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@FadeInTop()
@Component({
  selector: 'app-channel-video',
  templateUrl: './channel-video.component.html',
})
export class ChannelVideoComponent implements OnInit {
  channelHomeForm:FormGroup;

  constructor( private fb: FormBuilder) {

    this.channelHomeForm=this.fb.group({
    });
   }

  ngOnInit() {
  }

}

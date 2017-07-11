import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-channel-video',
  templateUrl: './channel-video.component.html',
})
export class ChannelVideoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

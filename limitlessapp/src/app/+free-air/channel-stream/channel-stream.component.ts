import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-channel-stream',
  templateUrl: './channel-stream.component.html',
})
export class ChannelStreamComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

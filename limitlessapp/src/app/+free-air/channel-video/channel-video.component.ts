import { Component, OnInit } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BroadcasterChannel } from '../../shared/models/broadcaster-channel';
import { BroadcasterVideos } from '../../shared/models/broadcasterVideos';
import { BroadcasterChannelsService } from '../../shared/server/service/broadcaster-channels.service';
import { LoginResponse } from '../../shared/models/loginResponse';
import { CookieService } from "ngx-cookie";
import { BroadcasterService } from '../../shared/server/service/broadcaster-service';
import { Broadcasters } from '../../shared/models/broadcasters';

@FadeInTop()
@Component({
  selector: 'app-channel-video',
  templateUrl: './channel-video.component.html',
  providers: [BroadcasterChannelsService, BroadcasterService]
})
export class ChannelVideoComponent implements OnInit {
  channelHomeForm: FormGroup;
  // array of video elements
  public videos = ['http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8'];
  public videoslve = 'http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8';
  public videopre = ['https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
    , 'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
  ];
  public subject = "Outrageous Things You'll Only See In Dubai 235";
  public displayDuration = "01:53";
  broadcasterChannel: BroadcasterChannel;
  channelsList: BroadcasterChannel[];
  primaryChannelId: number;
  loginResponse: LoginResponse;
  entertainmentUser: boolean;
  superAdminUser: boolean;
  broadcasters: Broadcasters[];
  broadcasterId: number;

  constructor(private fb: FormBuilder, private channelServices: BroadcasterChannelsService,
          private cookieService: CookieService, private broadcasterService: BroadcasterService) {
    this.entertainmentUser = false;
    this.superAdminUser = false;
    this.broadcasterChannel = new BroadcasterChannel();
    this.primaryChannelId = parseInt(localStorage.getItem("primary_channel_id"));
    this.channelHomeForm = this.fb.group({
    });
    this.loginResponse = new LoginResponse();
    this.loginResponse = JSON.parse(this.cookieService.get("HAU"));
    this.broadcasterId = parseInt(localStorage.getItem("broadcaster_id"));
    console.log(this.loginResponse);
    if(this.loginResponse.user_type === 'Entertainment'){
      this.entertainmentUser = true;
      this.superAdminUser = false;
    } else if(this.loginResponse.user_type === 'Super Admin'){
      this.entertainmentUser = false;
      this.superAdminUser = true;
    }
  }

  ngOnInit() {
    if(this.superAdminUser){
      this.getAllBroadcaster();
    } else if(this.entertainmentUser){
      this.getBroadcasterPrimaryChannelVideos(this.broadcasterId);
      this.getAllChannels(this.broadcasterId);
    }
  }

  getBroadcasterPrimaryChannelVideos(broadcasterId: number){
    this.getAllChannels(broadcasterId);
    this.channelServices.getPrimaryChannelVideos(broadcasterId).subscribe(
      broadcasterChannel => {
        this.broadcasterChannel = broadcasterChannel;
        console.log(this.broadcasterChannel);
      },
      error => {
        alert("Something went wrong. Primary channel not loaded");
      }
    );
  }

  getAllBroadcaster(){
    this.broadcasterService.getAllBroadcasters().subscribe(
      broadcasters => {
        this.broadcasters = broadcasters;
        console.log(this.broadcasters);
      },
      error => {
        alert("Something went wrong. Broadcaster list not loaded");
      }
    );
  }

  getAllChannels(broadcasterId: number){
    this.broadcasterService.getChannelsByBroadcasterId(broadcasterId).subscribe(
      channels => {
        this.channelsList = channels;
        console.log(this.channelsList);
      },
      error => {
        alert("Something went wrong. Channels list not loaded");
      }
    );
  }

}

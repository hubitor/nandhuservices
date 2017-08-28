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
  // array of video elements
  public videos = ['http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8'];
  public videoslve = 'http://live.haappyapp.com:1935/ka-praaja/prajaa-news/prajaa-news/playlist.m3u8';
  public videopre = ['https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                    ,'https://s3.ap-south-1.amazonaws.com/haappy-videos-asia/sangi_beauty_x264.mp4'
                   ];
  public subject="Outrageous Things You'll Only See In Dubai 235";
  public displayDuration="01:53";
  constructor( private fb: FormBuilder) {

    this.channelHomeForm=this.fb.group({
    });
   }

  ngOnInit() {
  }

}

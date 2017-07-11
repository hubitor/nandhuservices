import { Component, OnInit } from '@angular/core';
import { ChannelAlbum } from "../channel-album/channel-album";
import { ChannelAlbumService } from '../channel-album/channel-album.service'
@Component({
  selector: 'llc-album',
  templateUrl: './channel-album.component.html',
   providers: [ChannelAlbumService]
})
export class ChannelAlbumComponent implements OnInit {
  errorMessage: string;
  channelalbums: ChannelAlbum[];
  mode = 'Observable';
  constructor(private channelAlbumService: ChannelAlbumService) { }
  
  ngOnInit() {
    console.log('intialize channel album');
     this.getAlbums();
  }
getAlbums() {
    console.log('getalbums is called');
    this.channelAlbumService.getAlbums()
                     .subscribe(
                       channelalbums => this.channelalbums = channelalbums,
                       error =>  this.errorMessage = <any>error);
  }

}
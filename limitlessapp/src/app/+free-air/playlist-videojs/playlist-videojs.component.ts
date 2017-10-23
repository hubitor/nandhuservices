import { Component,OnInit } from '@angular/core';
import { videojs } from 'video.js';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import 'videojs-playlist';

@Component({
    selector: 'app-playlist-videojs',
    templateUrl: './playlist-videojs.component.html',
    providers: []
})
export class PlaylistVideojsComponent implements OnInit
{
    videojsForm: FormGroup;
     public videos:any[]=[]; 
     public isFirstEl:boolean=false;
     public isLastEl:boolean=false;
     public video:any={ 'src': 'https://vjs.zencdn.net/v/oceans.mp4',
    'type': 'video/mp4'

     }
     public test:string[]=['v1','v2','v3','v4']
    constructor(private fb: FormBuilder, )
    {

    }

    ngOnInit() {
        this.initForm();
        console.log(JSON.stringify(this.video)+"*******video.src::"+this.video.src);
        this.playlist();
        
    }
    initForm(){
        this.videojsForm = this.fb.group({
        });
    }

    
    playlist(){
    // var player =videojs('video', { preload: true, techOrder: ["youtube", "html5"], controls: true , "continuous": true, "setTrack": 4});
    let playlist = [
    {
      'src': 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      'type': 'video/mp4'
    
  }, 
   
    {
      'src': 'http://media.w3.org/2010/05/bunny/trailer.mp4',
      'type': 'video/mp4'
   
  }, 
    {
      'src': 'https://vjs.zencdn.net/v/oceans.mp4',
      'type': 'video/mp4'
   
  },
    {
      'src': 'http://media.w3.org/2010/05/bunny/movie.mp4',
      'type': 'video/mp4'
  
  }, {
    
      'src': 'http://media.w3.org/2010/05/video/movie_300.mp4',
      'type': 'video/mp4'
    }
  ];
 
  this.videos=playlist;
  //  player.playlist({ videos:playlist, playlist: { hideSidebar: false, upNext: true, hideIcons: false, items: 5 } });
  console.log("*************length"+this.videos.length);
  // player.playlist.autoadvance(0);
 




}
  previous(video:any){
    console.log("inside previous method"+JSON.stringify(video));
    let length=this.videos.length;
    this.isLastEl=false;

    var indexOfStevie =this.videos.findIndex(i => i.src === video.src);
    console.log("indexOfStevie*********"+indexOfStevie)
    if(indexOfStevie!=0){
      console.log("not equals to 0");
     
      this.video=this.videos[indexOfStevie-1];
    }else{
      console.log(" equals to 0")
      this.isFirstEl=true;
      //this.video=this.videos[length-1];
      
    }  
    
  }

  next(video:any){
    console.log("inside next method"+JSON.stringify(video));
    let length=this.videos.length;
    this.isFirstEl=false;

    var indexOfStevie =this.videos.findIndex(i => i.src === video.src);
    console.log("indexOfStevie*********"+indexOfStevie)
    if(indexOfStevie!=(length-1)){
      console.log("not equals to "+(length-1));
     
      this.video=this.videos[indexOfStevie+1];
    }else{
      console.log(" equals to "+(length-1))
      this.isLastEl=true;
      //this.video=this.videos[length-1];
      
    }  
  }
}
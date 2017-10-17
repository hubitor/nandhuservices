import { Component,OnInit } from '@angular/core';
import { Videojs } from 'video.js';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-playlist-videojs',
    templateUrl: './playlist-videojs.component.html',
    providers: []
})
export class PlaylistVideojsComponent 
{
    videojsForm: FormGroup;
    

    constructor(private fb: FormBuilder, )
    {

    }

    ngOnInit() {
        this.initForm();
        this.playlist();
    }
    initForm(){
        this.videojsForm = this.fb.group({
        });
    }
    playlist(){

    var player = Videojs('video');
    
    player.playlist
   (
       [
           {
                sources: [{
                        src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
                        type: 'video/mp4'
                        }],
                poster: 'http://media.w3.org/2010/05/sintel/poster.png'
            }, 
            {
                sources: [{
                         src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
                         type: 'video/mp4'
                        }],
                poster: 'http://media.w3.org/2010/05/bunny/poster.png'
            }, 
            {
                sources: [{
                          src: 'http://vjs.zencdn.net/v/oceans.mp4',
                          type: 'video/mp4'
                          }],
                poster: 'http://www.videojs.com/img/poster.jpg'
            },
            {
                sources: [{
                         src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
                         type: 'video/mp4'
                         }],
                poster: 'http://media.w3.org/2010/05/bunny/poster.png'
            },
            {
                sources: [{
                         src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
                         type: 'video/mp4'
                         }],
                poster: 'http://media.w3.org/2010/05/video/poster.png'
            }
        ]
    );
    player.playlist.autoadvance(0);
    }

}
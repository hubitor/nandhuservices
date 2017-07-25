import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FadeZoomInTop} from "../../animations/fade-zoom-in-top.decorator";

@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent implements OnInit {
  user:string;
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = localStorage.getItem('haappyapp-user');
    //console.log(this.user);
    if(this.user===null){
      this.router.navigate(['/auth/login']);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie';
import { FadeZoomInTop } from "../../animations/fade-zoom-in-top.decorator";

@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent implements OnInit {
  user: string;
  
  constructor(private router: Router, private cookieServices: CookieService) {
    this.user = this.cookieServices.get("HAU");
    if (this.user === undefined) {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit() {

  }

}

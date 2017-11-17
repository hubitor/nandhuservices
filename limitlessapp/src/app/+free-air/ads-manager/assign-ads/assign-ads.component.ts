import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-ads',
  templateUrl: './assign-ads.component.html'
})
export class AssignAdsComponent implements OnInit {
  targetPlatforms: string[] = ['Youtube', 'Facebook', 'Twitter'];
  selectedDestination: string;
  adPlacement: string[] = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
  broadcastingTypes: string[] = ['Short Events', '24/7', 'VoD'];

  constructor() { }

  ngOnInit() {
  }

}

import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VideoLiveComponent} from "./videolive.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [VideoLiveComponent],
  exports: [VideoLiveComponent],
})
export class VideoLiveModule {}
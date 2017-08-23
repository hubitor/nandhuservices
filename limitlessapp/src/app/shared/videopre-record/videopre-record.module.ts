import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VideoPrerecordComponent} from "./videopre-record.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [VideoPrerecordComponent],
  exports: [VideoPrerecordComponent],
})
export class VideoPrerecordModule {}
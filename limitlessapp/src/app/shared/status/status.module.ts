import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DropdownStatusComponent} from "./status.component";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule,ReactiveFormsModule],
  declarations: [DropdownStatusComponent],
  exports: [DropdownStatusComponent],
})
export class StatusModule {}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApplicationService } from '../../shared/server/service/application-service';
import { Application } from '../../shared/models/application';
import { User } from '../../shared/models/userModel';

@Component({
  selector: 'app-channelhome',
  templateUrl: './channel-home.component.html',
  providers: [ApplicationService]
})
export class ChannelHomeComponent implements OnInit {
  channelHomeForm;
  userTypes=['eCommerce', 'Entertainment'];
  application: Application;
  applications: Application[];
  applicationId: number;
  userType: string;
  user: User;

  constructor(private fb: FormBuilder, private applicationService: ApplicationService) { 
    this.application = new Application();
    this.user = new User();
  }

  ngOnInit() {
   
    this.initForm();
  }

  initForm(){
    this.channelHomeForm = this.fb.group({
      playbackURL: [null, [Validators.required]]
    
    });
  }
}

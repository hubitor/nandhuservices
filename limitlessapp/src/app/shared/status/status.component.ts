import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { DropdownService } from "../../shared/server/service/dropdown-service"
import { Observable } from 'rxjs/Observable';
import { IsStatus } from "../../shared/models/isStatus"
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
@Component({
    selector: 'sa-status',
    templateUrl: './status.component.html',
    providers: [DropdownService]

})
export class DropdownStatusComponent implements OnInit {
    public ddlstatusForm: FormGroup;
     @Output() statusUpdated = new EventEmitter<boolean>();

    errorMessage: string;
    appid: number;
    status: IsStatus[];
    isStatus:IsStatus;
    mode = 'Observable';
    constructor(private dropdownService: DropdownService, private _fb: FormBuilder) {
        this.status = [];
         
    }

    statusSelected(event)
    {
         this.statusUpdated.emit(!!event.target.value);
    }

    ngOnInit() {
        let statusFormGroup: FormGroup = new FormGroup({});
        // the short way
        this.ddlstatusForm = this._fb.group({
            status: [],
        });

       this.status=this.dropdownService.getStatus();
            

        this.ddlstatusForm.setValue({
            status: this.status || new IsStatus()
        });





    }


}
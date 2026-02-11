import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-status-edit',
  templateUrl: './sub-status-edit.component.html',
  styleUrls: ['./sub-status-edit.component.scss']
})
export class SubStatusEditComponent implements OnInit {
    Form: FormGroup;
    SubStatusId;
    submitted = false;
    subStatusList:any=[]
    public event: EventEmitter<any> = new EventEmitter();
  
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,) { }
    ngOnInit(): void {
      this.SubStatusId = this.data.SubStatusId
      this.Form = this.fb.group({
        RRId: this.data.RRId,
        SubStatusId: ['', Validators.required],
        AssigneeUserId:this.data.AssigneeUserId
      })
      console.log(this.SubStatusId)

      this.getSubStatusList()

      this.Form.patchValue({
        SubStatusId:this.SubStatusId
      })
  
     
      
    }
    //get CountriesAddForm validation control
    get FormControl() {
      return this.Form.controls;
    }
    getSubStatusList() {
      this.commonService.getHttpService('RRSubStatusDDl').subscribe(response => {
        this.subStatusList = response.responseData;
      });
    }
    
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  
    onSubmit() {
      this.submitted = true;
      if (this.Form.valid) {
        let body = { ...this.Form.value };
          this.commonService.postHttpService(body, "RRSubStatusEdit").subscribe((res: any) => {
            if (res.status == true) {
              this.triggerEvent(res.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'Record Updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            else {
  
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
     }

}

import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-edit-part-location',
  templateUrl: './rr-edit-part-location.component.html',
  styleUrls: ['./rr-edit-part-location.component.scss']
})
export class RrEditPartLocationComponent implements OnInit {



    Form: FormGroup;
    RRPartLocationId;
    submitted = false;
    RRPartLocationList:any=[]
    public event: EventEmitter<any> = new EventEmitter();
  
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,) { }
    ngOnInit(): void {
      this.RRPartLocationId = this.data.RRPartLocationId
      this.Form = this.fb.group({
        RRId: this.data.RRId,
        RRPartLocationId: ['', Validators.required],
      })

      this.getPartLocationList()

      this.Form.patchValue({
        RRPartLocationId:this.RRPartLocationId==0?'':this.RRPartLocationId
      })
  
     
      
    }
    //get CountriesAddForm validation control
    get FormControl() {
      return this.Form.controls;
    }
  
    getPartLocationList() {
      this.commonService.getHttpService('RRPartLocationDDl').subscribe(response => {
        if (response.status == true) {
          this.RRPartLocationList = response.responseData;
        } else { }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  
    onSubmit() {
      this.submitted = true;
      if (this.Form.valid) {
        let body = { ...this.Form.value };
     
          this.commonService.postHttpService(body, "RRPartLocationEdit").subscribe((res: any) => {
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

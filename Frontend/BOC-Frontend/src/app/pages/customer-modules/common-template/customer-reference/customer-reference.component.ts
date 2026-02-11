import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-customer-reference',
  templateUrl: './customer-reference.component.html',
  styleUrls: ['./customer-reference.component.scss']
})
export class CustomerReferenceComponent implements OnInit {
  IdentityId;
  submitted = false;
  model: any = [];
  responseMessage
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;





  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      var postData = {
        "IdentityId": this.IdentityId,
        "CReferenceList": [{
          "CReferenceName": this.model.CReferenceName,
        }]

      }
      this.commonService.postHttpService(postData, "getReferenceCreate").subscribe(response => {

        if (response.status == true) {

          this.triggerEvent(response.responseData.CReferenceList[0]);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Reference saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else (response.status == false)
        {
          this.responseMessage = response.message;
          Swal.fire({
            title: 'Error!',
            text: 'Reference could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

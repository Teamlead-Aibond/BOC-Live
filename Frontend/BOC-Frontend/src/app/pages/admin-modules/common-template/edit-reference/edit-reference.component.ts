import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-reference',
  templateUrl: './edit-reference.component.html',
  styleUrls: ['./edit-reference.component.scss']
})
export class EditReferenceComponent implements OnInit {


  submitted = false;
  model: any = [];
  index;
  result
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.index = this.data.i;
    this.result = this.data.ref
    this.model.ReferenceValue = this.result.ReferenceValue
  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      var postData = {
        "CustomerReference": {
          "RRReferenceId": this.result.RRReferenceId,
          "ReferenceValue": this.model.ReferenceValue,
          "ReferenceLabelName": this.result.ReferenceLabelName

        }

      }
      this.commonService.putHttpService(postData, "getReferencevalueUpdate").subscribe(response => {

        if (response.status == true) {

          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Reference updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Reference could not be updated!',
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

import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-rr-duplicate',
  templateUrl: './rr-duplicate.component.html',
  styleUrls: ['./rr-duplicate.component.scss']
})
export class RrDuplicateComponent implements OnInit {
  submitted = false;
  model: any = [];
  RRId;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;

  }


  onSubmit(f: NgForm) {
    this.submitted = true;
if(f.valid){
    var postData = {
          "RRId":this.RRId,
          "SerialNo":this.model.SerialNo
      }​​​​​​​​
    this.commonService.postHttpService(postData, "RRDuplicate").subscribe(response => {

      if (response.status == true) {

        this.triggerEvent(response.responseData);
        this.modalRef.hide();

        Swal.fire({
          title: 'Success!',
          text: 'Duplicate saved Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else
       {
        Swal.fire({
          title: 'Error!',
          text: 'Duplicate could not be saved!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  else{
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

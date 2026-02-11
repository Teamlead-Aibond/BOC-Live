import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss']
})
export class EditDepartmentComponent implements OnInit {


  DepartmentForm: FormGroup;
  submitted = false;
  IdentityId;
  result
  index
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result = this.data.depart;
    this.index = this.data.i
    this.DepartmentForm = this.fb.group({
      CustomerDepartmentId: ['', Validators.required],
      CustomerDepartmentName: ['', Validators.required],
      DepartmentContactName: ['', Validators.required],
      DepartmentContactEmail: ['', [Validators.required, Validators.email]],
      DepartmentContactPhone: ['', Validators.required],
    })


    this.DepartmentForm.setValue({
      CustomerDepartmentId: this.result.CustomerDepartmentId,
      CustomerDepartmentName: this.result.CustomerDepartmentName,
      DepartmentContactName: this.result.DepartmentContactName,
      DepartmentContactEmail: this.result.DepartmentContactEmail,
      DepartmentContactPhone: this.result.DepartmentContactPhone,
    })
  }



  onSubmit() {
    this.submitted = true;
    if (this.DepartmentForm.valid) {
      var postData = {
        CustomerDepartmentList: [this.DepartmentForm.value]
      }
      this.commonService.putHttpService(postData, "DepartmentEditCustomer").subscribe(response => {
        this.triggerEvent(response.responseData.CustomerDepartmentList[0]);
        this.modalRef.hide();
     
        if (response.status == true) {
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Department updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Department could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
      this.modalRef.hide();

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


  //get AddressForm validation control
  get DepartmentFormControl() {
    return this.DepartmentForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

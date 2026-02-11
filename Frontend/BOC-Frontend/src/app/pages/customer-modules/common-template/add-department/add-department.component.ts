import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {

  DepartmentForm: FormGroup;
  submitted = false;
  IdentityType;
  IdentityId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
  
    this.DepartmentForm = this.fb.group({
      CustomerDepartmentName: ['', Validators.required],
      DepartmentContactName: ['', Validators.required],
      DepartmentContactEmail: ['', [Validators.required, Validators.email]],
      DepartmentContactPhone: ['', Validators.required],
    })
  }


  onSubmit() {
    this.submitted = true;
    if (this.DepartmentForm.valid) {


      var postData = {
        CustomerDepartmentList: [this.DepartmentForm.value]
      }
      this.commonService.postHttpService(postData, "DepartmentAddCustomer").subscribe(response => {
        if (response.status == true) {

          this.triggerEvent(response.responseData.CustomerDepartmentList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Department saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Department could not be saved!',
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


  //get AddressForm validation control
  get DepartmentFormControl() {
    return this.DepartmentForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

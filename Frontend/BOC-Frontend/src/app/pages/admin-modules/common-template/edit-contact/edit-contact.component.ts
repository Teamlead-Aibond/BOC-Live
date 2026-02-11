import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  result;
  index;
  EditContactForm: FormGroup;
  submitted = false;
  IdentityType;
  IdentityId;
  primary;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result = this.data.item;
    this.index = this.data.i
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId
    this.EditContactForm = this.fb.group({
      ContactId: ['', Validators.required],
      IdentityType: this.IdentityType,
      ContactName: ['', Validators.required],
      DepartmentId: [''],
      Email: ['', [Validators.required, Validators.email]],
      Designation: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      IsPrimary: [''],
    })

    if (this.result.IsPrimary === 1) {
      this.primary = true;
    }
    else {
      this.primary = false;

    }
    this.EditContactForm.setValue({
      ContactId: this.result.ContactId,
      IdentityType: this.IdentityType,
      ContactName: this.result.ContactName,
      DepartmentId: this.result.DepartmentId,
      Email: this.result.Email,
      Designation: this.result.Designation,
      PhoneNo: this.result.PhoneNo,

      IsPrimary: this.primary,

    })
  }



  onSubmit() {
    this.submitted = true;
    if (this.EditContactForm.valid) {
      var postData = {
        IdentityId: this.IdentityId,
        ContactList: [this.EditContactForm.value]
      }
      this.commonService.putHttpService(postData, "getContactEdit").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.ContactList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Contact updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Contact could not be updated!',
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
  get ContactFormControl() {
    return this.EditContactForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

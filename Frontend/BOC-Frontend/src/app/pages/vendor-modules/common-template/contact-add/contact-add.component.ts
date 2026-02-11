import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss']
})
export class ContactAddComponent implements OnInit {

  ContactForm: FormGroup;
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
    this.ContactForm = this.fb.group({
      ContactName: ['', Validators.required],
      DepartmentId: [''],
      Email: ['', [Validators.required, Validators.email]],
      Designation: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      IsPrimary: [''],
    })
  }



  //get AddressForm validation control
  get ContactFormControl() {
    return this.ContactForm.controls;
  }



  onSubmit() {
    this.submitted = true;
    if (this.ContactForm.valid) {
      var postData = {
        ContactList: [this.ContactForm.value]
      }
      this.commonService.postHttpService(postData, "CreateContactVendor").subscribe(response => {

        if (response.status == true) {
          this.triggerEvent(response.responseData.ContactList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Contact saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Contact could not be saved!',
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

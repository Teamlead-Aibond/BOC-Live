/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { state } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { requestQuoteStatus } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-a-quote',
  templateUrl: './request-a-quote.component.html',
  styleUrls: ['./request-a-quote.component.scss']
})
export class RequestAQuoteComponent implements OnInit {

  Form: FormGroup;
  breadCrumbItems: Array<{}>;
  submitted = false;
  userType;
  requestQuoteId;
  requestQuotesStatus = requestQuoteStatus;
  constructor(private fb: FormBuilder, private cd_ref: ChangeDetectorRef,
    private commonService: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Request For Quotes', path: '/', active: true }];
    this.formGroup();
    if (localStorage.getItem('IdentityType') == '1') {
      this.userType = localStorage.getItem('IdentityType')
      this.Form.patchValue({
        ContactName: localStorage.getItem('UserName'),
        ContactEmail: localStorage.getItem('UserEmailId'),
      })
    } else {
      this.requestQuoteId = history.state.requestQuoteId
      this.viewRequestQuote()
    }
  }

  formGroup() {
    this.Form = this.fb.group({
      RequestQuoteId: [''],
      PartNo: ['', Validators.required],
      Manufacturer: ['', Validators.required],
      Priority: ['', Validators.required],
      ContactName: ['', Validators.required],
      ContactNumber: ['', Validators.required],
      ContactEmail: ['', [Validators.required, Validators.email]],
      ContactPlant: ['', Validators.required],
      CustomerId: localStorage.getItem("IdentityId"),
      RequestQuoteNo: ['', Validators.required],
      AdminComments: [''],
      Status: [''],
      Comments: ['']
    })
  }
  //get AddressForm validation control
  get FormControl() {
    return this.Form.controls;
  }
  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(',');
    const InventoryNotificationEmail = emails.some(email => Validators.email(new FormControl(email)));
    // console.log(InventoryNotificationEmail);
    return InventoryNotificationEmail ? { 'InventoryNotificationEmail': { value: control.value } } : null;
  };
  viewRequestQuote() {
    let postData = {
      RequestQuoteId: this.requestQuoteId
    }
    this.commonService.postHttpService(postData, 'viewRequestForQuote').subscribe(response => {
      if (response.status == true) {
        let result = response.responseData
        this.Form.patchValue({
          RequestQuoteId: result.RequestQuoteId,
          PartNo: result.PartNo,
          Manufacturer: result.Manufacturer,
          Priority: result.Priority ? (result.Priority).toString() : '',
          ContactName: result.ContactName,
          ContactNumber: result.ContactNumber,
          ContactEmail: result.ContactEmail,
          ContactPlant: result.ContactPlant,
          CustomerId: localStorage.getItem("IdentityId"),
          RequestQuoteNo: result.RequestQuoteNo,
          AdminComments: result.AdminComments,
          Status: (result.Status) == 0 ? '' : result.Status,
          Comments: result.Comments
        })
      }
      console.log(this.Form.value);

    })
  }
  onSubmit() {
    this.submitted = true
    console.log(this.Form);

    if (this.Form.valid) {
      let body = { ... this.Form.value }
      if (body.RequestQuoteId != '' && body.RequestQuoteId != undefined && body.RequestQuoteId != null) {
        this.commonService.putHttpService(body, "updateRequestForQuote").subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Success!',
              text: 'Record Saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/admin/shop/list-request-a-quote'])
              } else {
                this.router.navigate(['/admin/shop/list-request-a-quote'])

              }
            });

          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Record could not be Saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      } else {
        this.commonService.postHttpService(body, "createRequestForQuote").subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Success!',
              text: 'Thank you for your interest!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/admin/shop/product-list'])
              } else {
                this.router.navigate(['/admin/shop/product-list'])

              }
            });

          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Record could not be Saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
    }

  }
}

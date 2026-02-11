import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multi-currency',
  templateUrl: './multi-currency.component.html',
  styleUrls: ['./multi-currency.component.scss']
})
export class MultiCurrencyComponent implements OnInit {
  CurrencyId
  Form: FormGroup;
  submitted = false;
  editMode: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {

    this.CurrencyId = this.data.CurrencyId;

    this.Form = this.fb.group({
      CurrencyId: this.CurrencyId,
      CurrencyCode: ['', Validators.required],
      CurrencySymbol: ['', Validators.required],
      Status: ['', Validators.required],
    });

    if (this.CurrencyId) {
      this.editMode = true;
      var postData = {
        CurrencyId: this.CurrencyId
      }
      this.commonService.postHttpService(postData, 'ViewCurrency').subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData;
          this.Form.patchValue({
            CurrencyId: this.CurrencyId,
            CurrencyCode: result.CurrencyCode,
            CurrencySymbol: result.CurrencySymbol,
            Status: result.Status,
          })
        }
      })
    }
  }


  //get form validation control
  get FormControl() {
    return this.Form.controls;
  }
  closeModal() {
    this.modalRef.hide();
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      if (body.CurrencyId == '') {
        this.commonService.postHttpService(body, 'CreateCurrency').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Currency saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Currency could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (body.CurrencyId != '') {
        this.commonService.putHttpService(body, 'UpdateCurrency').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Currency Updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Currency could not be Updated!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }


    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

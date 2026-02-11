import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { EmployeeJobRole, Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responsibility',
  templateUrl: './responsibility.component.html',
  styleUrls: ['./responsibility.component.scss']
})
export class ResponsibilityComponent implements OnInit {

  Form: FormGroup
  submitted: boolean = false
  EmployeeResponsibilityId

  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef, public modalRef: BsModalRef,
    private commonService: CommonService, @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    this.EmployeeResponsibilityId = this.data.EmployeeResponsibilityId;
    this.Form = this.fb.group({
      EmployeeResponsibilityId: this.EmployeeResponsibilityId,
      EmployeeResponsibility: ['', Validators.required],
      IsActive: ['', Validators.required]
    });


    if (this.EmployeeResponsibilityId) {
      var postData = {
        EmployeeResponsibilityId: this.EmployeeResponsibilityId,
      }
      this.commonService.postHttpService(postData, 'ViewResponsibility').subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData;
          this.Form.patchValue({
            EmployeeResponsibilityId: result.EmployeeResponsibilityId,
            EmployeeResponsibility: result.EmployeeResponsibility,
            IsActive: result.IsActive,
          })
        }
      })
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      if (body.EmployeeResponsibilityId == '') {

        this.commonService.postHttpService(body, 'CreateResponsibility').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: res.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));


      }
      else if (body.EmployeeResponsibilityId != '') {

        this.commonService.postHttpService(body, 'UpdateResponsibility').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: res.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }


    } else {
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

  get FormControl() {
    return this.Form.controls;
  }



}

import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-rr-part-location',
  templateUrl: './manage-rr-part-location.component.html',
  styleUrls: ['./manage-rr-part-location.component.scss']
})
export class ManageRrPartLocationComponent implements OnInit {


  Form: FormGroup;
  RRPartLocationId;
  submitted = false;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.RRPartLocationId = this.data.RRPartLocationId
    this.Form = this.fb.group({
      RRPartLocation: ['', Validators.required],
      RRPartLocationId: [this.RRPartLocationId],
    })

    if (this.RRPartLocationId) {
      var postData = {
        RRPartLocationId: this.RRPartLocationId
      }
      this.commonService.postHttpService(postData, "RRPartLocationView").subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData
          this.Form.patchValue({
            RRPartLocationId: this.RRPartLocationId,
            RRPartLocation: result.RRPartLocation,
          })
        }
      })
    }
  }
  //get CountriesAddForm validation control
  get FormControl() {
    return this.Form.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      if (body.RRPartLocationId == '') {
        this.commonService.postHttpService(body, "RRPartLocationCreate").subscribe((res: any) => {
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

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (body.RRPartLocationId != '') {
        this.commonService.putHttpService(body, "RRPartLocationUpdate").subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record Updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }


    }
  }






}

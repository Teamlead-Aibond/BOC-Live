import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-location-modal',
  templateUrl: './store-location-modal.component.html',
  styleUrls: ['./store-location-modal.component.scss']
})
export class StoreLocationModalComponent implements OnInit {

  LocationId
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

    this.LocationId = this.data.LocationId;

    this.Form = this.fb.group({
      LocationId: this.LocationId,
      LocationName: ['', Validators.required],
      LocationDescription: ['', Validators.required],
      IsActive: ['', Validators.required],
    });

    if (this.LocationId) {
      this.editMode = true;
      var postData = {
        LocationId: this.LocationId
      }
      this.commonService.postHttpService(postData, 'viewStoreLocation').subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData;
          this.Form.patchValue({
            LocationId: this.LocationId,
            LocationName: result.LocationName,
            LocationDescription: result.LocationDescription,
            IsActive: result.IsActive,
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
      if (body.LocationId == '') {
        this.commonService.postHttpService(body, 'addStoreLocation').subscribe((res: any) => {
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
              text: res.message ? res.message : 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (body.LocationId != '') {
        this.commonService.putHttpService(body, 'updateStoreLocation').subscribe((res: any) => {
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
            Swal.fire({
              title: 'Error!',
              text: res.message ? res.message : 'Record could not be saved!',
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

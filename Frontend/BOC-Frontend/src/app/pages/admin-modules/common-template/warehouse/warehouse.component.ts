import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  Form: FormGroup;
  WarehouseId;
  submitted = false;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.WarehouseId = this.data.WarehouseId
    this.Form = this.fb.group({
      WarehouseName: ['', Validators.required],
      Latitude: [''],
      Longitude: [''],
      WarehouseId: [this.WarehouseId],
    })

    if (this.WarehouseId) {
      var postData = {
        WarehouseId: this.WarehouseId
      }
      this.commonService.postHttpService(postData, "viewWarehouse").subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData
          this.Form.patchValue({
            WarehouseId: this.WarehouseId,
            WarehouseName: result.WarehouseName,
            Longitude: result.Longitude,
            Latitude: result.Latitude,
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
      if (body.WarehouseId == '') {
        this.commonService.postHttpService(body, "createWarehouse").subscribe((res: any) => {
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
      else if (body.WarehouseId != '') {
        this.commonService.putHttpService(body, "updateWarehouse").subscribe((res: any) => {
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

import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {

  Form: FormGroup;
  WarehouseSub1Id;
  submitted = false;
  WarehouseList: any = [];
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.WarehouseSub1Id = this.data.WarehouseSub1Id
    this.Form = this.fb.group({
      WarehouseSub1Name: ['', Validators.required],
      Latitude: [''],
      Longitude: [''],
      WarehouseId: ['', Validators.required],
      WarehouseSub1Id: [this.WarehouseSub1Id],
    })
    this.getWarehouseList();

    if (this.WarehouseSub1Id) {
      var postData = {
        WarehouseSub1Id: this.WarehouseSub1Id
      }
      this.commonService.postHttpService(postData, "viewWarehouseSub1").subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData
          this.Form.patchValue({
            WarehouseId: result.WarehouseId,
            WarehouseSub1Id: this.WarehouseSub1Id,
            WarehouseSub1Name: result.WarehouseSub1Name,
            Longitude: result.Longitude,
            Latitude: result.Latitude,
          })
        }
      })
    }
  }
  getWarehouseList() {
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      if (response.status == true) {
        this.WarehouseList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //get Form validation control
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
      if (body.WarehouseSub1Id == '') {
        this.commonService.postHttpService(body, "createWarehouseSub1").subscribe((res: any) => {
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
      else if (body.WarehouseSub1Id != '') {
        this.commonService.putHttpService(body, "updateWarehouseSub1").subscribe((res: any) => {
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

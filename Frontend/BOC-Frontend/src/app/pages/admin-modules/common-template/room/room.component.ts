import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {


  Form: FormGroup;
  WarehouseSub2Id;
  submitted = false;
  WarehouseList: any = [];
  WarehouseSub1List: any = []
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.WarehouseSub2Id = this.data.WarehouseSub2Id
    this.Form = this.fb.group({
      WarehouseSub2Name: ['', Validators.required],
      Latitude: [''],
      Longitude: [''],
      WarehouseId: ['', Validators.required],
      WarehouseSub1Id: ['', Validators.required],
      WarehouseSub2Id: [this.WarehouseSub2Id],
    })
    this.getWarehouseList();
    this.geWarehouseSub1List();

    if (this.WarehouseSub2Id) {
      var postData = {
        WarehouseSub2Id: this.WarehouseSub2Id
      }
      this.commonService.postHttpService(postData, "viewWarehouseSub2").subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData
          this.Form.patchValue({
            WarehouseId: result.WarehouseId,
            WarehouseSub1Id: result.WarehouseSub1Id,
            WarehouseSub2Id: this.WarehouseSub2Id,
            WarehouseSub2Name: result.WarehouseSub2Name,
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
  geWarehouseSub1List() {
    this.commonService.getHttpService('getWarehouseSub1List').subscribe(response => {
      if (response.status == true) {
        this.WarehouseSub1List = response.responseData;
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
      if (body.WarehouseSub2Id == '') {
        this.commonService.postHttpService(body, "createWarehouseSub2").subscribe((res: any) => {
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
      else if (body.WarehouseSub2Id != '') {
        this.commonService.putHttpService(body, "updateWarehouseSub2").subscribe((res: any) => {
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

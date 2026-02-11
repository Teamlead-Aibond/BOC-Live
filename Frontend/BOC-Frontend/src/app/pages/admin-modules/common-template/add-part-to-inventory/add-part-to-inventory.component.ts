import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs/operators';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-part-to-inventory',
  templateUrl: './add-part-to-inventory.component.html',
  styleUrls: ['./add-part-to-inventory.component.scss']
})
export class AddPartToInventoryComponent implements OnInit {
  AddForm: FormGroup;
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  rfidEnabled: boolean = false;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    public modalRef: BsModalRef,
    @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    if(this.data) {
      
    }
    this.service.postHttpService({}, "GetRFIDConfig").subscribe((response) => {
      this.rfidEnabled = response.responseData.enabled == 1 ? true : false;
    })

    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();

    this.AddForm = this.fb.group({
      PartId: [""],
      SerialNo: [""],
      PartItemId: [""],
      PartNo: [''],
      RFIDTagNo: [''],
      Quantity: [1],
      IsAvailable: [1],
      WarehouseId: ['', Validators.required],
      WarehouseSub1Id: ["", Validators.required],
      WarehouseSub2Id: ["", Validators.required],
      WarehouseSub3Id: ["", Validators.required],
      WarehouseSub4Id: ["", Validators.required],
      Status: ["IN"]
    })

    this.AddForm.patchValue({
      PartId: this.data.RRInfo.PartId,
      PartItemId: this.data.RRInfo.PartItemId,
      PartNo: this.data.RRInfo.PartNo,
      SerialNo: this.data.RRInfo.SerialNo
    })
  }

  getWarehouseList() {
    this.service.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  getWarehouseSub1List() {
    this.service.getHttpService('getWarehouseSub1List').subscribe(response => {
      this.warehouse1List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub1Name, "id": value.WarehouseSub1Id }
      });
    });
  }

  getWarehouseSub2List() {
    this.service.getHttpService('getWarehouseSub2List').subscribe(response => {
      this.warehouse2List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub2Name, "id": value.WarehouseSub2Id }
      });
    });
  }

  getWarehouseSub3List() {
    this.service.getHttpService('getWarehouseSub3List').subscribe(response => {
      this.warehouse3List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub3Name, "id": value.WarehouseSub3Id }
      });
    });
  }

  getWarehouseSub4List() {
    this.service.getHttpService('getWarehouseSub4List').subscribe(response => {
      this.warehouse4List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub4Name, "id": value.WarehouseSub4Id }
      });
    });
  }

  get AddFormControl() {
    return this.AddForm.controls;
  }

  hide() {
    this.modalRef.hide()
  }

  add() {
    if(this.AddForm.invalid) {
      this.AddForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    let body = this.AddForm.value;
    let api = "CreateInventoryFromRR";
    if (body) {

      this.service.postHttpService(body, api).subscribe(response => {
        console.log(response, "response")

        if (response.status == true) {
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: "Part added successfully!",
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

}

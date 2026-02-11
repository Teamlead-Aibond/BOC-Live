import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

    Form: FormGroup
    PartId
    submitted: boolean = false
    warehouseList: any[];
    warehouse1List: any[];
    warehouse2List: any[];
    warehouse3List: any[];
    warehouse4List: any[];
    filteredData: any[];
    keyword = 'PartNo';
    isLoading: boolean = false;
    data2 = [];
  
    constructor(private fb: FormBuilder, private service: CommonService, public modalRef: BsModalRef,
      @Inject(BsModalRef) public data: any, private cd_ref: ChangeDetectorRef,) { }
  
    ngOnInit(): void {
  
      
      this.getWarehouseList();
      this.getWarehouseSub1List();
      this.getWarehouseSub2List();
      this.getWarehouseSub3List();
      this.getWarehouseSub4List();
      this.Form = this.fb.group({
        Part: [''],
        PartNo: ["", Validators.required],
        SerialNo: ["", Validators.required],
        InventoryId:[''],
        // IsNew: ["1"],
        // Quantity: [1],
        // WarehouseId: ['', Validators.required],
        // WarehouseSub1Id: [''],
        // WarehouseSub2Id: [''],
        // WarehouseSub3Id: [''],
        // WarehouseSub4Id: [''],
        // RFIDTagNo: [""]
      })
  
       this.Form.patchValue({
        RFIDTagNo:this.data.RFIDTagNo,
        Part: this.data.PartNo,
        PartNo: this.data.PartNo,
        PartId: this.data.PartId,
        SerialNo:this.data.SerialNo,
        InventoryId:this.data.InventoryId,
       })
       this.PartId = this.data.PartId
  
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
  
    get FormControl() {
      return this.Form.controls;
    }
  
    selectEvent(item) {
      this.PartId = item.PartId
      this.Form.patchValue({
        PartNo: item.PartNo
      })
    }
    onChangeSearch(val: string) {
  
      if (val) {
        this.isLoading = true;
        var postData = {
          "PartNo": val
        }
        this.service.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
          if (response.status == true) {
            this.data2 = response.responseData
            this.filteredData = this.data2.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())
  
            )
  
          }
          else {
  
          }
          this.isLoading = false;
          this.cd_ref.detectChanges();
        }, error => { console.log(error); this.isLoading = false; });
  
      }
    }
  
    onSubmit() {
      this.submitted = true
      let body = this.Form.value;
      if (body) {
        if (this.Form.invalid) {
          this.Form.markAllAsTouched();
          // this.markFormGroupTouched(this.AddForm);
          Swal.fire({
            title: 'Error!',
            text: 'Record could not be saved! Fill all required (*) fields!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          return;
        }
  
        var postData = {
          "InventoryStockOutList": [body],
          "rfidEnabled": true
        }
        this.service.postHttpService(postData, "AddStactout").subscribe(response => {
          console.log(response, "response")
  
          if (response.status == true) {
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
  
  
            // this.navCtrl.navigate('/admin/inventory/list');
  
            // this.router.navigate(['/repair-request/edit']);
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.message || 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          // this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
  
  
    }
  }
  

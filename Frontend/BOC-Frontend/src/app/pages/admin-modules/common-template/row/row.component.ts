import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements OnInit {

    Form: FormGroup;
    WarehouseSub4Id;
    submitted = false;
    WarehouseList: any = [];
    WarehouseSub1List: any = [];
    WarehouseSub2List :any=[];
    WarehouseSub3List :any=[];

    public event: EventEmitter<any> = new EventEmitter();
  
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,) { }
      ngOnInit(): void {
        this.WarehouseSub4Id = this.data.WarehouseSub4Id
        this.Form = this.fb.group({
          WarehouseSub4Name: ['', Validators.required],
          RowIndex:['', Validators.required],
          ColumnIndex:['', Validators.required],
          WarehouseId: ['', Validators.required],
          WarehouseSub1Id: ['', Validators.required],
          WarehouseSub2Id: ['', Validators.required],
          WarehouseSub3Id: ['', Validators.required],
          WarehouseSub4Id:[this.WarehouseSub4Id]
        })
        this.getWarehouseList();
        this.geWarehouseSub1List();
        this.geWarehouseSub2List();
        this.geWarehouseSub3List();
    
        if (this.WarehouseSub4Id) {
          var postData = {
            WarehouseSub4Id: this.WarehouseSub4Id
          }
          this.commonService.postHttpService(postData, "viewWarehouseSub4").subscribe((res: any) => {
            if (res.status == true) {
              var result = res.responseData
              this.Form.patchValue({
                WarehouseId: result.WarehouseId,
                WarehouseSub1Id: result.WarehouseSub1Id,
                WarehouseSub2Id:result.WarehouseSub2Id,
                WarehouseSub3Id:result.WarehouseSub3Id,
                WarehouseSub4Id: this.WarehouseSub4Id,
                WarehouseSub4Name: result.WarehouseSub4Name,
                RowIndex: result.RowIndex,
                ColumnIndex: result.ColumnIndex,
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
      geWarehouseSub2List() {
        this.commonService.getHttpService('getWarehouseSub2List').subscribe(response => {
          if (response.status == true) {
            this.WarehouseSub2List = response.responseData;
          } else { }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
      geWarehouseSub3List() {
        this.commonService.getHttpService('getWarehouseSub3List').subscribe(response => {
          if (response.status == true) {
            this.WarehouseSub3List = response.responseData;
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
          if (body.WarehouseSub4Id == '') {
            this.commonService.postHttpService(body, "createWarehouseSub4").subscribe((res: any) => {
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
          else if (body.WarehouseSub4Id != '') {
            this.commonService.putHttpService(body, "updateWarehouseSub4").subscribe((res: any) => {
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

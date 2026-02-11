import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-add-reference',
  templateUrl: './add-reference.component.html',
  styleUrls: ['./add-reference.component.scss']
})
export class AddReferenceComponent implements OnInit {
  customerReferenceList;
  CustomerId;
  model: any = [];
  submitted = false;
  RRId
  MROId
  public ref: any[] = [{
    ReferenceLabelName: '',
    CustomerReference1Value: '',
    CustomerReference1: '',
  }];
  responseMessage
  ReferenceLabelName;

  From;
  IdentityType;
  IdentityId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.CustomerId = this.data.CustomerId;
    this.RRId = this.data.RRId;
    this.MROId =   this.data.MROId;
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId
    this.getCustomerReferenceList(event, this.CustomerId);
  }

  getCustomerReferenceList(event, CustomerId) {
    var postData = { CustomerId: CustomerId };
    this.commonService.postHttpService(postData, 'getCustomerReferenceListDropdown').subscribe(response => {
      this.customerReferenceList = response.responseData
    });
  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  onRefSubmit(f: NgForm) {
    this.submitted = true;
    this.ReferenceLabelName = this.filterAndGetValue(this.customerReferenceList, "CReferenceName", "CReferenceId", this.model.CReferenceId)
    // this.ref = []
    // this.ref.push({
    //   ReferenceValue: this.model.ReferenceValue,
    //   CReferenceId: this.model.CReferenceId,
    //   ReferenceLabelName: ''
    // });


    //     let obj = this;
    //     let Reference = this.ref.map(function (value) {
    //       let filterdValue = obj.customerReferenceList.filter(function (label) {
    //         return value.CReferenceId == label.CReferenceId;
    //       }, value);
    //       value.ReferenceLabelName = filterdValue[0].CReferenceName;
    //       return value;
    //     })
    // console.log(Reference)
    if(this.RRId){
    if (this.RRId != 0) {
      if (f.valid) {
        var postData = {
          "RRId": this.RRId || this.IdentityId,
          "CustomerReference":
          {
            "CReferenceId": this.model.CReferenceId,
            "CustomerId": this.CustomerId,
            "ReferenceLabelName": this.ReferenceLabelName,
            "ReferenceValue": this.model.ReferenceValue,
            "RRReferenceId": this.model.CReferenceId
          }
        }

        this.commonService.postHttpService(postData, "CRAdd").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Reference saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else (response.status == false)
          {
            this.responseMessage = response.message;

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error),
        );
      }
      else {
        Swal.fire({
          type: 'error',
          title: Const_Alert_pop_title,
          text: Const_Alert_pop_message,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
    } else {
      if (f.valid) {
        var postData1 = {
          "IdentityType": this.IdentityType,
          "IdentityId": this.IdentityId,
          "CustomerId": this.CustomerId,
          "ReferenceLabelName": this.ReferenceLabelName,
          "ReferenceValue": this.model.ReferenceValue,
          "CReferenceId": this.model.CReferenceId
        }
        this.commonService.postHttpService(postData1, "CreatesalesOrderCustomerRef").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Reference saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else (response.status == false)
          {
            this.responseMessage = response.message;

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error),
        );
      }
      else {
        Swal.fire({
          type: 'error',
          title: Const_Alert_pop_title,
          text: Const_Alert_pop_message,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
    }
  }

    if (this.MROId) {
      if (f.valid) {
        var postData3 = {
          "MROId": this.MROId,
          "CustomerReference":
          {
            "CReferenceId": this.model.CReferenceId,
            "CustomerId": this.CustomerId,
            "ReferenceLabelName": this.ReferenceLabelName,
            "ReferenceValue": this.model.ReferenceValue,
            "RRReferenceId": this.model.CReferenceId
          }
        }

        this.commonService.postHttpService(postData3, "MROCREFcreate").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Reference saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else (response.status == false)
          {
            this.responseMessage = response.message;

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error),
        );
      }
      else {
        Swal.fire({
          type: 'error',
          title: Const_Alert_pop_title,
          text: Const_Alert_pop_message,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
    } 
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.scss']
})
export class EditAssetComponent implements OnInit {


  AssetForm: FormGroup;
  submitted = false;
  IdentityId;
  result;
  index
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }
  ngOnInit(): void {
    this.result = this.data.Asset;
    this.index = this.data.i
    this.AssetForm = this.fb.group({
      CustomerAssetId: ['', Validators.required],
      CustomerAssetName: ['', Validators.required],

    })


    this.AssetForm.setValue({
      CustomerAssetId: this.result.CustomerAssetId,
      CustomerAssetName: this.result.CustomerAssetName,

    })
  }


  onSubmit() {
    this.submitted = true;
    if (this.AssetForm.valid) {
      var postData = {
        CustomerAssetList: [this.AssetForm.value]
      }
      this.commonService.putHttpService(postData, "AssetEditCustomer").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.CustomerAssetList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Asset updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Asset could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else{
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }


  get AssetFormControl() {
    return this.AssetForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

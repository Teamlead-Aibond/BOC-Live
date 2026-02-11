import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {

  AssetForm: FormGroup;
  submitted = false;
  IdentityId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId
    this.AssetForm = this.fb.group({
      CustomerAssetName: ['', Validators.required],

    })
  }



  onSubmit() {
    this.submitted = true;
    if (this.AssetForm.valid) {


      var postData = {
        IdentityId: this.IdentityId,
        CustomerAssetList: [this.AssetForm.value]
      }
      this.commonService.postHttpService(postData, "getAssetAdd").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.CustomerAssetList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Asset saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
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


  //get AddressForm validation control
  get AssetFormControl() {
    return this.AssetForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

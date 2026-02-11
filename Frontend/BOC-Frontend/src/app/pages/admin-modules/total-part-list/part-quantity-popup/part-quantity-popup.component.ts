import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-part-quantity-popup',
  templateUrl: './part-quantity-popup.component.html',
  styleUrls: ['./part-quantity-popup.component.scss']
})
export class PartQuantityPopupComponent implements OnInit {

  partData;

  Form: FormGroup;
  submitted : boolean;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }



  ngOnInit(): void {
    this.partData = this.data.data
    console.log(this.partData);
    this.formGroup();

  }
   //get StateAddForm validation control
   get FormControl() {
    return this.Form.controls;
  }
  formGroup() {
    this.Form = this.fb.group({
      PartId: this.partData.PartId,
      Quantity: ['', Validators.required]
    })
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit(){
    this.submitted = true;
    if (this.Form.valid) {
    let body = {...this.Form.value}
     
       this.commonService.postHttpService(body, "updatePartQuantity").subscribe(response => {
        if (response.status == true) {
         this.triggerEvent(response.responseData);
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
            text: 'Record could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
   
  }
  }
}

import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-part-quantity-store-popup',
  templateUrl: './part-quantity-store-popup.component.html',
  styleUrls: ['./part-quantity-store-popup.component.scss']
})
export class PartQuantityStorePopupComponent implements OnInit {

  partData;

  Form: FormGroup;
  submitted : boolean;
  title: any;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }



  ngOnInit(): void {
    this.partData = this.data.data
    this.title = this.data.data.Type == 0 ? "Add Stock In Quantity" : "Reduce Quantity";
    console.log(this.partData);
    this.formGroup();

  }
   //get StateAddForm validation control
   get FormControl() {
    return this.Form.controls;
  }
  formGroup() {
    if(this.data.data.Type == 1){
      this.Form = this.fb.group({
        PartId: this.partData.PartId,
        ShopPartItemId: this.partData.ShopPartItemId,
        Quantity: ['', [Validators.required,Validators.min(1),Validators.max(this.partData.ShopCurrentQuantity)]]
      })
    }else{
      this.Form = this.fb.group({
        PartId: this.partData.PartId,
        ShopPartItemId: this.partData.ShopPartItemId,
        Quantity: ['', Validators.required]
      })
    }
    
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit(){
    this.submitted = true;
    if (this.Form.valid) {
    let body = {...this.Form.value}
       var api = this.partData.Type == 0 ? "updatePartsItemQuantity" : "reducePartsItemQuantity";
       this.commonService.postHttpService(body, api).subscribe(response => {
        if (response.status == true) {
         this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Quantity updated Successfully!',
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

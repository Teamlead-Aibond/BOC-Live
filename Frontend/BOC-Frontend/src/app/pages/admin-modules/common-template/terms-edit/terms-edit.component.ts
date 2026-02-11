import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-terms-edit',
  templateUrl: './terms-edit.component.html',
  styleUrls: ['./terms-edit.component.scss']
})
export class TermsEditComponent implements OnInit {
  TermsEditForm: FormGroup;
  submitted = false;
  index;
  result;

  TermsName;
  TermsDays;
  MonthOffset;
  Discount;
  TermsType;
  IsDefaultTerm;
  TermsId;
  termsList;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {

    this.result=this.data.result;
    this.index=this.data.index
    this.TermsEditForm = this.fb.group({
      TermsName:['', Validators.required],
      TermsDays: ['', Validators.required],
      // MonthOffset: [''],
      // Discount: ['', Validators.required],
      // TermsType: ['', Validators.required],
      IsDefaultTerm: [false],
      TermsId: [''],
    })
    this.getTermsList();

    this.TermsName = this.result.TermsName;
    //view content
    this.TermsEditForm.setValue({
      TermsName: this.result.TermsName,
      TermsDays: this.result.TermsDays,
      // MonthOffset: this.result.MonthOffset,
      // Discount: this.result.Discount,
      // TermsType: this.result.TermsType,
      IsDefaultTerm: this.result.IsDefaultTerm,
      TermsId: this.result.TermsId,
    })
  }

  getTermsList() {
    this.commonService.gettermsList().subscribe(response => {
      if (response.status == true) {
        this.termsList = response.responseData;
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

   //get CountriesAddForm validation control
   get TermsEditFormControl() { 
    return this.TermsEditForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    if (this.TermsEditForm.valid) {

      // this.triggerEvent(AddressForm.value);
      // this.modalRef.hide();
      var postData = {
        
          "TermsName": this.TermsEditForm.value.TermsName,
          "TermsDays": this.TermsEditForm.value.TermsDays,
          // "MonthOffset": this.TermsEditForm.value.MonthOffset,
          // "Discount": this.TermsEditForm.value.Discount,
          // "TermsType": this.TermsEditForm.value.TermsType,
          "IsDefaultTerm": this.TermsEditForm.value.IsDefaultTerm,
          "TermsId": this.TermsEditForm.value.TermsId,
      }
      this.commonService.putHttpService(postData, "TermsUpdate").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Terms updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Terms could not be updated!',
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

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}

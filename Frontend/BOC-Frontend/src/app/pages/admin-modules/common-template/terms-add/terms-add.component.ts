import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-terms-add',
  templateUrl: './terms-add.component.html',
  styleUrls: ['./terms-add.component.scss']
})
export class TermsAddComponent implements OnInit {
  termsList;
  TermsAddForm: FormGroup;
  submitted = false;
  TermsName;
  TermsDays;
  MonthOffset;
  Discount;
  TermsType;
  IsDefaultTerm;
  TermsList;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.TermsAddForm = this.fb.group({
      TermsName: ['', Validators.required],
      TermsDays: ['', Validators.required],
      // MonthOffset: [''],
      // Discount: ['', Validators.required],
      // TermsType: ['', Validators.required],
      IsDefaultTerm: [false],
    })
    this.getTermsList();

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

  getTerms(event, TermsName) {
    var postData = {
      TermsName: TermsName
    }

    this.commonService.getHttpServiceStateId(postData, "TermsAdd").subscribe(response => {
      if (response.status == true) {
        this.TermsList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  //get TermsAddForm validation control
  get TermsAddControl() {
    return this.TermsAddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.TermsAddForm.valid) {
      var postData = {
        TermsName: this.TermsAddForm.value.TermsName,
        TermsDays: this.TermsAddForm.value.TermsDays,
        // MonthOffset: this.TermsAddForm.value.MonthOffset,
        // Discount: this.TermsAddForm.value.Discount,
        // TermsType: this.TermsAddForm.value.TermsType,

        
        IsDefaultTerm: this.TermsAddForm.value.IsDefaultTerm,
      }
       this.commonService.postHttpService(postData, "TermsAdd").subscribe(response => {
        if (response.status == true) {
         this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Terms add saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Terms add could not be saved!',
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
}

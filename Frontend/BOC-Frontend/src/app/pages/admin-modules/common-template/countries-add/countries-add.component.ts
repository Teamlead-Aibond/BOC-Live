import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import * as moment from 'moment';

@Component({
  selector: 'app-countries-add',
  templateUrl: './countries-add.component.html',
  styleUrls: ['./countries-add.component.scss']
})
export class CountriesAddComponent implements OnInit {

  countryList;
  CountriesAddForm: FormGroup;
  submitted = false;
  StateList;
  fileData;
  DepartmentList;
  CountryName;
  Status;
  CountryCode;
  public event: EventEmitter<any> = new EventEmitter();
  CurrencyList: any = []
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.CountriesAddForm = this.fb.group({
      CountryName: ['', Validators.required],
      CountryCode: ['', Validators.required],
      Status: [''],
      VatTaxPercentage: ['', Validators.required],
      CurrencyCode: ['', Validators.required],
      EntityId: [''],
      EntityName: [''],
      ReportPrintAs: [''],
      FederalId: [''],
      EntityCompanyName: [''],
      PrintAs: [''],
      FirstTaxMonth: [null],
      TaxId: [''],
      Separate1099: [''],
      EntityPhone1: [''],
      EntityPhone2: [''],
      EntityAddress1: [''],
      EntityAddress2: [''],
      EntityCity: [''],
      EntityState: [''],
      EntityZip: [''],
      TaxSolutionId: [''],
      TaxDetailId: [''],
      NoTaxDetailId: [''],
      EntityVATNo:[''],
      EntityEmail:[''],
      EntityWebsite:[''],
      EntityInvoiceText:[''],
    })
    this.getCountryList();
    this.getDepartmentList();
    this.getCurrencyList();

  }
  getCurrencyList() {
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  // get DepartmentFormControl() {
  //   return this.DepartmentForm.controls;
  // }

  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData;
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getDepartmentList() {
    this.commonService.getHttpService("getDepartmentList").subscribe(response => {
      if (response.status == true) {
        this.DepartmentList = response.responseData;
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  getCountry(event, CountryName) {
    var postData = {
      CountryName: CountryName
    }

    this.commonService.getHttpServiceStateId(postData, "CountriesAdd").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  //get CountriesAddForm validation control
  get CountriesAddControl() {
    return this.CountriesAddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }




  // addUser() {
  //   this.modalRef = this.modalService.show(CountriesAddComponent,
  //     {
  //       initialState: {
  //         data: {  },
  //         class: 'modal-lg'
  //       }, class: 'gray modal-lg'
  //     });

  //   this.modalRef.content.closeBtnName = 'Close';

  //   this.modalRef.content.event.subscribe(res => {
  //     this.result.push(res.data);
  //   });
  // }

  onSubmit() {
    this.submitted = true;
    if (this.CountriesAddForm.valid) {
      let body = { ...this.CountriesAddForm.value };
      if(body.FirstTaxMonth != null){
        const FirstTaxMonthYears = body.FirstTaxMonth.year;
      const FirstTaxMonthDates = body.FirstTaxMonth.day;
      const FirstTaxMonthmonths = body.FirstTaxMonth.month;
      let FirstTaxMonthDate = new Date(FirstTaxMonthYears, FirstTaxMonthmonths - 1, FirstTaxMonthDates);
      let firstTaxMonthDate = moment(FirstTaxMonthDate).format('YYYY-MM-DD');
      body.FirstTaxMonth = firstTaxMonthDate
      }else{
        body.FirstTaxMonth = ""
      }
      if (body.Status == true) {
        body.Status = 1
      }
      else {
        body.Status = 0
      }
      this.commonService.postHttpService(body, "CountriesAdd").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Countries add saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Countries add could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
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

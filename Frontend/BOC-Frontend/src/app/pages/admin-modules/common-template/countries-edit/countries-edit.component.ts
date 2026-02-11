import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-countries-edit',
  templateUrl: './countries-edit.component.html',
  styleUrls: ['./countries-edit.component.scss']
})
export class CountriesEditComponent implements OnInit {
  CountriesEditForm: FormGroup;
  submitted = false;
  countryList;
  StateList;
  CountryId;
  index;
  StateId;
  result;
  CountryCode;
  Status;
  public event: EventEmitter<any> = new EventEmitter();
  CurrencyList:any=[]

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,private datePipe: DatePipe,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result=this.data.result;
    this.index=this.data.index
    this.CountriesEditForm = this.fb.group({
      CountryId:[''],
      CountryName: ['', Validators.required],
      CountryCode: ['', Validators.required],
      Status: [''],
      VatTaxPercentage:['', Validators.required],
      CurrencyCode:['', Validators.required],
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
    this.getCurrencyList();


    this.CountryCode = this.result.CountryCode;

    var postData = {
      CountryId: this.result.CountryId,
    }
    this.commonService.postHttpService(postData, 'CountriesView').subscribe((res: any) => {
      if (res.status == true) {
        var result = res.responseData;
        if(result.FirstTaxMonth !="0000-00-00" && result.FirstTaxMonth !=null){
        var FirstTaxMonthyears = Number(this.datePipe.transform(result.FirstTaxMonth, 'yyyy'));
        var FirstTaxMonthMonth = Number(this.datePipe.transform(result.FirstTaxMonth, 'MM'));
        var FirstTaxMonthDay = Number(this.datePipe.transform(result.FirstTaxMonth, 'dd'));
        this.CountriesEditForm.patchValue({
        FirstTaxMonth: {
          year: FirstTaxMonthyears,
          month: FirstTaxMonthMonth,
          day: FirstTaxMonthDay
        },
        })
        }else{
          this.CountriesEditForm.patchValue({
            FirstTaxMonth: null
            }) 
        }
        this.CountriesEditForm.patchValue({
          CountryId: result.CountryId,
          CountryName: result.CountryName,
          CountryCode: result.CountryCode,
          Status: result.Status,
          VatTaxPercentage:  result.VatTaxPercentage,
          CurrencyCode: result.CurrencyCode,
          EntityId:result.EntityId ,
          EntityName: result.EntityName,
          ReportPrintAs: result.ReportPrintAs,
          FederalId:result.FederalId,
          EntityCompanyName: result.EntityCompanyName,
          PrintAs: result.PrintAs,
          TaxId:result.TaxId,
          Separate1099: (result.Separate1099).toString(),
          EntityPhone1: result.EntityPhone1,
          EntityPhone2:result.EntityPhone2 ,
          EntityAddress1: result.EntityAddress1,
          EntityAddress2: result.EntityAddress2,
          EntityCity: result.EntityCity,
          EntityState:result.EntityState,
          EntityZip:result.EntityZip,
          TaxSolutionId: result.TaxSolutionId,
          TaxDetailId: result.TaxDetailId,
          NoTaxDetailId: result.NoTaxDetailId,
          EntityVATNo: result.EntityVATNo,
          EntityEmail: result.EntityEmail,
          EntityWebsite: result.EntityWebsite,
          EntityInvoiceText: result.EntityInvoiceText

        })
      }
    })
    //view content
    // this.CountriesEditForm.patchValue({
    //   CountryId: this.result.CountryId,
    //   CountryName: this.result.CountryName,
    //   CountryCode: this.result.CountryCode,
    //   Status: this.result.Status,
    //   VatTaxPercentage:  this.result.VatTaxPercentage,
    //   CurrencyCode: this.result.CurrencyCode,
    // })
  }

  getCurrencyList() {
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
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

  


   //get CountriesAddForm validation control
   get CountriesEditControl() {
    return this.CountriesEditForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (this.CountriesEditForm.valid) {
      let body = { ...this.CountriesEditForm.value };
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
      this.commonService.putHttpService(body, "CountriesEdit").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Countries updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Countries could not be updated!',
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

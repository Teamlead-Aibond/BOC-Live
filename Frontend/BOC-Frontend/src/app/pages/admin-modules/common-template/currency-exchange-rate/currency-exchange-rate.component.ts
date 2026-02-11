import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-currency-exchange-rate',
  templateUrl: './currency-exchange-rate.component.html',
  styleUrls: ['./currency-exchange-rate.component.scss']
})
export class CurrencyExchangeRateComponent implements OnInit {

  CurrencyRateId
  Form: FormGroup;
  submitted = false;
  editMode: boolean = false;
  CurrencyList: any = []
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService, private datePipe: DatePipe,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {

    this.CurrencyRateId = this.data.CurrencyRateId;
    this.getCurrencyList()

    this.Form = this.fb.group({
      CurrencyRateId: this.CurrencyRateId,
      SourceCurrencyCode: ['', Validators.required],
      TargetCurrencyCode: ['', Validators.required],
      ExchangeRate: ['', Validators.required],
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
    });

    if (this.CurrencyRateId) {
      this.editMode = true;
      var postData = {
        CurrencyRateId: this.CurrencyRateId
      }
      this.commonService.postHttpService(postData, 'ViewCurrencyExchangeRate').subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData;
          const FromDateyears = Number(this.datePipe.transform(result.FromDate, 'yyyy'));
          const FromDateMonth = Number(this.datePipe.transform(result.FromDate, 'MM'));
          const FromDateDay = Number(this.datePipe.transform(result.FromDate, 'dd'));
          const ToDateyears = Number(this.datePipe.transform(result.ToDate, 'yyyy'));
          const ToDateMonth = Number(this.datePipe.transform(result.ToDate, 'MM'));
          const ToDateDay = Number(this.datePipe.transform(result.ToDate, 'dd'));

          this.Form.patchValue({
            CurrencyRateId: this.CurrencyRateId,
            SourceCurrencyCode: result.SourceCurrencyCode,
            TargetCurrencyCode: result.TargetCurrencyCode,
            ExchangeRate: result.ExchangeRate,
            FromDate: {
              year: FromDateyears,
              month: FromDateMonth,
              day: FromDateDay
            },
            ToDate: {
              year: ToDateyears,
              month: ToDateMonth,
              day: ToDateDay
            },
          })
        }
      })
    }
  }

  getCurrencyList() {
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  //get form validation control
  get FormControl() {
    return this.Form.controls;
  }
  closeModal() {
    this.modalRef.hide();
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      const FromDateYears = body.FromDate.year;
      const FromDateDates = body.FromDate.day;
      const FromDatemonths = body.FromDate.month;
      let fromDate = new Date(FromDateYears, FromDatemonths - 1, FromDateDates);
      let FromDate = moment(fromDate).format('YYYY-MM-DD');
      body.FromDate = FromDate
      const ToDateYears = body.ToDate.year;
      const ToDateDates = body.ToDate.day;
      const ToDatemonths = body.ToDate.month;
      let toDate = new Date(ToDateYears, ToDatemonths - 1, ToDateDates);
      let ToDate = moment(toDate).format('YYYY-MM-DD');
      body.ToDate = ToDate
      if (body.CurrencyRateId == '') {
        this.commonService.postHttpService(body, 'CreateCurrencyExchangeRate').subscribe((res: any) => {
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
            Swal.fire({
              title: 'Error!',
              text: res.message ? res.message : 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (body.CurrencyRateId != '') {
        this.commonService.putHttpService(body, 'UpdateCurrencyExchangeRate').subscribe((res: any) => {
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
            Swal.fire({
              title: 'Error!',
              text: res.message ? res.message : 'Record could not be Updated!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }


    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}



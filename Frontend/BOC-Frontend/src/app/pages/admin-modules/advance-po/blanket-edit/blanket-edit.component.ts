/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-edit',
  templateUrl: './blanket-edit.component.html',
  styleUrls: ['./blanket-edit.component.scss']
})
export class BlanketEditComponent implements OnInit {

  EditForm: FormGroup;
  submitted = false;
  fileData: any;
  imageresult: any;
  spinner: boolean = false;
  ImagesList: any = [];
  url
  mimetype
  CustomerBlanketPOId;
  Atachmenturl;
  Atachmentmimetype
  isLoadingCustomer: boolean = false;
  keywordForCustomer = 'CompanyName';
  CustomersList: any[]
  result: any = []
  // Timeline
  topupHistoryList: any = []
  Symbol
  ExchangeRate
  BaseCurrencySymbol
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router, private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef, private route: ActivatedRoute,

  ) {


  }

  ngOnInit(): void {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")

    if (history.state.CustomerBlanketPOId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.CustomerBlanketPOId = params['CustomerBlanketPOId'];
        }
      )
    }
    else if (history.state.CustomerBlanketPOId != undefined) {
      this.CustomerBlanketPOId = history.state.CustomerBlanketPOId
    }

    this.getViewContent()
    this.EditForm = this.fb.group({
      CustomerBlanketPOId: this.CustomerBlanketPOId,
      CustomerPONo: ['', Validators.required],
      CurrentBalance: ['', Validators.required],
      StartingBalance:['', Validators.required],
      TotalAmount:['', Validators.required],
      BlanketPONotes: [''],
      LocalCurrencyCode:[''],
      ExchangeRate:[''],
      BaseCurrencyCode:[''],
      BaseStartingBalance:[''],
      BaseCurrentBalance:[''],
      BaseTotalAmount:[''],
      IsActive:['', Validators.required],
    })

  }


  getViewContent() {
    this.service.postHttpService({ CustomerBlanketPOId: this.CustomerBlanketPOId }, 'ViewBlanketPO').subscribe(response => {


      this.result = response.responseData;

      this.url = this.result.BlanketPOAtachment

      var urlString = this.result.BlanketPOAtachment;

      var Type = urlString.slice(-3);
      if (Type == "png") {
        this.mimetype = "image/png"
      }
      else if (Type == "jpg") {
        this.mimetype = "image/jpg"

      }
      else if (Type == "pdf") {
        this.mimetype = "application/pdf"

      }
      else {
        this.mimetype = "image/jpeg"
      }

      //   const years = Number(this.datePipe.transform(result.BlanketPODate, 'yyyy'));
      //   const Month = Number(this.datePipe.transform(result.BlanketPODate, 'MM'));
      //   const Day = Number(this.datePipe.transform(result.BlanketPODate, 'dd'));
      this.EditForm.patchValue({
        CustomerBlanketPOId: this.result.CustomerBlanketPOId,
        CustomerPONo: this.result.CustomerPONo,
        CurrentBalance: this.result.CurrentBalance,
        BlanketPONotes: this.result.BlanketPONotes,
        StartingBalance:this.result.StartingBalance,
        TotalAmount:this.result.TotalAmount,
        LocalCurrencyCode:this.result.LocalCurrencyCode,
        ExchangeRate:this.result.ExchangeRate,
        BaseCurrencyCode:this.result.BaseCurrencyCode,
        BaseStartingBalance:this.result.BaseStartingBalance,
        BaseCurrentBalance:this.result.BaseCurrentBalance,
        BaseTotalAmount:this.result.BaseTotalAmount,
        IsActive:this.result.IsActive
      })
      this.Symbol = this.result.CurrencySymbol
      this.ExchangeRate = this.result.ExchangeRate
    });

  }


  onCalculatBaseStartingBalance(){
    this.EditForm.patchValue({
      BaseStartingBalance: ((this.EditForm.value.StartingBalance)*this.ExchangeRate).toFixed(2),
    })
  }
  onCalculatBaseCurrentBalance(){
    this.EditForm.patchValue({
      BaseCurrentBalance: ((this.EditForm.value.CurrentBalance)*this.ExchangeRate).toFixed(2),
    })
  }
  onCalculatBaseTotalAmount(){
    this.EditForm.patchValue({
      BaseTotalAmount: ((this.EditForm.value.TotalAmount)*this.ExchangeRate).toFixed(2),
    })
  }

  //get form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;







  onFormSubmit() {
    this.submitted = true;
    if (this.EditForm.valid) {

      let body = { ...this.EditForm.value };
      body.CustomerPONo = body.CustomerPONo.trim()

      let api = "UpdateBlanketPO1";
      if (body) {
       this.service.putHttpService(body, api).subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Success!',
              text: 'Record Updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
            this.navCtrl.navigate('/admin/Blanket-PO-List');
          } else {
            Swal.fire({
              title: 'Error!',
              text: response.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          // this.cd_ref.detectChanges();
        }, error => console.log(error));
      }

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

  onback() {
    this.navCtrl.navigate('/admin/Blanket-PO-List');
  }



}

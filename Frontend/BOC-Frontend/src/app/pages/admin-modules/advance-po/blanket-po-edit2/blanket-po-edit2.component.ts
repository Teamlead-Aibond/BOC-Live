/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-po-edit2',
  templateUrl: './blanket-po-edit2.component.html',
  styleUrls: ['./blanket-po-edit2.component.scss']
})
export class BlanketPoEdit2Component implements OnInit {

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
    BaseCurrencySymbol
    Symbol
    ExchangeRate
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
        CurrentBalance: ['', Validators.required],
        BlanketPONotes: [''],
        LocalCurrencyCode:[''],
        ExchangeRate:[''],
        BaseCurrencyCode:[''],
        BaseCurrentBalance:['']
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
          CurrentBalance: this.result.CurrentBalance,
          BlanketPONotes: this.result.BlanketPONotes,
          LocalCurrencyCode:this.result.LocalCurrencyCode,
          ExchangeRate:this.result.ExchangeRate,
          BaseCurrencyCode:this.result.BaseCurrencyCode,
          BaseCurrentBalance:this.result.BaseCurrentBalance,
        })
  
        this.Symbol = this.result.CurrencySymbol
        this.ExchangeRate = this.result.ExchangeRate
  
      });
  
    }
  
  
    onCalculatBaseCurrentBalance(){
      this.EditForm.patchValue({
        BaseCurrentBalance: ((this.EditForm.value.CurrentBalance)*this.ExchangeRate).toFixed(2),
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

        let api = "UpdateBlanketPO2";
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

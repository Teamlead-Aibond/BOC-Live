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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-po-top',
  templateUrl: './blanket-po-top.component.html',
  styleUrls: ['./blanket-po-top.component.scss']
})
export class BlanketPoTopComponent implements OnInit {


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
        TopUpAmount: ['', Validators.required],
        TopUptDate: [null, Validators.required],
        Atachment: ['', [
          RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif", 'pdf'] })
        ]],
        BaseTopUpAmount:['']
      })
  
      this.onTopHistory()
    }
    onTopHistory() {
      this.service.postHttpService({ CustomerBlanketPOId: this.CustomerBlanketPOId }, 'ListTopUpByPO').subscribe(response => {
  
  
        this.topupHistoryList = response.responseData;
  
  
      });
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
        //   this.EditForm.patchValue({
        //     CustomerBlanketPOId: result.CustomerBlanketPOId,
        //     CompanyName: result.CompanyName,
        //     CustomerId: result.CustomerId,
        //     CustomerPONo: result.CustomerPONo,
        //     StartingBalance: result.StartingBalance,
        //     CurrentBalance: result.CurrentBalance,
        //     BlanketPODate: {
        //       year: years,
        //       month: Month,
        //       day: Day
        //     },
        //     BlanketPONotes: result.BlanketPONotes,
        //     BlanketPOAtachment: result.BlanketPOAtachment
        //   })
        this.Symbol = this.result.CurrencySymbol
        this.ExchangeRate = this.result.ExchangeRate
  
  
      });
  
    }
    onCalculatBaseTopUpAmount(){
      this.EditForm.patchValue({
        BaseTopUpAmount: ((this.EditForm.value.TopUpAmount)*this.ExchangeRate).toFixed(2),
      })
    }
    removeImage() {
      this.url = "";
      this.mimetype = ""
    }
  
  
    //get form validation control
    get EditFormControl() {
      return this.EditForm.controls;
    }
  
  
    private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;
  
  
  
    fileProgress(event: any) {
  
      this.fileData = event.target.files[0];
      const formData = new FormData();
      //var fileData = event.target.files;     
      var filesarray = event.target.files;
      for (var i = 0; i < filesarray.length; i++) {
        formData.append('files', filesarray[i]);
      }
      this.spinner = true;
      if (this.EditFormControl.Atachment.valid == true) {
        this.service.postHttpImageService(formData, "PartImageupload").subscribe(response => {
          this.imageresult = response.responseData;
          this.Atachmenturl = this.imageresult[0].location,
            this.Atachmentmimetype = this.imageresult[0].mimetype
          this.spinner = false;
          this.cd_ref.detectChanges();
        }, error => console.log(error));
  
      }
    }
  
  
  
  
    onFormSubmit() {
      this.submitted = true;
      if (this.EditForm.valid) {
  
        let body = { ...this.EditForm.value };
        body.TopUptDate = this.dateToString(body.TopUptDate);
        let api = "TopUpCreate";
  
        if (body) {
  
          if (this.Atachmenturl != '') {
            body.Atachment = this.Atachmenturl;
          }
  
          this.service.postHttpService(body, api).subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Success!',
                text: 'Record saved  Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
              this.navCtrl.navigate('/admin/Blanket-PO-List');
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Record could not be saved!',
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
  



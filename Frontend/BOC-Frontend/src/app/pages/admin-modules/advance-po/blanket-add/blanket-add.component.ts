/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators, trim } from '@rxweb/reactive-form-validators';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-add',
  templateUrl: './blanket-add.component.html',
  styleUrls: ['./blanket-add.component.scss']
})
export class BlanketAddComponent implements OnInit {
  AddForm: FormGroup;
  submitted = false;
  fileData: any;
  imageresult: any;
  spinner: boolean = false;
  ImagesList: any = [];
  url
  mimetype
  BaseCurrencySymbol
  Symbol
  isLoadingCustomer: boolean = false;
  keywordForCustomer = 'CompanyName';
  CustomersList: any[]
  ExchangeRate
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
  ) {

    this.AddForm = this.fb.group({
      CustomerId: ["", Validators.required],
      CustomerPONo: ['', Validators.required],
      StartingBalance: ['', Validators.required],
      // CurrentBalance: ['', Validators.required],
      BlanketPODate: [null, Validators.required],
      BlanketPONotes: [''],
      BlanketPOAtachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif", 'pdf'] })
      ]],
      LocalCurrencyCode:[''],
      ExchangeRate:[''],
      BaseCurrencyCode:[''],
      BaseStartingBalance:[''],
      IsActive: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")

  }

  removeImage() {
    this.url = "";
    this.mimetype = ""
  }


  //get form validation control
  get AddFormControl() {
    return this.AddForm.controls;
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
    if (this.AddFormControl.BlanketPOAtachment.valid == true) {
      this.service.postHttpImageService(formData, "PartImageupload").subscribe(response => {
        this.imageresult = response.responseData;
        this.url = this.imageresult[0].location,
          this.mimetype = this.imageresult[0].mimetype
        this.spinner = false;
        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }


  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.AddForm.patchValue({
      CustomerId: $event.CustomerId
    })
    this.Symbol = $event.CurrencySymbol
   
    var postData={
      "LocalCurrencyCode" :$event.CustomerCurrencyCode,
      "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
      }
      this.service.postHttpService(postData,'Exchange').subscribe(response => {
        if (response.status == true) {
          this.ExchangeRate = response.responseData.ExchangeRate;
          this.AddForm.patchValue({
            ExchangeRate:this.ExchangeRate,
            BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode')
          })
         
        } else { }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
  
      this.AddForm.patchValue({
        LocalCurrencyCode:$event.CustomerCurrencyCode,
        BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
        ExchangeRate:this.ExchangeRate,      
      })
  }

  onCalculatBaseStartingBalance(){
    this.AddForm.patchValue({
      BaseStartingBalance: ((this.AddForm.value.StartingBalance)*this.ExchangeRate).toFixed(2),
    })
  }
  
  
  clearEventCustomer($event) {
    this.AddForm.patchValue({
      CustomerId: '',
      LocalCurrencyCode:'',
      BaseCurrencyCode: '',
      ExchangeRate:''
    })
    this.ExchangeRate = ''
    this.Symbol =''
  }
  onChangeCustomerSearch(val: string) {

    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        "Customer": val
      }
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.CustomersList = data.filter(a => a.CompanyName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomer = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomer = false; });

    }
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.AddForm.valid) {

      let body = { ...this.AddForm.value };
      body.BlanketPODate = this.dateToString(body.BlanketPODate);
      body.CustomerPONo = body.CustomerPONo.trim()
      let api = "CreateBlanketPO";

      if (body) {

        if (this.url != '') {
          body.BlanketPOAtachment = this.url;
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
                text: response.message,
                type: 'warning'
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

import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { warranty_list, Const_Alert_pop_title, Const_Alert_pop_message, part_type } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-quote-mro',
  templateUrl: './update-quote-mro.component.html',
  styleUrls: ['./update-quote-mro.component.scss']
})
export class UpdateQuoteMroComponent implements OnInit {


  QuoteId;
  QuoteItemId
  MROId;
  btnDisabled: boolean = false;
  PartId;
  Status;
  EditForm: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();
  warrantyList: any;
  viewResult: any;
  BasicInfo: any = [];
  PartNo: any;
  PartDescription: any;
  SerialNo: any;
  Quantity: any;
  Rate: any;
  Price: any;
  VendorUnitPrice: any;
  WarrantyPeriod: any;
  SubTotal: any;
  AdditionalCharge: any;
  Discount: any;
  GrandTotal: any;
  Shipping: any;
  VendorId: any;
  RouteCause: any;
  //VendorLeadTime: any;
  VendorName: any;
  VendorCode: any;
  LeadTime: any;
  VendorStatus;
  submitted = false;
  QuoteNo: any;
  QuoteCustomerStatus: any;
  TotalTax = 0;
  TaxPercent = 0;
  TotalValue
  LPPList: any = []; LPP; PON; CustomerId;
  keyword; partList: any = []; partNewList: any = [];

  parts$: Observable<any> = of([]);
  partsInput$ = new Subject<string>();


  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();

  filteredData: any[];
  isLoading: boolean = false;
  PartTypes

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.QuoteId = this.data.QuoteId;
    this.QuoteItemId = this.data.QuoteItemId


    this.loadParts();
    this.loadVendors();


    this.warrantyList = warranty_list;


    this.keyword = 'PartNo';
    this.PartTypes = part_type

    this.EditForm = this.fb.group({
      QuoteId: this.QuoteId,
      TotalValue: [''],
      AdditionalCharge: [''],
      TotalTax: [''],
      TaxPercent: [''],
      Discount: [''],
      ShippingFee: [''],
      GrandTotal: [''],
      QuoteItemId: [''],
      Part: [''],
      PartNo: [''],
      PartDescription: [],
      Rate: ['', Validators.required],
      Price: ['', Validators.required],
      LeadTime: [],
      Quantity: ['', Validators.required],
      PartType: [],
      PartId: [Validators.required]



    })

    this.getViewContent();

  }


  getViewContent() {
    var postData = {
      QuoteId: this.QuoteId,
      QuoteItemId: this.QuoteItemId
    }

    this.commonService.postHttpService(postData, "ViewMROSingleCustomerQuoteItem").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;



        this.TotalValue = this.viewResult.BasicInfo[0].TotalValue;
        this.AdditionalCharge = this.viewResult.BasicInfo[0].ProcessFee;
        this.TotalTax = this.viewResult.BasicInfo[0].TotalTax;
        this.TaxPercent = this.viewResult.BasicInfo[0].TaxPercent;
        this.Discount = this.viewResult.BasicInfo[0].Discount;
        this.Shipping = this.viewResult.BasicInfo[0].ShippingFee;
        this.GrandTotal = this.viewResult.BasicInfo[0].GrandTotal;


        this.EditForm.patchValue({
          TotalValue: this.viewResult.BasicInfo[0].TotalValue,
          AdditionalCharge: this.viewResult.BasicInfo[0].ProcessFee,
          TotalTax: this.viewResult.BasicInfo[0].TotalTax,
          TaxPercent: this.viewResult.BasicInfo[0].TaxPercent,
          Discount: this.viewResult.BasicInfo[0].Discount,
          ShippingFee: this.viewResult.BasicInfo[0].ShippingFee,
          GrandTotal: this.viewResult.BasicInfo[0].GrandTotal,
          "Part": this.viewResult.QuoteItem[0].PartNo,
          "PartNo": this.viewResult.QuoteItem[0].PartNo,
          "PartDescription": this.viewResult.QuoteItem[0].PartDescription,
          "LeadTime": this.viewResult.QuoteItem[0].LeadTime,
          "Quantity": this.viewResult.QuoteItem[0].Quantity,
          "Rate": this.viewResult.QuoteItem[0].Rate,
          "Price": this.viewResult.QuoteItem[0].Price,
          "PartId": this.viewResult.QuoteItem[0].PartId,
          "QuoteItemId": this.viewResult.QuoteItem[0].QuoteItemId,
          PartType: this.viewResult.QuoteItem[0].PartType
        })



      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  calculatePrice() {
    var price = 0; var subTotal = 0;
    let Quantity = this.EditForm.value.Quantity || 0;
    let Rate = this.EditForm.value.Rate || 0;

    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    this.EditForm.patchValue({ Price: price });

    subTotal += this.EditForm.value.Price


    this.TotalValue = subTotal.toFixed(2);
    this.EditForm.patchValue({ TotalValue: this.TotalValue });
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });    
    this.EditForm.patchValue({ TotalTax: (this.TotalValue * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    let AdditionalCharge = this.EditForm.value.AdditionalCharge || 0;
    let Shipping = this.EditForm.value.ShippingFee || 0;
    let Discount = this.EditForm.value.Discount || 0;

    total = parseFloat(this.EditForm.value.TotalValue) + parseFloat(this.EditForm.value.TotalTax) +
      parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.EditForm.patchValue({ GrandTotal: this.GrandTotal });
  }

  calculateTax() {
    this.EditForm.patchValue({ TotalTax: (this.TotalValue * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }





  getFormValidationErrors() {
    Object.keys(this.EditForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.EditForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          // console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }


  //*************Part dropdown************
  clearEvent(item, index) { //alert('clear')
    this.EditForm.patchValue({
      PartNo: '',
      PartId: [''],
      PartDescription: [''],
      Part: ['']
    })
  }
  closeEvent(item, index) {
    //alert('close')
  }
  selectEvent(item) {
    if (item != null) {
      this.EditForm.patchValue({
        PartNo: item.PartNo,
        PartId: item.PartId,
        PartDescription: item.Description,
        Quantity: 1,
        Rate: item.SellingPrice
      })

      this.calculatePrice();
    } else {
      this.clearEvent(item,0)
    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }
  //*************Part dropdown************

  onSubmit() {
    this.submitted = true;

    if (this.EditForm.valid) {
      this.btnDisabled = true;

      var postData = this.EditForm.value
      this.commonService.putHttpService(postData, "UpdateMROSingleCustomerQuote").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Quote for Customer Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Quote for Customer could not be Updated!',
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

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }




  loadParts() {
    this.parts$ = concat(
      of([]), // default items
      this.partsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchParts(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }

  searchParts(term: string = ""): Observable<any> {
    var postData = {
      "PartNo": term
    }
    return this.commonService.postHttpService(postData, "SearchNonRepairPartByPartNo")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }


  loadVendors() {
    this.Vendors$ = concat(
      of([]), // default items
      this.VendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchVendors(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }

  searchVendors(term: string = ""): Observable<any> {
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }

}

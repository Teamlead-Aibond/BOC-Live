import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
export interface Part {
  PartNo1: string,
  PartNo: string,
  Description: string,
  LeadTime: string,
  Quantity: string,
  Rate: string,
  WarrantyPeriod: string
  Price: string,
  IsIncludeInQuote: boolean,
  PartId: string,
  RRVendorPartsId: string,
  PON: string,
  LPP: string
}
export interface PartData {
  VendorPartsList: Part[];
}
@Component({
  selector: 'app-mro-vendor-quote',
  templateUrl: './mro-vendor-quote.component.html',
  styleUrls: ['./mro-vendor-quote.component.scss']
})
export class MroVendorQuoteComponent implements OnInit {

  //@ViewChild('auto', { static: true }) auto;
  RRVendorId;
  MROId;
  PartId; Status;
  EditForm: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();
  warrantyList: any;
  viewResult: any;
  VendorPartsInfo: any = [];
  VendorsInfo: any = [];
  LPPList: any = []; LPP; PON;
  errorStatus = 0;

  RRPartNo: any;
  RRDescription: any;
  RRSerialNo: any;
  RRQuantity: any;
  RRRate: any;
  RRPrice: any;
  btnDisabled: boolean = false;
  WarrantyPeriod: any;
  SubTotal = 0;
  AdditionalCharge = 0;
  TotalTax = 0;
  TaxPercent = 0;
  Discount = 0;
  GrandTotal = 0;
  Shipping = 0;
  VendorId: any;
  RouteCause: any;
  VendorName: any;
  VendorCode: any;
  //VendorLeadTime: any;
  VendorStatus;
  submitted = false;
  RRLeadTime;
  VendorRefAttachment;
  imageresult;;
  fileData;
  LeadTime;
  CustomerShipToId; CustomerBillToId; CustomerId; keyword; partList: any = []; partNewList: any = [];
  isLoading: boolean = false;

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,
    private elem: ElementRef) { }

  ngOnInit(): void {
    this.RRVendorId = this.data.RRVendorId;
    this.VendorId = this.data.VendorId;
    this.MROId = this.data.MROId;
    this.PartId = this.data.PartId;
    this.VendorStatus = this.data.VendorStatus;
    this.Status = this.data.Status;
    this.CustomerId = this.data.CustomerId;
    this.CustomerShipToId = this.data.CustomerShipToId;
    this.CustomerBillToId = this.data.CustomerBillToId;

    this.getViewContent();

    this.warrantyList = warranty_list;


    this.keyword = 'PartNo';

    this.EditForm = this.fb.group({
      RouteCause: [''],
      VendorRefAttachment: [''],
      //VendorLeadTime: [''],
      AdditionalCharge: [''],
      Shipping: [''],
      SubTotal: [''],
      TotalTax: [''],
      TaxPercent: [''],
      Discount: [''],
      GrandTotal: [''],

      VendorPartsList: this.fb.array([
        this.fb.group({
          PartNo1: ['', Validators.required],
          PartNo: ['', Validators.required],
          Description: [''],
          LeadTime: [''],
          Quantity: 1,
          Rate: [''],
          Price: [''],
          PartId: [0],
          RRVendorPartsId: [''],
          IsIncludeInQuote: 1,
          PON: [''],
          LPP: [''],
          WarrantyPeriod: [''],

        })
      ]),
    })
  }

  getPartList() {
    // Update the Customer Parts List
    this.partNewList = [];
    this.partList = [];
    var postData = { CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
      //this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New', "PartColor": 'green' });
      for (var i in response.responseData) {
        this.partNewList.push({
          "PartId": response.responseData[i].PartId,
          "PartNo": response.responseData[i].PartNo,
          "Description": response.responseData[i].Description
        });
      }
      this.partList = this.partNewList;
    });
  }

  getPartPrice(PartId, index) {
    this.LPPList = [];
    var postData = { PartId: PartId, CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
      for (var i in response.responseData.LPPInfo) {
        this.LPPList.push(response.responseData.LPPInfo[i].LPP);
      }
      this.LPP = this.LPPList.join(', ');
      this.PON = response.responseData.PartInfo.PON;
      //this.RecommendedPrice = response.responseData[0].RecommendedPrice.RecommendedPrice;
    });
  }

  clearEvent(item, index) { //alert('clear')
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
    formGroup.controls['PartNo'].setValue('');
    formGroup.controls['PartId'].setValue('');
    formGroup.controls['Description'].setValue('');
  }

  closeEvent(item, index) {
    //alert('close')
  }

  selectEvent(item, index) {
    var error = false;
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;

    //get form array reference
    const parts = this.EditForm.get('VendorPartsList') as FormArray;
    // empty form array
    for (var i = 0; i < parts.length; i++) {
      if (item.PartNo == this.VendorPartsList.controls[i].get('PartNo').value) {
        this.errorStatus = 2;
        Swal.fire({
          title: 'Error!',
          text: 'The Part # ' + item.PartNo + ' is already available!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        error = true;
        formGroup.controls['PartNo'].setValue('');
        formGroup.controls['PartId'].setValue('');
        formGroup.controls['Description'].setValue('');
        formGroup.controls['PartNo1'].setValue('');
        continue;
      }
    }

    if (error == false) {
      this.errorStatus = 0;
      formGroup.controls['Description'].patchValue(item.Description);
      formGroup.controls['PartNo'].patchValue(item.PartNo);
      formGroup.controls['PartId'].patchValue(item.PartId);
      formGroup.controls['PartNo1'].patchValue(item.PartNo);

      this.LPPList = [];

      var postData = { PartId: item.PartId, CustomerId: this.CustomerId };
      this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
        for (var i in response.responseData.LPPInfo) {
          this.LPPList.push(response.responseData.LPPInfo[i].LPP);
        }
        formGroup.controls['LPP'].patchValue(this.LPPList.join(', '));
        formGroup.controls['PON'].patchValue(response.responseData.PartInfo.PON);
      });
    }
  }

  onChangeSearch(val: string, index) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
    formGroup.controls['PartNo'].patchValue(val);
    formGroup.controls['PartId'].patchValue('');
    if (val) {
      this.isLoading = true;

      var postData1 = {
        "PartNo": val
      }
      this.commonService.postHttpService(postData1, "SearchNonRepairPartByPartNo").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.partList = data.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });
    }
  }

  onFocused(e) {
    // do something when input is focused
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
      RRVendorId: this.RRVendorId,
      VendorId: this.VendorId
    }

    this.commonService.postHttpService(postData, "ViewMROVendorInfo").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;

        this.RRVendorId = this.viewResult.VendorsInfo[0].RRVendorId;
        this.RouteCause = this.viewResult.VendorsInfo[0].RouteCause;
        this.SubTotal = this.viewResult.VendorsInfo[0].SubTotal;
        this.AdditionalCharge = this.viewResult.VendorsInfo[0].AdditionalCharge;
        this.TotalTax = this.viewResult.VendorsInfo[0].TotalTax;
        this.TaxPercent = this.viewResult.VendorsInfo[0].TaxPercent;
        this.Discount = this.viewResult.VendorsInfo[0].Discount;
        this.Shipping = this.viewResult.VendorsInfo[0].Shipping;
        this.GrandTotal = this.viewResult.VendorsInfo[0].GrandTotal;
        this.VendorName = this.viewResult.VendorsInfo[0].VendorName;
        this.VendorCode = this.viewResult.VendorsInfo[0].VendorCode;
        this.VendorStatus = this.viewResult.VendorsInfo[0].Status;
        this.VendorRefAttachment = this.viewResult.VendorsInfo[0].VendorRefAttachment;

        if (this.viewResult.VendorPartsInfo.length > 0) {
          var PON; var LPP;

          //get form array reference
          const parts = this.EditForm.get('VendorPartsList') as FormArray;
          // empty form array
          while (parts.length) {
            parts.removeAt(0);
          }

          for (let val of this.viewResult.VendorPartsInfo) {
            this.LPPList = [];
            PON = ''; LPP = '';

            if (val.PartId != 0) {
              // empty form array
              /* while (this.LPPList.length) {
                this.LPPList.removeAt(0);
              } */

              var postData = { PartId: val.PartId, CustomerId: this.CustomerId };
              this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
                if (response.status == true) {
                  if (response.responseData.LPPInfo.length > 0) {
                    for (var i in response.responseData.LPPInfo) {
                      this.LPPList.push(response.responseData.LPPInfo[i].LPP);
                    }
                    LPP = this.LPPList.join(', ');
                  } else {
                    LPP = '';
                  }
                  PON = response.responseData.PartInfo.PON || '';

                  this.VendorPartsList.push(this.fb.group({
                    "PartNo1": val.PartNo,
                    "PartNo": val.PartNo,
                    "Description": val.Description,
                    "LeadTime": val.LeadTime,
                    "Quantity": val.Quantity,
                    "Rate": val.Rate,
                    "Price": val.Price,
                    "IsIncludeInQuote": val.IsIncludeInQuote,
                    "PartId": val.PartId,
                    "RRVendorPartsId": val.RRVendorPartsId,
                    "PON": PON,
                    "LPP": LPP,
                    "WarrantyPeriod": val.WarrantyPeriod

                  }));
                }
              });
            } else {
              this.VendorPartsList.push(this.fb.group({
                "PartNo1": val.PartNo,
                "PartNo": val.PartNo,
                "Description": val.Description,
                "LeadTime": val.LeadTime,
                "Quantity": val.Quantity,
                "Rate": val.Rate,
                "Price": val.Price,
                "IsIncludeInQuote": val.IsIncludeInQuote,
                "PartId": val.PartId,
                "RRVendorPartsId": val.RRVendorPartsId,
                "PON": '',
                "LPP": '',
                "WarrantyPeriod": val.WarrantyPeriod

              }));
            }

          }
        }


        // this.RRPartNo = this.viewResult.PartInfo[0].PartNo; // Fix error
        // this.RRDescription = this.viewResult.PartInfo[0].Description;
        // this.RRSerialNo = this.viewResult.PartInfo[0].SerialNo;
        // this.RRQuantity = this.viewResult.PartInfo[0].Quantity;
        // this.RRRate = this.viewResult.PartInfo[0].Rate;
        // this.RRLeadTime = this.viewResult.PartInfo[0].LeadTime;
        // this.RRPrice = this.viewResult.PartInfo[0].Price;
        //this.WarrantyPeriod = this.viewResult.PartInfo[0].WarrantyPeriod;

        this.EditForm.patchValue({
          RouteCause: this.viewResult.VendorsInfo[0].RouteCause,
          VendorRefAttachment: this.viewResult.VendorsInfo[0].VendorRefAttachment,
          AdditionalCharge: this.viewResult.VendorsInfo[0].AdditionalCharge,
          Shipping: this.viewResult.VendorsInfo[0].Shipping,
          SubTotal: this.viewResult.VendorsInfo[0].SubTotal,
          TotalTax: this.viewResult.VendorsInfo[0].TotalTax,
          TaxPercent: this.viewResult.VendorsInfo[0].TaxPercent,
          Discount: this.viewResult.VendorsInfo[0].Discount,
          GrandTotal: this.viewResult.VendorsInfo[0].GrandTotal,
        });
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
    let Quantity = formGroup.controls['Quantity'].value || 0;
    let Rate = formGroup.controls['Rate'].value || 0;

    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    formGroup.controls['Price'].patchValue(price.toFixed(2));

    // Calculate the subtotal
    for (let i = 0; i < this.VendorPartsList.length; i++) {
      if (this.VendorPartsList.controls[i].get('IsIncludeInQuote').value == 1) {
        subTotal += parseFloat(this.VendorPartsList.controls[i].get('Price').value);
      }
    }
    this.EditForm.patchValue({ SubTotal: subTotal });
    this.SubTotal = subTotal;
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.TaxPercent / 100).toFixed(2) });
    this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    let AdditionalCharge = this.EditForm.value.AdditionalCharge || 0;
    let Shipping = this.EditForm.value.Shipping || 0;
    let Discount = this.EditForm.value.Discount || 0;

    total = parseFloat(this.EditForm.value.SubTotal) + parseFloat(this.EditForm.value.TotalTax) +
      parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.EditForm.patchValue({ GrandTotal: this.GrandTotal });
  }

  calculateTax() {
    this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.VendorPartsList.length; i++) {
      if (this.VendorPartsList.controls[i].get('IsIncludeInQuote').value == 1) {
        subTotal += parseFloat(this.VendorPartsList.controls[i].get('Price').value);
      }
    }
    this.EditForm.patchValue({ SubTotal: subTotal });
    this.SubTotal = subTotal;
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.TaxPercent / 100).toFixed(2) });
    this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
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

  onSubmit() {
    this.submitted = true;
    this.getFormValidationErrors();
    this.EditForm.markAllAsTouched();
    let partNotFound = false;
    if (this.EditForm.valid) {
      // this.VendorPartsList.controls.forEach((control, i) => {
      //   if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
      //     partNotFound = true;
      //   }
      // })
      // this.errorStatus = 0;

      // if (partNotFound) {
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Some seleted parts are not found!',
      //     type: 'warning',
      //     confirmButtonClass: 'btn btn-confirm mt-2'
      //   });
      //   return;
      // }
      var postData = {
        "MROId": this.MROId,
        "CustomerBillToId": this.CustomerBillToId,
        "CustomerShipToId": this.CustomerShipToId,
        "VendorPartsList": this.EditForm.value.VendorPartsList,
        "VendorsList": {
          "RRVendorId": this.RRVendorId,
          "RouteCause": this.EditForm.value.RouteCause,
          "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
          //"LeadTime": this.EditForm.value.VendorLeadTime,
          "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
          "SubTotal": this.EditForm.value.SubTotal,
          "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
          "TotalTax": this.EditForm.value.TotalTax,
          "TaxPercent": this.EditForm.value.TaxPercent,
          "Discount": this.EditForm.value.Discount || 0,
          "Shipping": this.EditForm.value.Shipping || 0,
          "GrandTotal": this.EditForm.value.GrandTotal,
        }
      }
      this.commonService.putHttpService(postData, "UpdateMROVendorQuote").subscribe(response => {
        if (response.status == true) {
          let from = 'save';
          this.triggerEvent(from);
          //this.triggerEvent(response.responseData.VendorsList);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Vendor Quote Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Vendor Quote could not be Updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    } else {
      this.errorStatus = 1;
    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  //Add another Part 
  public initPart(): FormGroup {
    return this.fb.group({
      PartNo1: ['', Validators.required],
      PartNo: ['', Validators.required],
      Description: [''],
      LeadTime: [''],
      Quantity: [1],
      Rate: [''],
      Price: [''], // Price: ['', Validators.required], Rate: ['', Validators.required],
      IsIncludeInQuote: [1],
      PartId: [0],
      RRVendorPartsId: [0],
      PON: [''],
      LPP: [''],
      WarrantyPeriod: [''],
    });
  }

  public addPart(): void {
    const control = <FormArray>this.EditFormControl.VendorPartsList;
    control.push(this.initPart());
  }

  get VendorPartsList(): FormArray {
    return this.EditForm.get('VendorPartsList') as FormArray;
  }

  removePart(i: number) {
    var partId = this.VendorPartsList.controls[i].get('RRVendorPartsId').value;
    if (partId > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.VendorPartsList.removeAt(i);
          this.changeStatus(i);
          var postData = {
            RRVendorPartsId: partId,
          }
          this.commonService.putHttpService(postData, 'RRVendorPartDelete').subscribe(response => {
            if (response.status == true) {
              /*  Swal.fire({
                 title: 'Deleted!',
                 text: 'Part has been deleted.',
                 type: 'success'
               }); */
            }
          });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          /* Swal.fire({
            title: 'Cancelled',
            text: 'Part is safe:)',
            type: 'error'
          }); */
        }
      });
    } else {
      this.VendorPartsList.removeAt(i);
      this.changeStatus(i);
    }
  }

  CreateCustomerQuote(VendorId, RRVendorId) {
    this.submitted = true;
    let partNotFound = false;
    this.getFormValidationErrors();
    if (this.EditForm.valid) {
      this.btnDisabled = true;
      // this.VendorPartsList.controls.forEach((control, i) => {
      //   if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
      //     partNotFound = true;
      //   }
      // })

      // if (partNotFound) {
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Some seleted parts are not found!',
      //     type: 'warning',
      //     confirmButtonClass: 'btn btn-confirm mt-2'
      //   });
      //   return;
      // }
      this.errorStatus = 0;
      Swal.fire({
        title: 'Do you wish to proceed?',
        text: 'You won\'t be able to revert this! ',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            "MROId": this.MROId,
            "CustomerId": this.CustomerId,
            "VendorId": VendorId,
            "CustomerShipToId": this.CustomerShipToId,
            "CustomerBillToId": this.CustomerBillToId,
            "VendorPartsList": this.EditForm.value.VendorPartsList,
            "VendorsList": {
              "RRVendorId": this.RRVendorId,
              "RouteCause": this.EditForm.value.RouteCause,
              "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
              //"LeadTime": this.EditForm.value.VendorLeadTime,
              "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
              "SubTotal": this.EditForm.value.SubTotal,
              "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
              "TotalTax": this.EditForm.value.TotalTax,
              "TaxPercent": this.EditForm.value.TaxPercent,
              "Discount": this.EditForm.value.Discount || 0,
              "Shipping": this.EditForm.value.Shipping || 0,
              "GrandTotal": this.EditForm.value.GrandTotal,
            }
          }

          this.commonService.postHttpService(postData, "SaveAndCreateMROCustomerQuote").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();

              Swal.fire({
                title: 'Success!',
                text: 'Quote for Customer has been created!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Quote for Custome has not created!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Quote for Custome has not created.',
            type: 'error'
          });
        }
      });
    } else {
      this.errorStatus = 1;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });


    }
  }

  fileProgress(event: any) {


    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }

    this.commonService.postHttpImageService(formData, "getVendoruploadAttachment").subscribe(response => {
      this.imageresult = response.responseData;

      this.EditForm.patchValue({
        VendorRefAttachment: this.imageresult[0].location
      });

      //this.VendorRefAttachment = this.imageresult[0].location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  ngAfterViewInit() {

    $(document).on("blur", ".autocomplete-container .input-container input", (e) => {
      if (!this.partList.find(a => a.PartNo == e.target.value)) {
        e.target.value = "";

        let idx = $(e.target).closest(".row").index();
        this.VendorPartsList.controls[idx].patchValue({
          PartNo: "",
          PartId: "",
          Description: "",
          PartNo1: ""
        })
        // this.VendorPartsList.setErrors({ 'partNotFound': true });
      }
    })
  }

}



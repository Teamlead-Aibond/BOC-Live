/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, CONST_CREATE_ACCESS, CONST_VIEW_ACCESS, Customer_Invoice_Status, Invoice_Status, Invoice_Type } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { ConsolidateInvoiceViewComponent } from '../../common-template/consolidate-invoice-view/consolidate-invoice-view.component';

@Component({
  selector: 'app-add-consolidate-invoice',
  templateUrl: './add-consolidate-invoice.component.html',
  styleUrls: ['./add-consolidate-invoice.component.scss']
})
export class AddConsolidateInvoiceComponent implements OnInit {
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  model: any = {}
  IsAddEnabled: boolean = false
  IsViewEnabled: boolean = false

  BlanketPO: boolean = false
  CustomPO: boolean = false
  BlanketList: any = []
  BlanketddlList: any = []
  InvoiceList: any = []
  CheckedArray: any = []
  InvoiceType
  StatusName
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  dtOptions2: any = {};
  dtTrigger2: Subject<any> = new Subject();

  gridCheckAll: boolean;
  uncheckedQuoteIds: any = []
  checkedList: any = []
  showList: boolean = false
  CustomerPONo
  Customer_Invoice_Status
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder, public router: Router,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  currentRouter = this.router.url;
  ngOnInit(): void {
    this.loadCustomers()
    this.Customer_Invoice_Status = Customer_Invoice_Status;
    this.model.Status = ""
    this.IsAddEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_CREATE_ACCESS);
    this.IsViewEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_VIEW_ACCESS);
    this.setDtOption();
  }

  setDtOption() {
    this.dtOptions = {
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      processing: true,
      retrieve: true,
      language: {
        paginate: {
          first: '«',
          previous: '‹',
          next: '›',
          last: '»'
        },
        aria: {
          paginate: {
            first: 'First',
            previous: 'Previous',
            next: 'Next',
            last: 'Last'
          }
        }
      },
      dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
      buttons: {
        dom: {
          button: {
            className: '',
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-sm btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-sm btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
              //columns: [ 0, 1, 2, 3 ]
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-sm btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      },
    };
    this.dtTrigger.next();
    this.dtOptions2 = {
      paging: true,
      stateSave: true,
      pagingType: 'full_numbers',
      pageLength: 100,
      responsive: true,
      processing: true,
      retrieve: true,
      language: {
        paginate: {
          first: '«',
          previous: '‹',
          next: '›',
          last: '»'
        },
        aria: {
          paginate: {
            first: 'First',
            previous: 'Previous',
            next: 'Next',
            last: 'Last'
          }
        }
      },
      dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
      buttons: {
        dom: {
          button: {
            className: '',
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-sm btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-sm btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
              //columns: [ 0, 1, 2, 3 ]
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-sm btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      },
    };
    this.dtTrigger2.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();

  }
  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }
  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }


  onSubmit() {
    if (this.model.CustomerBlanketPOId != '' && this.model.CustomerBlanketPOId != undefined) {
      this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == this.model.CustomerBlanketPOId).CustomerPONo
    }
    if (this.checkedList.length > 0) {
      if (this.checkedList.length > 1) {
        var postData = {
          "CustomerPONo": this.model.CustomerPONo || this.CustomerPONo,
          "CustomerId": this.model.CustomerId,
          "CustomerBlanketPOId": this.model.CustomerBlanketPOId,
          "ConsolidateDetail": this.checkedList
        }
        this.commonService.postHttpService(postData, "ConsolidateInvoiceCreate").subscribe(response => {
          if (response.status == true) {
            this.onSearch2();
            var ConsolidateInvoiceId = response.responseData.Consolidate.ConsolidateInvoiceId
            var showPrint = true
            var showActions = true
            const initialState = { ConsolidateInvoiceId, showPrint, showActions };

            this.modalRef = this.CommonmodalService.show(ConsolidateInvoiceViewComponent,
              {
                backdrop: 'static',
                ignoreBackdropClick: true,
                initialState: {
                  initialState,
                  class: 'modal-xl'
                }, class: 'gray modal-xl'
              });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: response.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
      else {
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: 'Please select more than one invoice for consolidate Invoice',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });

      }
    }
    else {
      Swal.fire({
        type: 'info',
        title: 'Message',
        text: 'Please checked the Invoice Line Item',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }


  }
  onSearch2(){
     // this.setDtOption();
     this.InvoiceList = []
     if (this.model.InvoiceNo != undefined) {
       var invoiceNo = this.model.InvoiceNo.replace("\n", "").toString()
       var InvoiceNo = invoiceNo.split(" ");
     } else {
       InvoiceNo = ""
     }
     var postData = {
       "Status": this.model.Status,
       "CustomerPONo": this.model.CustomerPONo,
       "CustomerId": this.model.CustomerId,
       "InvoiceNo": InvoiceNo.toString(),
       "CustomerBlanketPOId": this.model.CustomerBlanketPOId,
     }
     this.commonService.postHttpService(postData, "ConsolidateInvoiceSearch").subscribe(response => {
       if (response.status == true) {
         this.showList = true
         this.InvoiceList = response.responseData.data;
         // $('[Id $= "datatable-list2"]').css('display', 'none');
         // $('[Id $= "datatable-list"]').css('display', 'block');
         // this.dtTrigger.next();
         // $('[Id $= "datatable-invoicelist_paginate"]').css('display', 'block');
         // $('[Id $= "datatable-invoicelist_info"]').css('display', 'block');
         // $('[Id $= "datatable-invoicelist_length"]').css('display', 'block');
         // // const table: any = $('datatable-list');
         // // table.DataTable();  
         // this.cd_ref.detectChanges();
         // this.InvoiceList.forEach(item => {
         //   item.checked = this.isQuoteChecked(item.InvoiceId);
         // });    
         if (this.InvoiceList.length == 0) {
           this.dataTableMessage = "No data!";
           $('[Id $= "datatable-list"]').css('display', 'none');
           $('[Id $= "datatable-list2"]').css('display', 'block');
           this.dtTrigger2.next();
           $('[Id $= "datatable-invoicelist2_paginate"]').css('display', 'none');
           $('[Id $= "datatable-invoicelist2_info"]').css('display', 'none');
           $('[Id $= "datatable-invoicelist2_length"]').css('display', 'none');
           // const table: any = $('datatable-list2');
           // table.DataTable();
           this.cd_ref.detectChanges();
 
         } else {
 
           $('[Id $= "datatable-list2"]').css('display', 'none');
           $('[Id $= "datatable-list"]').css('display', 'block');
           this.dtTrigger.next();
           $('[Id $= "datatable-invoicelist_paginate"]').css('display', 'block');
           $('[Id $= "datatable-invoicelist_info"]').css('display', 'block');
           $('[Id $= "datatable-invoicelist_length"]').css('display', 'block');
           // const table: any = $('datatable-list');
           // table.DataTable();  
           this.cd_ref.detectChanges();
           this.InvoiceList.forEach(item => {
             item.checked = this.isQuoteChecked(item.InvoiceId);
           });
           this.rerender();
         }
       }
       else {
         Swal.fire({
           title: 'Error!',
           text: response.message,
           type: 'warning',
           confirmButtonClass: 'btn btn-confirm mt-2'
         });
 
       }
       this.cd_ref.detectChanges();
 
     }, error => console.log(error));
  
  }


  onSearch(f: NgForm) {
    // this.setDtOption();
    this.InvoiceList = []
    if (this.model.InvoiceNo != undefined) {
      var invoiceNo = this.model.InvoiceNo.replace("\n", "").toString()
      var InvoiceNo = invoiceNo.split(" ");
    } else {
      InvoiceNo = ""
    }
    if (f.valid) {
    var postData = {
      "Status": this.model.Status,
      "CustomerPONo": this.model.CustomerPONo,
      "CustomerId": this.model.CustomerId,
      "InvoiceNo": InvoiceNo.toString(),
      "CustomerBlanketPOId": this.model.CustomerBlanketPOId,
    }
    this.commonService.postHttpService(postData, "ConsolidateInvoiceSearch").subscribe(response => {
      if (response.status == true) {
        this.showList = true
        this.InvoiceList = response.responseData.data;
        // $('[Id $= "datatable-list2"]').css('display', 'none');
        // $('[Id $= "datatable-list"]').css('display', 'block');
        // this.dtTrigger.next();
        // $('[Id $= "datatable-invoicelist_paginate"]').css('display', 'block');
        // $('[Id $= "datatable-invoicelist_info"]').css('display', 'block');
        // $('[Id $= "datatable-invoicelist_length"]').css('display', 'block');
        // // const table: any = $('datatable-list');
        // // table.DataTable();  
        // this.cd_ref.detectChanges();
        // this.InvoiceList.forEach(item => {
        //   item.checked = this.isQuoteChecked(item.InvoiceId);
        // });    
        if (this.InvoiceList.length == 0) {
          this.dataTableMessage = "No data!";
          $('[Id $= "datatable-list"]').css('display', 'none');
          $('[Id $= "datatable-list2"]').css('display', 'block');
          this.dtTrigger2.next();
          $('[Id $= "datatable-invoicelist2_paginate"]').css('display', 'none');
          $('[Id $= "datatable-invoicelist2_info"]').css('display', 'none');
          $('[Id $= "datatable-invoicelist2_length"]').css('display', 'none');
          // const table: any = $('datatable-list2');
          // table.DataTable();
          this.cd_ref.detectChanges();

        } else {

          $('[Id $= "datatable-list2"]').css('display', 'none');
          $('[Id $= "datatable-list"]').css('display', 'block');
          this.dtTrigger.next();
          $('[Id $= "datatable-invoicelist_paginate"]').css('display', 'block');
          $('[Id $= "datatable-invoicelist_info"]').css('display', 'block');
          $('[Id $= "datatable-invoicelist_length"]').css('display', 'block');
          // const table: any = $('datatable-list');
          // table.DataTable();  
          this.cd_ref.detectChanges();
          this.InvoiceList.forEach(item => {
            item.checked = this.isQuoteChecked(item.InvoiceId);
          });
          this.rerender();
        }
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });

      }
      this.cd_ref.detectChanges();

    }, error => console.log(error));
  } else {
    Swal.fire({
      type: 'error',
      title: Const_Alert_pop_title,
      text: Const_Alert_pop_message,
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }
  }
  onClear() {
    this.showList = false
    this.model.InvoiceNo = ''
    this.model.CustomerId = ''
    this.model.Status = ''
    this.model.Type = ""
    this.BlanketPO = false
    this.CustomPO = false
    this.model.CustomerPONo = ""
    this.model.CustomerBlanketPOId =""
    $('[Id $= "datatable-list"]').css('display', 'none');
    $('[Id $= "datatable-list2"]').css('display', 'none');
  }
  reLoad() {
    this.router.navigate([this.currentRouter])
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
      this.dtTrigger2.next();
    });
  }



  setBlanketCutomer(value) {
    if (this.model.CustomerId != '' && this.model.CustomerId != undefined) {
      if (value == 1) {
        this.BlanketPO = true
        this.CustomPO = false

      }
    } else {
      Swal.fire({
        title: 'Message',
        text: 'Please Choose the Customer',
        type: 'info'
      });
    }
  }
  setCustomerPO(value) {
    if (value == 0) {
      this.BlanketPO = false
      this.CustomPO = true
    }
  }
  getBlanketList() {
    if (this.model.CustomerId != '' && this.model.CustomerId != null && this.model.CustomerId != undefined) {   // this.showSpinner=true;
      var postData = {
        "CustomerId": this.model.CustomerId,
      }
      this.commonService.postHttpService(postData, 'ByCustomerBlanketPOList').subscribe(response => {
        if (response.status == true) {
          this.BlanketList = response.responseData
          this.BlanketddlList = response.responseData.map(function (value) {
            return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance:" + value.LocalCurrencySymbol + ' ' + value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
          });


        }
        else {

        }
        this.cd_ref.detectChanges();
        // this.showSpinner=false
      });
    }
  }


  gridAllRowsCheckBoxChecked(e) {
    // console.log(e);
    // if (this.gridCheckAll) {
    this.uncheckedQuoteIds.length = 0;
    this.gridCheckAll = !this.gridCheckAll;

    // if (this.gridCheckAll) {
    //   this.checkedPersonIds.push();
    // }
    // } else {
    //   this.checkedPersonIds.length = 0;
    //   this.gridCheckAll = true;
    // }
    if (e.target.checked) {
      this.InvoiceList.map(a => {
        if(a.IsApproved==1 && a.Consolidated!=1)
        {
          a.checked = true
        }else{
          a.checked = false;
        }
      }
        );
      this.checkedList = this.InvoiceList.map(a => { return { InvoiceNo: a.InvoiceNo, InvoiceId: a.InvoiceId, CustomerId: a.CustomerId, CustomerPONo: a.CustomerPONo, CustomerBlanketPOId: a.CustomerBlanketPOId, LocalCurrencyCode: a.LocalCurrencyCode } });
      this.checkedList.map(a => { return this.CustomerPONo = a.CustomerPONo })

      // this.QuoteList = this.QuoteItem.map(a => {
      //   let qObj: any;
      //   qObj.QuoteId = a.QuoteId;
      //   if (a.RRNo != '' && a.RRNo != '0' && a.RRNo != null) {
      //     qObj.RRNo = a.RRNo;
      //   } else if (a.MRONo != '' && a.MRONo != '0' && a.MRONo != null) {
      //     qObj.MRONo = a.MRONo;

      //   }
      //   return qObj;
      // });
    } else {
      this.InvoiceList.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
  }
  private isQuoteChecked(InvoiceId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      // return this.checkedQuoteIds.indexOf(CustomerId) >= 0 ? true : false;
    } else {
      this.InvoiceList.map(a => a.checked = false);
      this.checkedList = this.InvoiceList.map(a => {
        return { InvoiceNo: a.InvoiceNo, InvoiceId: a.InvoiceId, CustomerId: a.CustomerId, CustomerPONo: a.CustomerPONo, CustomerBlanketPOId: a.CustomerBlanketPOId, LocalCurrencyCode: a.LocalCurrencyCode }
      });
      this.checkedList.map(a => { return this.CustomerPONo = a.CustomerPONo })
      return this.uncheckedQuoteIds.indexOf(InvoiceId) >= 0 ? false : true;

    }
  }
  rowCheckBoxChecked(e, InvoiceNo, InvoiceId, CustomerId, CustomerPONo, CustomerBlanketPOId, LocalCurrencyCode) {
    if (e.target.checked) {
      this.CustomerPONo = CustomerPONo
      this.checkedList.push({ InvoiceNo, InvoiceId, CustomerId, CustomerPONo, CustomerBlanketPOId, LocalCurrencyCode });

      // let qObj: any;
      // qObj.QuoteId = QuoteId;

      // if (RRNo != '' && RRNo != '0' && RRNo != null) {
      //   qObj.RRNo = RRNo;
      // } else if (MRONo != '' && MRONo != '0' && MRONo != null) {
      //   qObj.MRONo = MRONo;

      // }

      // this.QuoteItem.push(qObj);

    } else {
      this.gridCheckAll = false
      this.checkedList = this.checkedList.filter(a => a.InvoiceId != InvoiceId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }


  GetClassStatusName(Status) {
    var className = ""
    var StatusStyle = Invoice_Status.find(a => a.Invoice_StatusId == Status)
    this.StatusName = (StatusStyle ? StatusStyle.Invoice_StatusName : '')
    className = `badge ' ${(StatusStyle ? StatusStyle.cstyle : '')}  ' btn-xs`
    return className;
  }
  GetClassInvoiceTypeName(InvoiceType) {
    var className = ""
    var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == InvoiceType)
    this.InvoiceType = (TypeStyle ? TypeStyle.Invoice_TypeName : '')
    className = `badge ' ${(TypeStyle ? TypeStyle.cstyle : '')}  ' btn-xs`
    return className;
  }
}

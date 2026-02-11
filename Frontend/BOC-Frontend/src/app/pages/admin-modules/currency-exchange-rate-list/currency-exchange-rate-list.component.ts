/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { CurrencyExchangeRateComponent } from '../common-template/currency-exchange-rate/currency-exchange-rate.component';
import { MultiCurrencyComponent } from '../common-template/multi-currency/multi-currency.component';

@Component({
  selector: 'app-currency-exchange-rate-list',
  templateUrl: './currency-exchange-rate-list.component.html',
  styleUrls: ['./currency-exchange-rate-list.component.scss']
})
export class CurrencyExchangeRateListComponent implements OnInit {


  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dataTableMessage;
  dtOptions: any = {};
  result: any = [];


  //access rights variable
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  constructor(
    public service: CommonService,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {

  }
  currentRouter = this.router.url;

  ngOnInit() {
    document.title = 'Currency Exchange Rate List'

    this.IsViewEnabled = true;
    // this.service.permissionCheck("ManageCountries", CONST_VIEW_ACCESS);
    this.IsAddEnabled = true;
    // this.service.permissionCheck("ManageCountries", CONST_CREATE_ACCESS);
    this.IsEditEnabled = true;
    // this.service.permissionCheck("ManageCountries", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = true;
    //  this.service.permissionCheck("ManageCountries", CONST_DELETE_ACCESS);

    this.dataTableMessage = "Loading...";
    this.dtOptions = {
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

    this.service.getHttpService('GetCurrencyExchangeRateList').subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;

        if (this.result.length == 0) this.dataTableMessage = "No data!";
      } else {
        this.dataTableMessage = "No data!";
      }
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }







  reLoad() {
    this.router.navigate([this.currentRouter])
  }
  addCurrencyExchangeRate() {
    var CurrencyRateId = '';
    this.modalRef = this.modalService.show(CurrencyExchangeRateComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { CurrencyRateId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();

    });
  }
  editCurrencyExchangeRate(item, i) {
    var CurrencyRateId = item.CurrencyRateId;
    this.modalRef = this.modalService.show(CurrencyExchangeRateComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { CurrencyRateId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }
  deleteCurrencyExchangeRate(CurrencyRateId) {
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
        var postData = {
          CurrencyRateId: CurrencyRateId,
        }

        this.service.postHttpService(postData, 'DeleteCurrencyExchangeRate').subscribe(response => {
          if (response.status == true) {

            Swal.fire({
              title: 'Deleted!',
              text: 'Record has been deleted.',
              type: 'success'
            });
            this.reLoad();
            //this.getCountriesList();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Record is safe:)',
          type: 'error'
        });
      }
    });

  }



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }





}


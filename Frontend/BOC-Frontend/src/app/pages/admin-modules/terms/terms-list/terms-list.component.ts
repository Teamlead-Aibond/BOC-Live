/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { DataTableDirective } from 'angular-datatables';
import pdfMake from 'pdfmake/build/pdfmake.min.js';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';

import { AppConfig } from 'config';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsAddComponent } from '../../common-template/terms-add/terms-add.component';
import { TermsEditComponent } from '../../common-template/terms-edit/terms-edit.component';
import { CONST_CREATE_ACCESS, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-terms-list',
  templateUrl: './terms-list.component.html',
  styleUrls: ['./terms-list.component.scss']
})

export class TermsListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dataTableMessage;
  dtOptions: any = {};
  result: any = [];
  Status;
  Term;
  NoOfDays;
  TermsType;
  IsDefaultTerm;
  Discount;
  //access rights variable
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  constructor(
    public service: CommonService,
    public modalRef: BsModalRef,
    private openmodalService: NgbModal,
    private http: HttpClient,
    private modalService: BsModalService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {
    //this.alwaysShowCalendars = true;
  }

  currentRouter = this.router.url;

  ngOnInit() {

    document.title='Terms List'
    this.IsViewEnabled = this.service.permissionCheck("ManageTerms", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageTerms", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageTerms", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageTerms", CONST_DELETE_ACCESS);

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

    this.service.getHttpService('getTermsList').subscribe(response => {
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

  GetClassName(IsDefaultTerm: string): string {
    let className: string = 'black';
    if (IsDefaultTerm == '1') {
      this.IsDefaultTerm = "Yes"
      className = 'badge badge-success';
    }
    else if (IsDefaultTerm == '0') {
      this.IsDefaultTerm = "No"
      className = 'badge badge-warning';
    }
    return className;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getTermsList() {
    this.service.getHttpService('getTermsList').subscribe(response => {
      this.result = response.ResponseData;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }

  // getTermsList(){
  //   this.service.getHttpService('getTermsList').subscribe(response => {
  //     if (response.IsException == null) { 
  //       this.result = response.responseData;
  //     } else {
  //       this.dataTableMessage = "No data!";
  //     }
  //   });
  // }

  addTerms() {
    this.modalRef = this.modalService.show(TermsAddComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();

    });
  }

  reLoad() {
    this.router.navigate([this.currentRouter])
  }


  editTerms(item, i) {
    var result = item;
    var index = i
    this.modalRef = this.modalService.show(TermsEditComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { index, result },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }

  getStateList() {
    this.service.getHttpService('getStateList').subscribe(response => {
      if (response.IsException == null) {
        this.result = response.responseData;
      } else {
        this.dataTableMessage = "No data!";
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

  openModal(content: string) {
    this.openmodalService.open(content, { centered: true });
  }

  openCustomerAssigned(Customercontent: string) {
    this.openmodalService.open(Customercontent, { centered: true, size: 'lg' });
  }
  openUserRight(UserRightscontent: string) {
    this.openmodalService.open(UserRightscontent, { centered: true, size: 'xl' });
  }

  deleteTerms(TermsId) {
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
          TermsId: TermsId,
        }

        this.service.postHttpService(postData, 'TermsDelete').subscribe(response => {
          if (response.status == true) {

            Swal.fire({
              title: 'Deleted!',
              text: 'Delete Terms has been deleted.',
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
          text: 'Delete Terms is safe:)',
          type: 'error'
        });
      }
    });

  }


}

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake.min.js';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataTableDirective } from 'angular-datatables';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateAddComponent } from '../../common-template/state-add/state-add.component';
import { StateEditComponent } from '../../common-template/state-edit/state-edit.component';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  HotelId;
  dataTableMessage;
  dtOptions: any = {};
  result: any = [];
  Status;
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

  }
  currentRouter = this.router.url;

  ngOnInit() {
    document.title='State List'

    this.IsViewEnabled = this.service.permissionCheck("ManageState", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageState", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageState", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageState", CONST_DELETE_ACCESS);
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

    this.service.getHttpService('getStateList').subscribe(response => {
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


  getStatesList() {
    this.service.getHttpService('getStateList').subscribe(response => {
      this.result = response.ResponseData;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }
  GetClassName(Status: string): string {
    let className: string = 'black';
    if (Status == '1') {
      this.Status = "Active"
      className = 'badge badge-success';
    }
    else if (Status == '0') {
      this.Status = "InActive"
      className = 'badge badge-warning';
    }
    return className;
  }

  addStates() {
    this.modalRef = this.modalService.show(StateAddComponent,
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
  editState(item, i) {
    var result = item;
    var index = i
    this.modalRef = this.modalService.show(StateEditComponent,
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

  deleteState(StateId) {
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
          StateId: StateId,
        }

        this.service.postHttpService(postData, 'StateDelete').subscribe(response => {
          if (response.status == true) {

            Swal.fire({
              title: 'Deleted!',
              text: 'States has been deleted.',
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
          text: 'States is safe:)',
          type: 'error'
        });
      }
    });

  }

}

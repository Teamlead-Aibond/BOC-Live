/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { ManageRrPartLocationComponent } from '../common-template/manage-rr-part-location/manage-rr-part-location.component';

@Component({
  selector: 'app-manage-part-location-list',
  templateUrl: './manage-part-location-list.component.html',
  styleUrls: ['./manage-part-location-list.component.scss']
})
export class ManagePartLocationListComponent implements OnInit {



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
  }

  currentRouter = this.router.url;

  ngOnInit() {
    document.title = 'RR Part Location List'

    this.IsViewEnabled = this.service.permissionCheck("ManageRRPartLocation", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageRRPartLocation", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageRRPartLocation", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageRRPartLocation", CONST_DELETE_ACCESS);
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

    this.service.getHttpService('RRPartLocationList').subscribe(response => {
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




  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  onDelete(RRPartLocationId) {
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
      if (result.value)
        var postData = {
          RRPartLocationId: RRPartLocationId,
        }
      this.service.postHttpService(postData, "RRPartLocationDelete").subscribe(response => {
        if (response.status == true) {

          Swal.fire({
            title: 'Deleted!',
            text: 'Record has been deleted.',
            type: 'success'
          });
          this.reLoad();
        } else {
          Swal.fire({
            title: 'Cancelled',
            text: 'Record is safe :)',
            type: 'error'
          });
        } if (
          // Read more about handling dismissals
          response.dismiss === Swal.DismissReason.cancel
        ) {

        }

      }
      )
    }

    )
  }


  addRRPartLocation() {
    var RRPartLocationId = ""
    this.modalRef = this.modalService.show(ManageRrPartLocationComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRPartLocationId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();

    });
  }

  editRRPartLocation(RRPartLocationId) {
    var RRPartLocationId = RRPartLocationId
    this.modalRef = this.modalService.show(ManageRrPartLocationComponent,
      {

        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRPartLocationId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();

    });
  }



}



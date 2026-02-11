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
import { UserRoleAddComponent } from '../common-template/user-role-add/user-role-add.component';
import { UserRoleEditComponent } from '../common-template/user-role-edit/user-role-edit.component';
import { AccessRightsComponent } from '../common-template/access-rights/access-rights.component';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
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
  IsViewRoleEnabled
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
    document.title='User Roles List'

    this.IsViewEnabled = this.service.permissionCheck("ManageUserRoles", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageUserRoles", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageUserRoles", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageUserRoles", CONST_DELETE_ACCESS);
    this.IsViewRoleEnabled = this.service.permissionCheck("ManageRolePermission", CONST_VIEW_ACCESS);

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

    this.service.getHttpService('UserRoleList').subscribe(response => {
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

  addUserRole() {
    this.modalRef = this.modalService.show(UserRoleAddComponent,
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

  editUserRole(item, i) {
    var result = item;
    var index = i;
    this.modalRef = this.modalService.show(UserRoleEditComponent,
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

  editUserRights(item, i) {
    var result = item;
    var index = i;
    var type = 1; // for User Role
    this.modalRef = this.modalService.show(AccessRightsComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { index, result, type },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      //this.UserList.push(res.data);
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

  deleteUserRole(RoleId) {
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
          RoleId: RoleId,
        }

        this.service.putHttpService(postData, 'UserRoleDelete').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'User Role has been deleted.',
              type: 'success'
            });
            this.reLoad();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'User Role is safe:)',
          type: 'error'
        });
      }
    });
  }
}

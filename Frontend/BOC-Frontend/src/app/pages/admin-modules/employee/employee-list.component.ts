/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AppConfig } from 'config';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Observable, of, Subject, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_VIEW_COST_ACCESS, EmployeeResponsibilites, EmployeeJobRole } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EmployeeComponent } from './employee/employee.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {




  baseUrl = `${environment.api.apiURL}`;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;

  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  public EmployeeNo: string;
  public EmployeeName: string;
  public EmployeeEmail: string;
  public EmployeeRFIDTagNo: string;
  public EmployeeResponsibilites: string
  public EmployeeJobRole: string

  // bread crumb items
  breadCrumbItems: Array<{}>;


  //access rights variables
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;

  EmployeeResponsibilitesList: any = []
  EmployeeJobRoleList: any = []

  constructor(public service: CommonService, private http: HttpClient,
    public router: Router, private datePipe: DatePipe, private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent, public modalRef: BsModalRef,
    private modalService: BsModalService,
  ) {

  }
  currentRouter = this.router.url;

  ngOnInit() {
    //this.dateFilter = "10/01/2020 - 10/30/2020";
    document.title = 'Employee List'

    this.EmployeeNo = '';
    this.EmployeeName = '';
    this.EmployeeEmail = '';
    this.EmployeeRFIDTagNo = '';
    this.EmployeeResponsibilites = '';
    this.EmployeeJobRole = '';
    this.getEmployeeResponsibilites()
    // this.EmployeeResponsibilitesList = EmployeeResponsibilites
    this.EmployeeJobRoleList = EmployeeJobRole

    this.dataTableMessage = "Loading...";
    this.breadCrumbItems =
      [{ label: AppConfig.app_name, path: '/' },
      { label: 'Employee', path: '/' },
      { label: 'List', path: '/', active: true }];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/employee/list';
    const that = this;
    var filterData = {}

    this.IsViewEnabled = this.service.permissionCheck("ManageEmployee", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageEmployee", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageEmployee", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageEmployee", CONST_DELETE_ACCESS);

    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {

            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data
            });
          });
      },
      buttons: {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-xs btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-xs btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-xs btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      },
      columnDefs: [
        {
          "targets": [3],
          "visible": false,
          "searchable": true
        },
      ],

      createdRow: function (row, data, index) {
        // // Set the Phone
        // if (data.EmployeeEmail != '')
        //   $('td', row).eq(3).html('<i class="mdi mdi-email mr-1"></i> ' + data.EmployeeEmail);
      },
      columns: [
        {
          data: 'EmployeeNo', name: 'EmployeeNo', className: 'text-center', searchable: true, orderable: false,
          // render: (data: any, type: any, row: any, meta) => {
          //   if (this.IsViewEnabled) {
          //     return `<a href="#" class="actionView" data-toggle='tooltip' title='View Employee' data-placement='top'>${row.EmployeeNo}</a>`;
          //   } else {
          //     return '<a  ngbTooltip="View">' + row.EmployeeNo + '</a>';
          //   }
          // }
        },
        { data: 'EmployeeName', name: 'EmployeeName', orderable: true, searchable: true, },
        { data: 'EmployeeGender', name: 'EmployeeGender', orderable: true, searchable: true },
        { data: 'EmployeeEmail', name: 'EmployeeEmail', orderable: true, searchable: true },
        { data: 'EmployeeResponsibilites', name: 'EmployeeResponsibilites', orderable: true, searchable: true },
        { data: 'EmployeeJobRole', name: 'EmployeeJobRole', orderable: true, searchable: true },
        { data: 'EmployeeRFIDTagNo', name: 'EmployeeRFIDTagNo', orderable: true, searchable: true },
        {
          data: 'EmployeeId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            // if (this.IsViewEnabled) {
            //   actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" data-toggle='tooltip' title='View Customer' data-placement='top'></a>&nbsp;`;
            // }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#" class="fa fa-edit text-secondary actionView1"data-toggle='tooltip' title='Edit Customer' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsDeleteEnabled) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete Customer' data-placement='top'></a>`;
            }
            return actiontext;
          }
        },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        // $('.actionView', row).unbind('click');
        // $('.actionView', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.navCtrl.navigate('admin/customer/view', { EmployeeId: data.EmployeeId });
        // });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onEdit(data.EmployeeId)
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.EmployeeId);
        });





        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-employee_processing').attr('style', 'display: block; z-index: 10000 !important');

      },
      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        'loadingRecords': '&nbsp;',
        'processing': 'Loading...'
      }
    };

    this.dataTable = $('#datatable-employee');
    this.dataTable.DataTable(this.dtOptions);

  }

  getEmployeeResponsibilites() {
    this.service.getHttpService("ResponsibilityDDL").subscribe(response => {
      if (response.status == true) {
        this.EmployeeResponsibilitesList  = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onFilter(event) {
    var table = $('#datatable-employee').DataTable();
    table.columns(0).search(this.EmployeeNo);
    table.columns(1).search(this.EmployeeName);
    table.columns(3).search(this.EmployeeEmail);
    table.columns(4).search(this.EmployeeResponsibilites);
    table.columns(5).search(this.EmployeeJobRole);
    table.columns(6).search(this.EmployeeRFIDTagNo);
    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-employee').DataTable();
    this.EmployeeNo = '';
    this.EmployeeName = '';
    this.EmployeeEmail = '';
    this.EmployeeResponsibilites = '';
    this.EmployeeJobRole = '';
    this.EmployeeRFIDTagNo = '';
    table.columns(0).search(this.EmployeeNo);
    table.columns(1).search(this.EmployeeName);
    table.columns(3).search(this.EmployeeEmail);
    table.columns(4).search(this.EmployeeResponsibilites);
    table.columns(5).search(this.EmployeeJobRole);
    table.columns(6).search(this.EmployeeRFIDTagNo);
    table.draw();
  }




  onDelete(EmployeeId) {
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
          EmployeeId: EmployeeId
        }

        this.service.postHttpService(postData, 'DeleteEmployee').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Employee record has been deleted.',
              type: 'success'
            });
            // Reload the table
            var table = $('#datatable-employee').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Employee is safe :)',
          type: 'error'
        });
      }
    });

  }


  onAdd() {
    var EmployeeId = ''
    this.modalRef = this.modalService.show(EmployeeComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { EmployeeId },
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
  onEdit(EmployeeId) {
    this.modalRef = this.modalService.show(EmployeeComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { EmployeeId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }



}

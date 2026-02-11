/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
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

@Component({
  selector: 'app-admin-table-list',
  templateUrl: './admin-table-list.component.html',
  styleUrls: ['./admin-table-list.component.scss']
})
export class AdminTableListComponent implements OnInit {
 
  // Datepicker
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 15 Days': [moment().subtract(14, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }

  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }  

  baseUrl = `${environment.api.apiURL}`;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dateFilter = {startDate: moment().subtract(29, 'days'), endDate: moment()};
  api_check: any;
  dataTable: any;

  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  public Photo: string;
  public Username: string;
  public FirstName: string;
  public LastName: string;
  public Status: string;
  public Email: string;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  statData: any = [];

  constructor(public service: CommonService, private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    //this.dateFilter = "10/01/2020 - 10/30/2020";

    this.Username = '';
    this.FirstName = '';
    this.LastName = '';
    this.Email = '';

    this.dataTableMessage = "Loading...";
    // this.breadCrumbItems =
      // [{ label: AppConfig.app_name, path: '/' },
      // { label: 'Customers', path: '/' },
      // { label: 'List', path: '/', active: true }];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/users/getUserListByServerSide';
    const that = this;
    var filterData = {}

    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[ 0, 'desc' ]],
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
      createdRow: function (row, data, index) {

        // Set the Customer Type
       
        // var html = '<img class="img-fluid" src="' + data.ProfilePhoto + '">';
        // $('td', row).eq(0).html(html);

        var html = '';
        if (data.ProfilePhoto != ''&&data.ProfilePhoto!=null)
         html = '<img class="img-fluid" src="' + data.ProfilePhoto + '">';
         $('td', row).eq(0).html(html);  
        
      },
      columns: [
        { data: 'ProfilePhoto', name: 'ProfilePhoto', defaultContent: '', orderable: true, searchable: true },
        { data: 'FirstName', name: 'FirstName', orderable: true, searchable: true },
        { data: 'LastName', name: 'LastName', orderable: true, searchable: true },
        { data: 'Username', name: 'Username', orderable: true, searchable: true },
        { data: 'Email', name: 'Email', orderable: true, searchable: true },
        { data: 'PhoneNo', name: 'PhoneNo', orderable: true, searchable: true },
        { data: 'Action', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `<a href="#" class="fa fa-eye text-secondary actionView" ngbTooltip="View"></a>&nbsp;
            <a href="#" class="fa fa-edit text-secondary actionView1" ngbTooltip="Edit"></a> &nbsp;
            <a href="#" class="fa fa-trash text-danger actionView3" ngbTooltip="Delete"></a>`;
          }
        }
      ],
      // rowCallback: (row: Node, data: any | Object, index: number) => {
      //   $('.actionView', row).unbind('click');
      //   $('.actionView', row).bind('click', (e) => {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     this.navCtrl.navigate('admin/customer/view', { Action: data.Action });
      //   });

      //   $('.actionView1', row).unbind('click');
      //   $('.actionView1', row).bind('click', (e) => {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     this.navCtrl.navigate('admin/customer/edit', { Action: data.Action });
      //   });

      //   $('.actionView3', row).unbind('click');
      //   $('.actionView3', row).bind('click', (e) => {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     this.onDelete(data.Action);  
      //   });

      //   return row;
      // },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };

    this.dataTable = $('#datatable-angular');
    this.dataTable.DataTable(this.dtOptions);
    
    this.onStat();
  }

  onFilter(event) {
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.FirstName);
    table.columns(2).search(this.LastName);
    table.columns(3).search(this.Username);
    table.columns(4).search(this.Email);
    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.Username = '';
    this.FirstName = '';
    this.LastName = '';
    this.Email = '';
    
    table.columns(1).search(this.FirstName);
    table.columns(2).search(this.LastName);
    table.columns(3).search(this.Username);
    table.columns(4).search(this.Email);
    table.draw();
  }

  onStat() {
    this.service.postHttpService(this.dateFilter, 'getCustomerStatistics').subscribe(response => {
      this.statData = response.responseData; 
    });
  }

  getFlag(country) {
    var flag = "assets/images/flags/" + country.toLowerCase().replace(' ', '_') + ".jpg";
    return flag;
  }

  onDelete(Action) {
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
          Action: Action
        }
        this.service.postHttpService(postData, 'getDeleteCustomer').subscribe(response => {
          if (response.IsException == null) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Customer record has been deleted.',
              type: 'success'
            });

            // Reload the table
            var table = $('#datatable-angular').DataTable();
            table.draw();
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Customer is safe :)',
              type: 'error'
            });
          }
        });
      }
    })
  } 

}

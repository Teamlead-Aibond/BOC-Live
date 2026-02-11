import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';

import { cardData } from './data';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import Swal from 'sweetalert2';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
// import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class InventoryListComponent implements OnInit {
  isCollapsed: boolean;
  public isOpen = false;
  api_check: any;
  warehouseList: any[];
  manufacturerList: any[];
  vendorList: any[];
  PartNo: string;
  WarehouseId: string;
  ManufacturerId: string;
  VendorId: string;

  private _toggleWindow() {
    this.isOpen = !this.isOpen;
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];

  constructor(private http: HttpClient, public router: Router,
    // public navCtrl: NgxNavigationWithDataComponent,
    public service: CommonService, private datepipe: DatePipe,) { }

  ngOnInit() {

    document.title = "Inventory List";

    this.loadFilters();

    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Inventory', path: '/' }, { label: 'List', path: '/', active: true }];

    // Get Card Data
    this.cardData = cardData;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/Inventory/getInventoryByServerSide';
    const that = this;
    var filterData = {}

    this.dtOptions = {
      // dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
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
            console.log("resp", resp)
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
          "targets": [1],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [2],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [3],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [4],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [5],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [6],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [7],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [8],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [9],
          "visible": false,
          "searchable": true
        },
      ],
      columns: [
        {
          data: 'PartNo', orderable: true, name: 'Created',
          render: (PartNo: any, type: any, row: any, meta) => {

            return `<div class="col-sm-12 dt_details">
            <div class="col-sm-12 col-md-2 dt_img">
                <div class="product-img text-center">
                    <img src="${row.PartImage}"
                        alt="Product Image" onerror="this.src = 'assets/images/No Image Available.png';"
                        style="width: 113px; height: 113px; border: solid 1px #1588a7;">
                </div>
            </div>
            <div class="col-sm-12 col-md-10 dt_table">
                <div class="col-sm-12">
                    <div class="form-group title">
                        <strong>
                            <a href="javascript:void(0)" title="${row.Description}" class="actionView1 product-title">
                                ${row.PartNo}
                            </a>
                        </strong>
                        <a href="javascript:void(0)" class="actionView1">
                            <span class="label label-warning pull-right">View Details</span>
                        </a>
                        <a href="javascript:void(0)" class="actionView2">
                            <span class="label label-warning pull-right">Edit</span>
                        </a>
                        <span>
                            <strong>Manufacturer</strong>: ${row.ManufacturerName}
                        </span>
                        <span>
                            <strong>Warehouse</strong>: ${row.WarehouseName}
                        </span>
                    </div>
                    <div class="form-group">
                        <div class="table-responsive">
                            <table id="dtAssetByStock"
                                class="table table-bordered table-striped footable toggle-square dataTable footable-loaded default"
                                aria-describedby="dtAssetByStock_info">
                                <thead>
                                    <tr role="row">
                                        <th data-hide="phone,tablet">${'New'}</th>
                                        <th data-hide="phone,tablet">${'Refurbrished'}</th>
                                        <th data-hide="phone,tablet">${'Opening Stock'}</th>
                                        <th data-hide="phone,tablet">${'Min Stock'}</th>
                                        <th data-hide="phone,tablet">${'Max Stock'}</th>
                                        <th data-hide="phone,tablet">${'Total Price'}</th>
                                    </tr>
                                </thead>
        
                                <tbody role="alert" aria-live="polite" aria-relevant="all">
                                    <tr class="odd footable-detail-show">
                                        <td class="text-left" style="display: table-cell;">${row.NewCount}</td>
                                        <td class="text-left" style="display: table-cell;">${row.RefurbrishedCount}</td>
                                        <td class="text-left" style="display: table-cell;">${row.OpeningStock}</td>
                                        <td class="text-left" style="display: table-cell;">${row.MinStock}</td>
                                        <td class="text-left" style="display: table-cell;">${row.MaxStock}</td>
                                        <td class="text-left" style="display: table-cell;">$${row.TotalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
          }
        },
        {
          data: 'PartNo', name: 'PartNo', orderable: true, searchable: true,
          render: (PartNo: any, type: any, row: any, meta) => {

            return '<a href="#" class="actionView1" ngbTooltip="View">' + row.PartNo + '</a>'
          }
        },
        {
          data: 'PartImage', orderable: true,
          render: (PartImage: any, type: any, row: any, meta) => {

            if (PartImage && PartImage != '' && PartImage != 'undefined' && PartImage != null)
              return '<img  class="rounded-square img-thumbnail" src="' + PartImage + '"> ';
            return '<img  class="rounded-square img-thumbnail" src="assets/images/No Image Available.png">';
          }
        },
        {
          data: 'Description', orderable: true,
          render: (data: any, type: any, row: any, meta) => {

            if (data.length > 15) { return data.substr(0, 15) + "..." } else return data;
          }
        },
        { data: 'WarehouseName', name: 'WarehouseId', orderable: true, searchable: true },
        { data: 'ManufacturerName', name: 'ManufacturerId', orderable: true, searchable: true },
        { data: 'PrimaryVendorId', name: 'PrimaryVendorId', orderable: true, searchable: true },
        {
          data: 'PartNo', className: '', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `
            New: <span class="badge badge-success btn-xs">${row.NewCount}</span><br/>
            Refurbrished: <span class="badge badge-info btn-xs">${row.RefurbrishedCount}</span>`;
          }
        },
        { data: 'OpeningStock', name: 'OpeningStock', orderable: true, searchable: true },
        { data: 'TotalPrice', name: 'TotalPrice', orderable: true, searchable: true }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          //this.editRepairRequest(data.Status);
          this.router.navigate(['admin/inventory/view'], { state: { PartId: data.PartId } });
        });

        // $('.actionView3', row).unbind('click');
        // $('.actionView3', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   // this.onDelete(data.RRId);
        // });

        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/inventory/edit'], { state: { PartId: data.PartId } });
        });
        return row;
      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };
  }

  loadFilters() {
    this.getWarehouseList();
    this.getManufacturerList();
    this.getVendorList();
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getWarehouseList() {
    this.service.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  getManufacturerList() {
    this.service.getHttpService('getManufacturerList').subscribe(response => {
      this.manufacturerList = response.responseData.map(function (value) {
        return { name: value.VendorName, "id": value.VendorId }
      });
    });
  }

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData.map(function (value) {
        return { name: value.VendorName, "id": value.VendorId }
      });
    });
  }

  getFlag(country) {
    var flag = "assets/images/flags/" + country.toLowerCase().replace(' ', '_') + ".jpg";
    return flag;
  }

  delete() {

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
        Swal.fire({
          title: 'Deleted!',
          text: 'Inventory has been deleted.',
          type: 'success'
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Inventory  is safe :)',
          type: 'error'
        });
      }
    });

  }

  onFilter(event) {
    var table = $('#datatable-angular-inv').DataTable();
    table.columns(1).search(this.PartNo);
    table.columns(4).search(this.WarehouseId);
    table.columns(5).search(this.ManufacturerId);
    table.columns(6).search(this.VendorId);

    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-angular-inv').DataTable();
    this.PartNo = '';
    this.WarehouseId = '';
    this.ManufacturerId = '';
    this.VendorId = '';
    table.columns(1).search(this.PartNo);
    table.columns(4).search(this.WarehouseId);
    table.columns(5).search(this.ManufacturerId);
    table.columns(6).search(this.VendorId);
    table.draw();


  }

}

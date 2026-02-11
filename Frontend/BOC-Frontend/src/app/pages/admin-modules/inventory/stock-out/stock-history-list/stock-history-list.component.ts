import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';

@Component({
  selector: 'app-stock-history-list',
  templateUrl: './stock-history-list.component.html',
  styleUrls: ['./stock-history-list.component.scss']
})
export class StockHistoryListComponent implements OnInit {

  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  rfidEnabled: boolean = false;

  constructor(public service: CommonService, private http: HttpClient, public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private rFIDCheckResolver: RFIDCheckResolver
  ) { }

  ngOnInit(): void {
    this.rFIDCheckResolver.isEnabled$.subscribe(enabled => {
      this.rfidEnabled = enabled;
      this.onList();
    });


  }


  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/InventoryStockout/StockOutHistoryList';
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
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            //console.log('vendors', resp)
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



      },
      columns: [
        {
          data: 'PartNo', name: 'PartNo', defaultContent: '', orderable: true, searchable: false,
          // render: (data: any, type: any, row: any, meta) => {
          //   return '<a href="#" class="actionView" ngbTooltip="View">' + row.PartNo + '</a>';
          // }
        },
        { data: 'SerialNo', name: 'SerialNo', orderable: true, searchable: false },
        { data: 'RFIDTagNo', name: 'RFIDTagNo', orderable: true, searchable: false, visible: this.rfidEnabled },
        { data: 'WarehouseName', name: 'WarehouseName', orderable: true, searchable: false },
        // { data: 'PhoneNoPrimary', name: 'PhoneNoPrimary', orderable: true, searchable: true },
        { data: 'WarehouseSub1Name', name: 'WarehouseSub1Name', orderable: true, searchable: false },
        { data: 'WarehouseSub2Name', name: 'WarehouseSub2Name', orderable: true, searchable: false },
        { data: 'WarehouseSub3Name', name: 'WarehouseSub3Name', orderable: true, searchable: false },
        { data: 'WarehouseSub4Name', name: 'WarehouseSub4Name', orderable: true, searchable: false },
        // {
        //   data: 'StockOutId', className: 'text-center', orderable: true,
        //   render: (data: any, type: any, row: any, meta) => {
        //     // Ref: https://github.com/l-lin/angular-datatables/issues/979
        //     return `<a href="#" class="fa fa-trash text-danger actionView1" ngbTooltip="Delete"></a>
        //     <a href="#" class="fe-printer" text-primary actionView2" ngbTooltip="Packing Slip"></a>`;
        //   }
        // }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

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

    this.dataTable = $('#datatable-angular');
    this.dataTable.DataTable(this.dtOptions);
  }

}

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartQuantityPopupComponent } from './part-quantity-popup/part-quantity-popup.component';
import { booleanValues } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-total-part-list',
  templateUrl: './total-part-list.component.html',
  styleUrls: ['./total-part-list.component.scss']
})
export class TotalPartListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  booleanValues = booleanValues
  IsEcommerceProduct = '';
  constructor(public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
    private http: HttpClient,
    public modalRef: BsModalRef, private modalService: BsModalService,
    private openmodalService: NgbModal,) { }
  currentRouter = this.router.url;
  ngOnInit(): void {
    document.title = 'Total Parts List'

    this.onTotalPartList();
  }

  onTotalPartList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/parts/PartsListByServerSide';
    const that = this;
    var filterData = {}
    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
        });
    };

    this.dtOptions["columns"] = [
      { data: 'PartNo', width: '15%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '65%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'Price', width: '10%', name: 'Price', defaultContent: '', orderable: true, searchable: true },
      { data: 'IsEcommerceProduct', width: '10%', name: 'IsEcommerceProduct', defaultContent: '', orderable: true, searchable: true },
      {
        data: 'PartId', width: '10%', name: 'PartId', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return `<a href="#" class="fa fa-eye text-secondary actionView1" ngbTooltip="View"></a>&nbsp;
          <a href="#" class="fa fa-edit text-secondary actionView" ngbTooltip="Edit"></a>&nbsp `;
          // <a href="#" class="fa fa-list text-secondary actionView2" ngbTooltip="View">`;
        }
      },
    ];

    this.dataTable = $('#datatable-angular-partslist');
    this.dataTable.DataTable(this.dtOptions);
  }
  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      autoWidth: false,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
        dom: {
          button: {
            className: ''
          }

        },
        buttons: []
      },


      //columnDefs: [{width: '10%', targets:0}],
      columnDefs: [
        {
          "targets": [3],
          "visible": false,
          "searchable": true
        },

      ],

      createdRow: function (row, data, index) {
        var html = '<span>' + data.Price + '</span>'
        $('td', row).eq(2).html(html);

      },
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/parts-edit'], { state: { PartId: data.PartId } });
        });
        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/parts-view'], { state: { PartId: data.PartId } });
        });
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.addPartQuantity(data)

          // this.router.navigate(['/admin/parts-view'], { state: { PartId: data.PartId } });
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#ldatatable-angular-partslist_processing').attr('style', 'display: block; z-index: 10000 !important');

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
  }
  addPartQuantity(data) {
    this.modalRef = this.modalService.show(PartQuantityPopupComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { data },
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

  onFilter(event) {

    var table = $('#datatable-angular-partslist').DataTable();
    table.columns(3).search(this.IsEcommerceProduct);
    // table.columns(6).search(localStorage.getItem("IdentityId"));
    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-angular-partslist').DataTable();
    this.IsEcommerceProduct = '';
    table.columns(3).search(this.IsEcommerceProduct);
    table.draw();
  }
}

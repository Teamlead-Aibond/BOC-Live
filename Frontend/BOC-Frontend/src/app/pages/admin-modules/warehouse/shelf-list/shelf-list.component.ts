/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { ShelfComponent } from '../../common-template/shelf/shelf.component';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


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
    private modalService: BsModalService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {
  }

  currentRouter = this.router.url;

  ngOnInit() {
    document.title='Shelf List'

    this.IsViewEnabled = this.service.permissionCheck("ManageShelf", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageShelf", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageShelf", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageShelf", CONST_DELETE_ACCESS);
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

    this.service.getHttpService('getWarehouseSub3List').subscribe(response => {
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

  


  onDelete(WarehouseSub3Id){
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
        var postData={
          WarehouseSub3Id:WarehouseSub3Id,
          }
            this.service.postHttpService(postData,"deleteWarehouseSub3").subscribe(response => {
            if (response.status == true) {
               
            Swal.fire({
                title: 'Deleted!',
                text: 'Record has been deleted.',
                type: 'success'
            });
            this.reLoad();
        } else{
          Swal.fire({
            title: 'Cancelled',
            text: 'Record is safe :)',
            type: 'error'
        });
        } if (
            // Read more about handling dismissals
            response.dismiss === Swal.DismissReason.cancel
        )
  
    {
           
        }
    
}
)}

    )}

    addShelf() {
      var WarehouseSub3Id = ""
      this.modalRef = this.modalService.show(ShelfComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick:false,
          initialState: {
            data: { WarehouseSub3Id },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });
  
      this.modalRef.content.closeBtnName = 'Close';
  
      this.modalRef.content.event.subscribe(res => {
        this.reLoad();
  
      });
    }
  
    editShelf(WarehouseSub3Id) {
      var WarehouseSub3Id = WarehouseSub3Id
      this.modalRef = this.modalService.show(ShelfComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick:false,
          initialState: {
            data: { WarehouseSub3Id },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });
  
      this.modalRef.content.closeBtnName = 'Close';
  
      this.modalRef.content.event.subscribe(res => {
        this.reLoad();
  
      });
    }
  

}

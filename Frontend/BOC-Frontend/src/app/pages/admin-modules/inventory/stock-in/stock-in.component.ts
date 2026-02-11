import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { cardData } from './data';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import pdfMake from 'pdfmake/build/pdfmake.min.js';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CommonService } from 'src/app/core/services/common.service';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss'],
  // providers: [BsModalService]
})
export class StockInComponent implements OnInit {

  isCollapsed: boolean;
  public isOpen = false;
  AddForm: FormGroup;
  PONumber: string = "";
  PODetails: any;
  PartId: any;
  ResPartNo: string = "";
  Part: any;
  WarehouseId: any;
  WarehouseName: string;
  SearchForm: FormGroup;
  rfidEnabled: boolean = false;


  private _toggleWindow() {
    this.isOpen = !this.isOpen;
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();

  // bread crumb items
  breadCrumbItems: Array<{}>;

  canStock: boolean = false;
  // Card Data
  cardData: any;
  tableData: any = [];
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  StockQuantity: Number = 1;

  constructor(
    private httpClient: HttpClient,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private fb: FormBuilder,
    private service: CommonService,
    private rFIDCheckResolver: RFIDCheckResolver,
    public navCtrl: NgxNavigationWithDataComponent,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {


    this.rFIDCheckResolver.isEnabled$.subscribe(enabled => {
      this.rfidEnabled = enabled;
    });

    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    // this.breadCrumbItems = [{ label: 'AH Group', path: '/' }, { label: 'Inventory', path: '/' }, { label: 'List', path: '/', active: true }];

    // Get Card Data
    this.cardData = cardData;

    this.AddForm = this.fb.group({
      InventoryStockInList: this.fb.array([
      ]),
      Attachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]]
    })

    this.SearchForm = this.fb.group({
      WarehouseId: [""],
      WarehouseSub1Id: [""],
      WarehouseSub2Id: [""],
      WarehouseSub3Id: [""],
      WarehouseSub4Id: [""],
      PartNo: [""],
      Quantity: [0],
      PONumber: [""]
    })

    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();
  }

  getWarehouseList() {
    this.service.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  getWarehouseSub1List() {
    this.service.getHttpService('getWarehouseSub1List').subscribe(response => {
      this.warehouse1List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub1Name, "id": value.WarehouseSub1Id }
      });
    });
  }

  getWarehouseSub2List() {
    this.service.getHttpService('getWarehouseSub2List').subscribe(response => {
      this.warehouse2List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub2Name, "id": value.WarehouseSub2Id }
      });
    });
  }

  getWarehouseSub3List() {
    this.service.getHttpService('getWarehouseSub3List').subscribe(response => {
      this.warehouse3List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub3Name, "id": value.WarehouseSub3Id }
      });
    });
  }

  getWarehouseSub4List() {
    this.service.getHttpService('getWarehouseSub4List').subscribe(response => {
      this.warehouse4List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub4Name, "id": value.WarehouseSub4Id }
      });
    });
  }

  public addReference(qty = 1): void {
    const refArray = <FormArray>this.AddForm.controls.InventoryStockInList;
    for (let index = 0; index < qty; index++) {
      refArray.push(this.initReference());
    }
  }

  public resetInventoryStockInList(): void {
    const refArray = <FormArray>this.AddForm.controls.InventoryStockInList;
    refArray.clear();
  }


  public initReference(): FormGroup {

    let { WarehouseId,
      WarehouseSub1Id,
      WarehouseSub2Id,
      WarehouseSub3Id,
      WarehouseSub4Id
    } = this.SearchForm.value;
    return this.fb.group({

      SerialNo: ["", Validators.required],
      SellingPrice: ["0", Validators.required],
      IsNew: ["1"],
      Quantity: [1],
      WarehouseId: [WarehouseId ? WarehouseId : "", Validators.required],
      WarehouseSub1Id: [WarehouseSub1Id ? WarehouseSub1Id : "", Validators.required],
      WarehouseSub2Id: [WarehouseSub2Id ? WarehouseSub2Id : "", Validators.required],
      WarehouseSub3Id: [WarehouseSub3Id ? WarehouseSub3Id : "", Validators.required],
      WarehouseSub4Id: [WarehouseSub4Id ? WarehouseSub4Id : "", Validators.required],
      RFIDTagNo: [""]
    });
  }

  get AddFormControl() {
    return this.AddForm.controls;
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  searchByPONumber() {
    this.resetInventoryStockInList();
    let searchValues = this.SearchForm.value;
    this.service.postHttpService({ PoNo: searchValues.PONumber }, 'GetPODetails').subscribe(response => {
      if (response.status == true && response.responseData.length > 0) {

        this.PODetails = response.responseData[0];
        this.PartId = this.PODetails.PartId;
        this.ResPartNo = this.PODetails.PartNo;
        this.addReference(this.PODetails.Quantity);
        this.canStock = true;
      } else {
        this.PODetails = [];
        this.PartId = "";
        this.ResPartNo = "";
        this.canStock = false;
        Swal.fire({
          title: 'Error!',
          text: 'PO Number not found!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
    });
  }

  searchByPartNo() {

    let searchValues = this.SearchForm.value;
    if (!searchValues.Quantity || searchValues.Quantity <= 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Quantity should be greater that 0',
        type: 'warning',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      return;
    }
    this.resetInventoryStockInList();
    this.ResPartNo = "";
    this.service.postHttpService({ PartNo: searchValues.PartNo }, 'GetPartByPartNo').subscribe(response => {
      if (response.status == true) {
        if (response.responseData.length > 0) {
          this.Part = response.responseData[0];
          this.PartId = this.Part.PartId;
          this.ResPartNo = searchValues.PartNo;
          this.WarehouseName = this.Part.WarehouseName;
          this.WarehouseId = this.Part.WarehouseId;
          this.canStock = true;
          this.addReference(searchValues.Quantity);
        } else {
          this.Part = {};
          this.PartId = "";
          this.ResPartNo = "";
          this.canStock = false;
          this.WarehouseName = "";
          this.WarehouseId = "";
          Swal.fire({
            title: 'Error!',
            text: 'Part Number not found!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          })
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
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

  onStockIn(print = false) {
    let body = this.AddForm.value;
    if (body) {
      if (this.AddForm.invalid) {
        this.AddForm.markAllAsTouched();
        // this.markFormGroupTouched(this.AddForm);
        Swal.fire({
          title: 'Error!',
          text: 'Record could not be saved! Fill all required (*) fields!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        return;
      }

      this.service.postHttpService({ ...body, ...{ PartId: this.PartId, WarehouseId: this.WarehouseId } }, "addNewPartItems").subscribe(response => {
        console.log(response, "response")

        if (response.status == true) {

          if (!print) {
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
            this.navCtrl.navigate('/admin/inventory/stockin-list');
          }

          // this.navCtrl.navigate('/admin/inventory/list');

          // this.router.navigate(['/repair-request/edit']);
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message || 'Record could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

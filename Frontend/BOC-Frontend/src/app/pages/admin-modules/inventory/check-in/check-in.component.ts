import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, of, Subject, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, catchError, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  Form: FormGroup
  NewCheckInForm: FormGroup
  PartId
  submitted: boolean = false
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  vendorList
  manufacturerList
  filteredData: any[];
  keyword = 'PartNo';
  task = 'Check In';
  isLoading: boolean = false;
  data2 = [];
  parts$: Observable<any> = of([]);
  //public onEvent: Subject<any>;
  ImagesList: any = [];
  partsInput$ = new Subject<string>();
  Isnewcheckin: boolean = false;

  public event: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder, private service: CommonService, public modalRef: BsModalRef,
    @Inject(BsModalRef) public data: any, private cd_ref: ChangeDetectorRef,) { }

  ngOnInit(): void {

    //this.onEvent = new Subject();
    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();
    this.loadParts();
    this.getVendorList();
    this.getManufacturerList();

    this.Form = this.fb.group({
      Part: [''],
      PartNo: ["", Validators.required],
      SerialNo: ["", Validators.required],
      IsNew: ["1"],
      PartItemId: ["0"],
      PartId: [],
      Quantity: [1],
      WarehouseId: [''],
      WarehouseSub1Id: [''],
      WarehouseSub2Id: [''],
      WarehouseSub3Id: [''],
      WarehouseSub4Id: [''],
      RFIDTagNo: [""],
      RFIDEmployeeNo: [""]
    })

    this.Form.patchValue({
      Part: this.data.PartNo,
      PartNo: this.data.PartNo,
      PartId: this.data.PartId,
      SerialNo: this.data.SerialNo,
      RFIDTagNo: this.data.RFIDTagNo,
      RFIDEmployeeNo: this.data.RFIDEmployeeNo
    })
    this.PartId = this.data.PartId;

    if (this.data.type == 'Update') {
      this.task = 'Update';
      this.Form.patchValue({
        Part: this.data.inventory.PartNo,
        PartNo: this.data.inventory.PartNo,
        PartItemId: this.data.inventory.PartItemId,
        PartId: this.data.inventory.PartId,
        SerialNo: this.data.inventory.SerialNo,
        RFIDTagNo: this.data.inventory.RFIDTagNo,
        RFIDEmployeeNo: this.data.inventory.RFIDEmployeeNo,
        IsNew: this.data.inventory.IsNew,
        WarehouseId: this.data.inventory.WarehouseId,
        WarehouseSub1Id: this.data.inventory.WarehouseSub1Id,
        WarehouseSub2Id: this.data.inventory.WarehouseSub2Id,
        WarehouseSub3Id: this.data.inventory.WarehouseSub3Id,
        WarehouseSub4Id: this.data.inventory.WarehouseSub4Id
      })
    }

    this.NewCheckInForm = this.fb.group({
      Part: [""],
      PartNo: ['', Validators.required],
      Description: [''],
      ManufacturerId: [''],
      ManufacturerPartNo: [''],
      UnitType: [''],
      StoreSince: [],
      PrimaryVendorId: [''],
      IsActive: [true],
      TaxType: [''],
      SellingPrice: [''],
      SellingPriceDescription: [''],

      BuyingPrice: [''],
      BuyingPriceDescription: [''],
      WarehouseId: [''],
      OpeningStock: [0],
      MinStock: [0],
      MaxStock: [0],
      Attachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]]
    })
  }

  toDate(dateStr) {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      const obj = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day.split(' ')[0].trim())
      };
      return obj;
    }
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

  get FormControl() {
    return this.Form.controls;
  }
  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData.map(function (value) {
        return { name: value.VendorName, id: value.VendorId }
      });
    });
  }

  getManufacturerList() {
    this.service.getHttpService('getManufacturerList').subscribe(response => {
      this.manufacturerList = response.responseData.map(function (value) {
        return { name: value.VendorName, id: value.VendorId }
      });
    });
  }

  onSubmit() {
    this.submitted = true
    let body = this.Form.value;
    if (body) {
      if (this.Form.valid) {

        // if (this.Form.invalid) {
        //   //this.Form.markAllAsTouched();
        //   // this.markFormGroupTouched(this.AddForm);
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'Record could not be saved! Fill all required (*) fields!',
        //     type: 'warning',
        //     confirmButtonClass: 'btn btn-confirm mt-2'
        //   });
        //   return;
        // }

        //var this.Form.value.WarehouseId;

        var postData;
        if (this.task == 'Update') {
          postData = {
            InventoryStockInList: [body],
            PartId: this.Form.value.PartId,
            PartItemId: this.Form.value.PartItemId,
            WarehouseId: this.Form.value.WarehouseId
          }
          //console.log('postData', postData);

          this.service.postHttpService(postData, "updateNewPartItems").subscribe(response => {
            //console.log(response, "responsePart")

            if (response.status == true) {
              this.triggerEvent(response);
              this.modalRef.hide();
              //this.onEvent.next(true)
              Swal.fire({
                title: 'Success!',
                text: 'Part Location updated successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });

            } else {
              //this.onEvent.next(false)
              Swal.fire({
                title: 'Error!',
                text: response.message || 'Part Location could not be updated!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        } else {
          postData = {
            InventoryStockInList: [body],
            PartId: this.Form.value.PartId,
            WarehouseId: this.Form.value.WarehouseId
          }

          this.service.postHttpService(postData, "addNewPartItems").subscribe(response => {
            //console.log(response, "responsePart")

            if (response.status == true) {
              this.triggerEvent(response);
              this.modalRef.hide();
              //this.onEvent.next(true)
              Swal.fire({
                title: 'Success!',
                text: 'Part checked-in successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });

            } else {
              //this.onEvent.next(false)
              Swal.fire({
                title: 'Error!',
                text: response.message || 'Part could not be saved!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
      }
    }
  }

  selectEvent(item) {
    this.PartId = item.PartId;
      
    this.Form.patchValue({
      PartNo: item.PartNo,      
      PartId: item.PartId
    })
  }

  loadParts() {
    this.parts$ = concat(
      of([]), // default items
      this.partsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchParts(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }

  searchParts(term: string = ""): Observable<any> {
    var postData = {
      "PartNo": term
    }
    return this.service.postHttpService(postData, "getonSearchPartByPartNo")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }

  get FormControl2() {
    return this.NewCheckInForm.controls;
  }
  
  onNewCheckINSubmit() {
    this.submitted = true
    if (this.NewCheckInForm.valid) {
      let body = this.NewCheckInForm.value;
      if (body.StoreSince) {
        body.StoreSince = this.dateToString(body.StoreSince);
      }
      let api = "InventoryPartAdd";
      if (body) {

        if (this.ImagesList.length > 0) {
          body.ImagesList = this.ImagesList;
        }

        if (body.PartId) {
          api = "InventoryPartUpdate";
        } else {
          if (body.ImagesList)
            body.ImagesList = body.ImagesList.filter(a => !a.IsDeleted);
        }

        this.service.postHttpService(body, api).subscribe(response => {
          console.log(response, "response")

          if (response.status == true) {
            this.Isnewcheckin = false
            this.Form.patchValue({
              Part: response.responseData.PartNo,
              PartNo: response.responseData.PartNo,
              PartId: response.responseData.data,
            })

            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });

          } else {
            Swal.fire({
              title: 'Error!',
              text: response.message || 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
        }, error => console.log(error));
      }
    }
  }

  onNewCheckin() {
    this.Isnewcheckin = true
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

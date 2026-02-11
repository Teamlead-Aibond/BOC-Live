import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import Swal from 'sweetalert2';
import { RfReader } from '../../rfid-integration/rfid-integration.metadata';
import { RfIdIntegrationService } from '../../rfid-integration/rfid-integration.service';
import { Subscription } from 'rxjs/Subscription';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss']
})
export class InventoryAddComponent implements OnInit, OnDestroy {
  AddForm: FormGroup;
  vendorList: any[];
  manufacturerList: any[];
  partList: any[];
  submitted = false;
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  ImagesList: any = [];
  Attachment;
  spinner: boolean = false;
  editMode: boolean = false;

  rfIdReaderData: RfReader[] = [];
  selectedRfid: string = "";
  subscription: Subscription;
  rfIdReaderForm: FormGroup;
  PartId: any;
  statusFilterId: any;
  fileData: any;
  imageresult: any;
  rfidEnabled: boolean = false;


  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
    private rfIdIntegrationService: RfIdIntegrationService,
    private rFIDCheckResolver: RFIDCheckResolver,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
  ) {

    this.initForm()
    this.AddForm = this.fb.group({
      PartId: [""],
      PartNo: ['', Validators.required],
      Description: [''],
      ManufacturerId: ['', Validators.required],
      ManufacturerPartNo: [''],
      UnitType: ['', Validators.required],
      StoreSince: [null, Validators.required],
      PrimaryVendorId: ['', Validators.required],
      IsActive: [true],
      TaxType: ['', Validators.required],
      SellingPrice: ['', Validators.required],
      SellingPriceDescription: [''],

      BuyingPrice: ['', Validators.required],
      BuyingPriceDescription: [''],
      WarehouseId: ['', Validators.required],
      OpeningStock: [0, Validators.required],
      MinStock: [0, Validators.required],
      MaxStock: [0, Validators.required],
      PartItems: this.fb.array([
        this.fb.group({
          PartItemId: [""],
          InventoryId: [""],
          SerialNo: ["", Validators.required],
          SellingPrice: ["0", Validators.required],
          IsNew: ["1"],
          Quantity: [1],
          WarehouseSub1Id: ["", Validators.required],
          WarehouseSub2Id: ["", Validators.required],
          WarehouseSub3Id: ["", Validators.required],
          WarehouseSub4Id: ["", Validators.required],
          RFIDTagNo: ["", Validators.nullValidator]
        })
      ]),
      Attachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]]
    })
  }

  ngOnInit(): void {

    document.title = "Add Inventory";
    this.rFIDCheckResolver.isEnabled$.subscribe(enabled => this.rfidEnabled = enabled);

    this.PartId = history.state.PartId;

    this.getVendorList();
    this.getManufacturerList();

    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();

    if (this.PartId) {
      this.editMode = true;

      this.service.postHttpService({ PartId: this.PartId }, 'getInventoryView').subscribe(response => {


        let inventoryData = response.responseData;
        this.resetPartItemsList();
        this.addReference(inventoryData.dataItems.length);
        this.AddForm.patchValue({
          PartId: this.PartId,
          PartNo: inventoryData.data.PartNo,
          Description: inventoryData.data.Description,
          ManufacturerId: inventoryData.data.ManufacturerId,
          ManufacturerPartNo: inventoryData.data.ManufacturerPartNo,
          UnitType: inventoryData.data.UnitType,
          StoreSince: this.toDate(inventoryData.data.StoreSince),
          PrimaryVendorId: inventoryData.data.PrimaryVendorId,
          IsActive: inventoryData.data.IsActive,
          TaxType: inventoryData.data.TaxType,
          SellingPrice: inventoryData.data.SellingPrice,
          SellingPriceDescription: inventoryData.data.SellingPriceDescription,

          BuyingPrice: inventoryData.data.BuyingPrice,
          BuyingPriceDescription: inventoryData.data.BuyingPriceDescription,
          WarehouseId: inventoryData.data.WarehouseId,
          OpeningStock: inventoryData.data.OpeningStock,
          MinStock: inventoryData.data.MinStock,
          MaxStock: inventoryData.data.MaxStock,
          PartItems:
            inventoryData.dataItems.map(a => {
              return {
                PartItemId: a.PartItemId,
                InventoryId: a.InventoryId,
                SerialNo: a.SerialNo,
                SellingPrice: a.SellingPrice,
                IsNew: a.IsNew,
                Quantity: 1,
                WarehouseSub1Id: a.WarehouseSub1Id,
                WarehouseSub2Id: a.WarehouseSub2Id,
                WarehouseSub3Id: a.WarehouseSub3Id,
                WarehouseSub4Id: a.WarehouseSub4Id,
                RFIDTagNo: a.RFIDTagNo
              }
            })
        })
        this.service.postHttpService({ PartId: this.PartId }, 'ViewPartImages').subscribe(PartImages => {
          this.imageresult = PartImages.responseData;
          for (var x in this.imageresult) {
            this.ImagesList.push({
              "IdentityType": "0", // For RR
              "path": this.imageresult[x].ImagePath,
              "originalname": this.imageresult[x].ImageOriginalFile,
              "mimetype": this.imageresult[x].ImageMimeType,
              "size": this.imageresult[x].ImageSize,
              "PartImageId": this.imageresult[x].PartImageId,
              "IsDeleted": 0,
            });
            console.log('ImagesList', this.ImagesList)
          }
        });
      });
    }

  }

  removeImage(imgIndex) {
    this.ImagesList[imgIndex].IsDeleted = 1;
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

  public addReference(qty = 1): void {
    const refArray = <FormArray>this.AddForm.controls.PartItems;
    for (let index = 0; index < qty; index++) {
      refArray.push(this.initReference());
    }
  }

  public resetPartItemsList(): void {
    const refArray = <FormArray>this.AddForm.controls.PartItems;
    refArray.clear();
  }

  public initReference(): FormGroup {
    return this.fb.group({
      PartItemId: [""],
      InventoryId: [""],
      SerialNo: ["", Validators.required],
      SellingPrice: ["0", Validators.required],
      IsNew: ["1"],
      Quantity: [1],
      WarehouseSub1Id: ["", Validators.required],
      WarehouseSub2Id: ["", Validators.required],
      WarehouseSub3Id: ["", Validators.required],
      WarehouseSub4Id: ["", Validators.required],
      RFIDTagNo: ["", Validators.nullValidator]
    });
  }

  get Ref(): FormArray {
    return this.AddForm.get('PartItems') as FormArray;
  }

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

  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;

  onFormSubmit(print = false) {
    this.submitted = true;
    if (this.AddForm.invalid) {
      // this.markFormGroupTouched(this.AddForm);
      this.AddForm.markAllAsTouched();
      Swal.fire({
        title: 'Error!',
        text: 'Record could not be saved! Fill all required (*) fields!',
        type: 'warning',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      return;
    }

    let body = { ...this.AddForm.value };
    body.StoreSince = this.dateToString(body.StoreSince);
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

          if (!print) {
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
            this.navCtrl.navigate('/admin/inventory/list');
          } else {
            this.print();
          }
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

  initForm() {
    this.rfIdReaderForm = new FormGroup({
      //Node Service Url to connect with reader API
      //'interfaceUrl': new FormControl('http://localhost:3000/'),
      //Reader REST API Host API Path
      //'readerHostApiPath': new FormControl('http://impinj-14-04-4f/api/v1/'),
      //Reader Antenna congiguration preset name (default: configured to antenna 1) 
      'readerHostApiPath': new FormControl('http://impinj-14-04-4f/api/v1/'),
      'presetName': new FormControl('default'),
      'productCode': new FormControl('AAAAAAAAAAAAABMl')
    });
  }

  fileProgressMultiple(event: any) {

    this.fileData = event.target.files[0];
    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }
    this.spinner = true;
    //console.log(this.AddFormControl.Attachment.valid)
    if (this.AddFormControl.Attachment.valid == true) {
      this.service.postHttpImageService(formData, "PartImageupload").subscribe(response => {
        this.imageresult = response.responseData;

        for (var x in this.imageresult) {

          this.ImagesList.push({
            "IdentityType": "0", // For RR
            "path": this.imageresult[x].location,
            "originalname": this.imageresult[x].originalname,
            "mimetype": this.imageresult[x].mimetype,
            "size": this.imageresult[x].size,
            "IsDeleted": 0
          });
          console.log('ImagesList', this.ImagesList)
        }
        this.spinner = false;

        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }

  print() {
    let formData = { ...this.AddForm.value };

    if (formData.PartItems.filter(a => a.PartItemId == "").length <= 0) {
      Swal.fire({
        title: 'Success!',
        text: 'Saved successfully. No new part items found to print!',
        type: 'success',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      this.navCtrl.navigate('/admin/inventory/list');
    } else {

      this.modalRef.content.closeBtnName = 'Close';
      this.navCtrl.navigate('/admin/inventory/list');
    }
  }

  //get form validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { boolean, booleanValues, Const_Alert_pop_title, months } from 'src/assets/data/dropdown';
import { LocalStorageService } from '../../inventory/local-storage.service';
import * as printJS from 'print-js'
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-incoming-repair-tracker-side',
  templateUrl: './incoming-repair-tracker-side.component.html',
  styleUrls: ['./incoming-repair-tracker-side.component.scss']
})
export class IncomingRepairTrackerSideComponent implements OnInit {
  submitted: boolean;
  WorksheetError: boolean = false;
  selectedWorksheet: any;
  viewresult: any;
  WorksheetBackup: any;
  incomingWorksheetTitle: any;
  spinner: boolean = false;
  outgoingWorksheetTitle: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    private localStorageService: LocalStorageService,
    private _FileSaverService: FileSaverService,
    @Inject(BsModalRef) public data: any) { }
  public event: EventEmitter<any> = new EventEmitter();

  Form: FormGroup;
  WorksheetId: any;
  Worksheet: any;
  RRId: any;
  Type: any;
  RRImages: any;
  CustomerName: any;
  RRInfo: any;
  RRDescription: any;
  RRNo: any;
  booleanValues = boolean;
  months = months;
  boolean = booleanValues;
  currentYear = new Date().getFullYear();
  title = 'Add Incoming Repair Report'
  WorksheetValue: any;
  model: any;
  DataForm: FormGroup = new FormGroup({});
  comments: any;
  multiPDF: boolean = false;
  ngOnInit(): void {
    console.log(this.data.RRImages);
    this.WorksheetId = this.data.WorksheetId;
    this.Worksheet = this.data.Worksheet;
    this.RRId = this.data.RRId;
    this.Type = this.data.Type;
    this.RRImages = this.data.RRImages ? this.data.RRImages : [];
    this.CustomerName = this.data.CustomerName ? this.data.CustomerName : '';
    this.RRInfo = this.data.RRInfo ? this.data.RRInfo : [];
    this.RRDescription = this.data.RRDescription ? this.data.RRDescription : '';
    this.RRNo = this.data.RRNo ? this.data.RRNo : '';
    this.WorksheetBackup = this.data.Worksheet;
    this.comments = this.data.comments;
    this.localStorageService.saveData('routecausecomments', JSON.stringify(this.comments));
    this.localStorageService.saveData('Worksheetincoming', JSON.stringify(this.Worksheet));
    const sws =  this.localStorageService.getData('selectedworksheet');
    if(sws == null){
      this.Type = 0;
    }
    if (this.Type == 2) {
      this.findWorksheetDetails();
      this.title = 'Edit Incoming Repair Report'
    }
    if (this.Type == 3) {
      this.findWorksheetDetails();
      this.title = 'Repair Analysis Report'
    }
    var selectedoutgoingWorksheet = this.localStorageService.getData('selectedoutgoingWorksheet');
      if(selectedoutgoingWorksheet != null){
        this.multiPDF = true;
      }else{
        this.multiPDF = false;
      }
  }

  findWorksheetDetails() {
    const result = this.localStorageService.getData('worksheetformdata');
    this.viewresult = this.localStorageService.getData('worksheetformdata');
    // console.log(this.viewresult);
    const selectedworksheet = this.localStorageService.getData('selectedworksheet');
    this.incomingWorksheetTitle = this.localStorageService.getData('selectedworksheet');
    this.outgoingWorksheetTitle = this.localStorageService.getData('selectedworksheetoutgoing');
    console.log(this.localStorageService.getData('selectedworksheet'));
    console.log(selectedworksheet);
    if(selectedworksheet != '' && selectedworksheet != undefined){
      const data = Object.keys(this.Worksheet).
      filter((key) => key.includes(selectedworksheet)).
      reduce((cur, key) => { return this.Worksheet[key]}, {});
      console.log(data);
      this.DataForm = this.generateFormControls1(data, result);
      this.selectedWorksheet = data;
      Object.values(this.selectedWorksheet).forEach(function (element) {
        element['dataValue'] = result[element['Name']];
      });
      this.localStorageService.saveData('selectedincomingWorksheet', JSON.stringify(this.selectedWorksheet));
    }
    // let postData = { RRGMTrackerId: this.WorksheetId }

    // this.commonService.postHttpService(postData, "viewGMRepairTrackerInfo").subscribe(response => {
    //   if (response.status == true) {
    //     let result = response.responseData
    //     this.Form.patchValue({
    //       RRId: this.RRId,
    //       RRGMTrackerId: result.RRGMTrackerId,
    //       IsBroken: result.IsBroken,
    //       ApprovedFor: result.ApprovedFor,
    //       ReasonForFailure: result.ReasonForFailure,
    //       FailedOnInstall: result.FailedOnInstall,
    //       FailedOnInstallNotes: result.FailedOnInstallNotes,
    //       Requestor: result.Requestor,
    //       GCCLItem: result.GCCLItem,
    //       RepairWarrantyExpiration: result.RepairWarrantyExpiration,
    //       OpenOrderStatus: result.OpenOrderStatus,
    //       AccountValuationClass: result.AccountValuationClass,
    //       ReceiptMonth: result.ReceiptMonth,
    //       ReceiptYear: result.ReceiptYear,
    //       CoreReturnMonth: result.CoreReturnMonth,
    //       CoreReturnYear: result.CoreReturnYear,
    //       IsScrap: result.IsScrap
    //     })
    //   }

    //   this.cd_ref.detectChanges();
    // }, error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {

      let body = { ... this.Form.value }
      if (body.RRGMTrackerId != '' && body.RRGMTrackerId != null &&
        body.RRGMTrackerId != undefined) {
        this.commonService.putHttpService(body, "updateGMRepairTrackerInfo").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: response.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      } else {
        this.commonService.postHttpService(body, "createGMRepairTrackerInfo").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: response.message,
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  selectSheet(){
    // console.log(this.WorksheetValue);
    if(this.WorksheetValue == undefined){
      console.log(this.WorksheetValue);
      this.WorksheetError = true;
    }else{
      this.incomingWorksheetTitle = this.WorksheetValue;
      this.localStorageService.saveData('selectedworksheet', JSON.stringify(this.WorksheetValue));
      this.WorksheetError = false;
      this.Type = 1;
      console.log(this.Worksheet);
      const data = Object.keys(this.Worksheet).
      filter((key) => key.includes(this.WorksheetValue)).
      reduce((cur, key) => { return this.Worksheet[key]}, {});
      console.log(data);
      this.DataForm = this.generateFormControls(data);

      this.selectedWorksheet = data;
      this.cd_ref.detectChanges();
      
    }
  }

  generateFormControls(formData: any)
    {
        let tempGroup: FormGroup = new FormGroup({});
        formData.forEach(i=>{
            tempGroup.addControl(i.Name, new FormControl(''))
        })
        return tempGroup;
    }

    generateFormControls1(formData: any, result)
    {
        let tempGroup: FormGroup = new FormGroup({});
        formData.forEach(i=>{
            tempGroup.addControl(i.Name, new FormControl(result && result[i.Name] ? result[i.Name] : ''))
        })
        return tempGroup;
    }

  addSave(){
    var fd = JSON.stringify(this.DataForm.value);
    this.localStorageService.saveData('worksheetformdata', fd);
    console.log(fd);
    this.cd_ref.detectChanges();
    this.triggerEvent("true");
    this.modalRef.hide();
    this.findWorksheetDetails();
    Swal.fire({
      title: 'Success!',
      text: 'Record saved Successfully!',
      type: 'success',
      confirmButtonClass: 'btn btn-confirm mt-2'
    });
  }

  callPdf() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Repair Report ${this.RRNo}.pdf`);
      Swal.fire({
        title: 'Success!',
        text: 'Incoming checklist downloaded successfully!',
        type: 'success',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
   })
  }

  getPdfBase64(cb) {
    this.spinner = true;
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        // viewresult: this.viewresult,
        WorksheetId: this.WorksheetId,
        Worksheet: this.Worksheet,
        RRId: this.RRId,
        Type: this.Type,
        RRImages: this.RRImages,
        CustomerName: this.CustomerName,
        RRInfo: this.RRInfo,
        RRDescription: this.RRDescription,
        RRNo: this.RRNo,
        viewresult: this.selectedWorksheet,
        Logo: base64,
        Title: "Incoming Checklist",
        Title1: "Part as received (Photos from RR#)",
        Title2: "Root Cause",
        comments: this.comments ? this.comments : '-'
      }

      this.commonService.postHttpService({ pdfObj }, "getChecklistPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner = false;
        }
      });
    })
  }

  insertSpaces(string) {
    string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return string;
  }

  callBothPdf() {
    this.getBothPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Repair Report ${this.RRNo}.pdf`);
      Swal.fire({
        title: 'Success!',
        text: 'Incoming checklist downloaded successfully!',
        type: 'success',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
   })
  }

  getBothPdfBase64(cb) {
    this.spinner = true;
    this.commonService.getLogoAsBas64().then((base64) => {
      var worksheetformdataoutgoing = this.localStorageService.getData('worksheetformdataoutgoing');
      var finaltestcomments = this.localStorageService.getData('finaltestcomments');
      var Worksheetoutgoing = this.localStorageService.getData('Worksheetoutgoing');
      var selectedoutgoingWorksheet = this.localStorageService.getData('selectedoutgoingWorksheet');
      var overallType = 0;
      if(worksheetformdataoutgoing == null){
        overallType = 0;
      }else{
        overallType = 2;
      }
      let pdfObj = {
          overallType: overallType,
          RRId: this.RRId,
          CustomerName: this.CustomerName,
          RRInfo: this.RRInfo,
          RRDescription: this.RRDescription,
          RRNo: this.RRNo,
          Logo: base64,
          incomingTitle: "Incoming Checklist",
          incomingTitle1: "Part as received (Photos from RR#)",
          incomingTitle2: "Root Cause",
          outgoingTitle: "Outgoing Checklist",
          outgoingTitle1: "Part as Shipped",
          outgoingTitle2: "Final Test",
          incomingWorksheetId: 0,
          outgoingWorksheetId: 0,
          incomingRRImages: this.RRImages,
          outgoingRRImages: this.RRImages, //ToDo

          incomingWorksheet: this.Worksheet,
          incomingViewresult: this.selectedWorksheet,
          incomingComments: this.comments ? this.comments : '-',

          outgoingWorksheet: Worksheetoutgoing,
          outgoingViewresult: selectedoutgoingWorksheet,
          outgoingComments: finaltestcomments? finaltestcomments : '-'
      }


      this.commonService.postHttpService({ pdfObj }, "getChecklistBothPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner = false;
        }
      });
    })
  }


}

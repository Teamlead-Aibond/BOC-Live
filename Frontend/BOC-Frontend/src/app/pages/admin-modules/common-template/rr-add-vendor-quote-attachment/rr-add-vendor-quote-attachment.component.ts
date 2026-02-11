import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-rr-add-vendor-quote-attachment',
  templateUrl: './rr-add-vendor-quote-attachment.component.html',
  styleUrls: ['./rr-add-vendor-quote-attachment.component.scss']
})
export class RRAddVendorQuoteAttachmentComponent implements OnInit {


  submitted = false;
  Notes;
  RRId;
  model: any = {};
  AttachmentSize
  imageresult;
  IdentityId;
  IdentityType;
  attachmentThumb;
  Attachment;
  AttachmentTypeName;
  AttachmentOriginalFile;
  AttachmentMimeType;
  fileData;
  url;
  
  showsave: boolean = true;
  spinner: boolean = false;
  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();
  public event: EventEmitter<any> = new EventEmitter();
  keywordForRR = 'RRNo';
  isLoadingRR: boolean = false;
  RRNo: string;
  RRList: any;
  VQAttachmentId: any;
  showRecomPrice: boolean = true;
  title: string;
  URI: string;
  RRNoErr: boolean = true;
  VendorCurrencySymbol: any;
  RRVendorsList: any;
  loadingVendors: boolean = false;
  fileFormatMismatchErr: string;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;
    this.IdentityType = this.data.IdentityType
    this.VQAttachmentId = this.data.VQAttachmentId;
    //DropdownList
    this.loadVendors();
    this.title = "Add Vendor Quote Attachment";
    this.URI = "VendorQuoteAttachmentAdd";
    if(this.VQAttachmentId > 0){
      this.title = "Edit Vendor Quote Attachment";
      this.URI = "VendorQuoteAttachmentUpdateAll";
      this.loadData();
    }
    this.Notes = notes_type;
    this.attachmentThumb = attachment_thumb_images;
  }

  loadData(){
    var postData = {
      "VQAttachmentId": this.VQAttachmentId
    }
    this.commonService.postHttpImageService(postData, "VendorQuoteAttachmentView").subscribe(response => {
      if (response.status == true) {
        this.showRecomPrice = false;
        this.RRId = response.responseData.RRId;
        this.model.RRNo = response.responseData.RRNo;
        this.model.RecomPrice = response.responseData.RecomPrice;
        this.model.Attachment = this.Attachment = response.responseData.VendorAttachment;
        this.model.VendorId = response.responseData.VendorId;
        this.model.VendorCost = response.responseData.VendorCost;
        this.model.InternalNotes = response.responseData.InternalNotes;
        this.model.ApproverFeedback = response.responseData.ApproverFeedback;
        this.model.VendorName = response.responseData.VendorName;
        this.VendorCurrencySymbol = response.responseData.VendorCurrencySymbol;
        
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
    })
  }

  setVendorCurrencySymbol(VendorId){

  }

  loadVendors() {
    this.Vendors$ = concat(
      of([]), // default items
      this.VendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchVendors(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }
  searchVendors(term: string = ""): Observable<any> {
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }

  //Attachment process
  fileProgress(fileInput: any) {
    this.fileFormatMismatchErr = "";
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
    if(this.fileData.type == "application/pdf"){
      const formData = new FormData();
      formData.append('file', this.fileData);
  
      this.spinner = true;
      this.showsave = false;
      this.commonService.postHttpImageService(formData, "RepairRequestVendorQuoteUploadAttachment").subscribe(response => {
        this.imageresult = response.responseData;
        this.Attachment = this.imageresult.location;
        this.url = this.imageresult.location;
        this.AttachmentOriginalFile = this.imageresult.originalname;
        this.AttachmentMimeType = this.imageresult.mimetype
        this.AttachmentSize = this.imageresult.size;
  
        this.spinner = false;
        this.showsave = true;
  
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }else{
      this.fileFormatMismatchErr = "Please select PDF file only!";
    }
    
  }
  



  onSubmit(f: NgForm) {
    this.submitted = true;
    if(f.valid && this.fileFormatMismatchErr == ""){
    var postData = {
      "RRId": this.RRId,
      "VendorAttachment": this.Attachment,
      "VendorId": this.model.VendorId,
      "VendorCost": this.model.VendorCost,
      "RecomPrice": this.model.RecomPrice,
      "InternalNotes": this.model.InternalNotes,
      "ApproverFeedback": this.model.ApproverFeedback,
      "VQAttachmentId": this.VQAttachmentId

    }
    if(this.VQAttachmentId > 0){
    this.commonService.putHttpService(postData, this.URI).subscribe(response => {
      if (response.status == true) {
        this.triggerEvent(response.responseData);
        this.modalRef.hide();
        Swal.fire({
          title: 'Success!',
          text: 'Vendor Quote Attachment Details updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Duplicate!',
          text: response.message ? response.message : 'Vendor Quote Attachment Details could not be saved!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
    }else{
    this.commonService.postHttpService(postData, this.URI).subscribe(response => {
      if (response.status == true) {
        this.triggerEvent(response.responseData);
        this.modalRef.hide();
        Swal.fire({
          title: 'Success!',
          text: 'Vendor Quote Attachment Details saved Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Duplicate!',
          text: response.message ? response.message : 'Vendor Quote Attachment Details could not be saved!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
    }
  }
  else{
    Swal.fire({
      type: 'error',
      title: Const_Alert_pop_title,
      text: Const_Alert_pop_message,
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  
  }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  selectRREvent($event) {
    this.loadingVendors = true;
    console.log($event);
    this.RRNoErr = false;
    this.RRId = $event.RRId;

    var postData = {
      RRId: $event.RRId
    }
    this.commonService.postHttpService(postData, "VendorQuoteAttachmentGetRRVendors").subscribe(response => {
      if (response.status == true) {
        this.RRVendorsList = response.responseData;
        this.loadingVendors = false;
      }else{
        this.RRVendorsList = [];
        this.loadingVendors = false;
      }
      this.isLoadingRR = false;
      this.cd_ref.detectChanges();
    }, error => { console.log(error); this.isLoadingRR = false; });

  }
  clearRREvent($event) {
    this.RRId = '';
    this.model.RRNo = ''
  }
  onFocused($event){

  }
  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.commonService.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.RRList = data.filter(a => a.RRNo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingRR = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingRR = false; });

    }
  }
  selectVendorEvent(event){
    // console.log(event);
    this.VendorCurrencySymbol = event.CurrencySymbol;
  }
}

import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vendor-quote-attachment',
  templateUrl: './vendor-quote-attachment.component.html',
  styleUrls: ['./vendor-quote-attachment.component.scss']
})
export class VendorQuoteAttachmentComponent implements OnInit {
  NotesForm: FormGroup;
  NotesTypeName;
  submitted = false;
  Notes;
  RRId;
  FileName;
  FileUrl
  imageresult;
  fileData;
  attachmentThumb;
  FileSize;
  FileMimeType;
  IdentityId;
  IdentityType;

  showsave: boolean = true;
  spinner: boolean = false;
  btnDisabled: boolean = false;

  public event: EventEmitter<any> = new EventEmitter();
  pdfSrc: any;
  VendorQuoteAttachment: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    protected _sanitizer: DomSanitizer,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;
    this.IdentityType = this.data.IdentityType;
    this.VendorQuoteAttachment = this.data.VendorQuoteAttachment;
    // var objUrl = 'https://s3.us-east-2.amazonaws.com/ahgroup-omsbucket/vendor/attachment/1663576097913-Quote_7042.pdf';
    this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.VendorQuoteAttachment.VendorAttachment);
  }



  onSubmit() {
    let obj = this
    this.submitted = true;


  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

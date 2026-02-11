import { Component, OnInit, EventEmitter, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_message, Const_Alert_pop_title, CONST_Email_address, CONST_REPAIR_QT_address } from 'src/assets/data/dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import GlobalConstants from 'src/app/core/consts/global.constants';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class EmailComponent implements OnInit {

  btnDisabled: boolean = false;
  submitted = false;
  RRId
  IdentityType
  Email;
  followupName
  IdentityId;
  ViewFolloup;
  IdentityTypeName
  model: any = {}
  public event: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  attachments: any[] = [];
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.IdentityId = this.data.IdentityId;
    this.followupName = this.data.followupName;
    this.IdentityType = this.data.IdentityType;

    if(this.data.ImportedAttachment){
      if(this.IdentityId == 0){
        this.attachments = this.data.ImportedAttachment;
      }else{
        this.attachments.push(this.data.ImportedAttachment);
      }
    }
    this.getFollowupContecnt();
  }


  getFollowupContecnt() {
    var postData = {
      "IdentityId": this.IdentityId,
      "IdentityType": this.IdentityType,
    }
    this.commonService.postHttpService(postData, "getEmailContent").subscribe(response => {

      if (response.status == true) {
        this.ViewFolloup = response.responseData;
        this.model.From = CONST_REPAIR_QT_address; // this.ViewFolloup.FromEmail;
        this.model.To = this.IdentityId == 0 ? this.ViewFolloup.ToEmail : CONST_Email_address;
        // this.model.To = CONST_Email_address;
        this.model.CC = this.ViewFolloup.CC;
        this.model.Subject = this.ViewFolloup.Subject;
        this.model.Message = this.ViewFolloup.Message;
        this.model.Attachment = null;


      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  async fileProgressMultiple(event: any) {

    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      this.attachments.push({ path: await this.toBase64(filesarray[i]), filename: filesarray[i].name });
    }
  }

  downloadAttachment(attachment) {
    const downloadLink = document.createElement("a");
    const fileName = attachment.filename;

    downloadLink.href = attachment.path;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  removeAttachment(attachment) {
    this.attachments = this.attachments.filter(a => a != attachment);
  }

  clearAttachments() {
    this.attachments.splice(0);
    this.model.Attachment = null;
    this.fileInput.nativeElement.value = "";
    this.attachments.push(this.data.ImportedAttachment);
  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      this.spinner.show();
      this.btnDisabled = true;

      var postData = {
        "from": this.model.From,
        "to": this.model.To,
        "cc": this.model.CC,
        "subject": this.model.Subject,
        "text": this.model.Message,
        "IdentityId": this.IdentityId,
        "IdentityType": this.IdentityType,
        "attachments": this.attachments
      }
      this.commonService.postHttpService(postData, "sendEmail").subscribe(response => {

        if (response.status == true) {
          this.triggerEvent(response);
          this.spinner.hide();
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Email Sent Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          this.spinner.hide();
          Swal.fire({
            title: 'Error!',
            text: 'Email could not be Sent!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
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



}

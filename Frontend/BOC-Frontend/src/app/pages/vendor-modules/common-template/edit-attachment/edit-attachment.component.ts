import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { attachment_thumb_images } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-attachment',
  templateUrl: './edit-attachment.component.html',
  styleUrls: ['./edit-attachment.component.scss']
})
export class EditAttachmentComponent implements OnInit {
  submitted = false;
  public event: EventEmitter<any> = new EventEmitter();
  imageresult;
  IdentityType;
  IdentityId;
  AttachmentDesc;
  AttachementForm: FormGroup;
  AttachmentList: any[] = [];
  result;
  index;
  Attachment
  AttachmentId;
  AttachmentMimeType;
  AttachmentOriginalFile;
  AttachmentSize;
  attachmentThumb;
  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,

    private fb: FormBuilder, @Inject(BsModalRef) public data: any,
    private commonService: CommonService, ) { }

  ngOnInit(): void {
    this.result = this.data.item;
    this.index = this.data.i
    this.Attachment = this.result.Attachment
    this.AttachmentDesc = this.result.AttachmentDesc
    this.AttachmentId = this.result.AttachmentId
    this.AttachmentMimeType = this.result.AttachmentMimeType
    this.AttachmentOriginalFile = this.result.AttachmentOriginalFile
    this.AttachmentSize = this.result.AttachmentOriginalFile;
    this.attachmentThumb = attachment_thumb_images;

  }



  //Multiple

  // fileProgressMultiple(event: any) {


  //   const formData = new FormData();
  //   //var fileData = event.target.files;     
  //   var filesarray = event.target.files;
  //   for (var i = 0; i < filesarray.length; i++) {
  //     formData.append('files', filesarray[i]);
  //   }
  //   this.commonService.postHttpImageService(formData, "getuploadAttachment").subscribe(response => {
  //     this.imageresult = response[0];
  //     this.AttachmentList.push({
  //       "IdentityType": this.IdentityType,
  //       "Attachment": this.imageresult.path,
  //       "AttachmentDesc": this.AttachmentDesc,
  //       "AttachmentOriginalFile": this.imageresult.originalname,
  //       "AttachmentMimeType": this.imageresult.mimetype,
  //       "AttachmentSize": this.imageresult.size
  //     });
  //     console.log(this.AttachmentList)
  //     this.cd_ref.detectChanges();
  //   }, error => console.log(error));


  // }



  onSubmit() {
    var postData = {
      "AttachmentList": [
        {
          "Attachment": this.Attachment,
          "AttachmentDesc": this.AttachmentDesc,
          "AttachmentOriginalFile": this.AttachmentOriginalFile,
          "AttachmentMimeType": this.AttachmentMimeType,
          "AttachmentSize": this.AttachmentSize,
          "AttachmentId": this.AttachmentId
        }
      ]
    }
    this.commonService.putHttpService(postData, "UpdateAttachmentVendor").subscribe(response => {

      if (response.status == true) {
        this.triggerEvent(response.responseData.AttachmentList[0]);

        this.modalRef.hide();

        Swal.fire({
          title: 'Success!',
          text: 'Attachment updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Attachment could not be updated!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }




  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

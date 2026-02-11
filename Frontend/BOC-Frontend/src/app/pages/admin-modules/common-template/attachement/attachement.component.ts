import { Component, OnInit, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-attachement',
  templateUrl: './attachement.component.html',
  styleUrls: ['./attachement.component.scss']
})
export class AttachementComponent implements OnInit {
  submitted = false;
  public event: EventEmitter<any> = new EventEmitter();
  imageresult;
  IdentityType;
  IdentityId;
  AttachmentDesc;
  attachement;
  AttachementForm: FormGroup;
  AttachmentList: any[] = [];
  url: any[] = [];
  attachmentThumb;

  showsave: boolean = true;
  spinner: boolean = false;

  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,

    private fb: FormBuilder, @Inject(BsModalRef) public data: any,
    private commonService: CommonService, ) { }

  ngOnInit(): void {
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId;
    this.AttachementForm = this.fb.group({
      Attachment: ['', Validators.required],
    })
    this.attachmentThumb = attachment_thumb_images;
  }

  //Multiple
  fileProgressMultiple(event: any) {
    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }

    this.spinner = true;
    this.showsave = false;
    if (this.IdentityType == "1") {
      // alert("customer")
      this.commonService.postHttpImageService(formData, "getCustomeruploadAttachment").subscribe(response => {
        this.imageresult = response.responseData;

        for (var x in this.imageresult) {
          this.AttachmentList.push({
            "IdentityType": "1",
            "Attachment": this.imageresult[x].location,
            "AttachmentOriginalFile": this.imageresult[x].originalname,
            "AttachmentMimeType": this.imageresult[x].mimetype,
            "AttachmentSize": this.imageresult[x].size,
            "Attachment1": this.imageresult[x].location

          });
        }
        this.spinner = false;
        this.showsave = true;
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }

    if (this.IdentityType == "2") {
      // alert("vendor")
      this.commonService.postHttpImageService(formData, "getVendoruploadAttachment").subscribe(response => {
        this.imageresult = response.responseData;

        for (var x in this.imageresult) {
          this.AttachmentList.push({
            "IdentityType": "2",
            "Attachment": this.imageresult[x].location,
            "AttachmentOriginalFile": this.imageresult[x].originalname,
            "AttachmentMimeType": this.imageresult[x].mimetype,
            "AttachmentSize": this.imageresult[x].size,
            "Attachment1": this.imageresult[x].location
          });
        }

        this.spinner = false;
        this.showsave = true;
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.AttachementForm.valid) {
      var postData = {
        IdentityId: this.IdentityId,
        AttachmentList: {
          AttachmentDesc: this.AttachmentDesc,
          AttachmentList: this.AttachmentList
        }
      }

      this.commonService.postHttpService(postData, "getAttachmentAdd").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.AttachmentList.AttachmentList[0]);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Attachment saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Attachment could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
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

  //get AddressForm validation control
  get AttachmentFormControl() {
    return this.AttachementForm.controls;
  }
  
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

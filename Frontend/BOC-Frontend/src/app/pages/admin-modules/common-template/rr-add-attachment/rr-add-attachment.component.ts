import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-add-attachment',
  templateUrl: './rr-add-attachment.component.html',
  styleUrls: ['./rr-add-attachment.component.scss']
})
export class RRAddAttachmentComponent implements OnInit {


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

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;
    this.IdentityType = this.data.IdentityType
    //DropdownList
    this.Notes = notes_type;
    this.attachmentThumb = attachment_thumb_images;
  }

  //Attachment process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);

    this.spinner = true;
    this.showsave = false;
    this.commonService.postHttpImageService(formData, "RepairRequestUploadAttachment").subscribe(response => {
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
  }


  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    this.AttachmentTypeName = this.filterAndGetValue(this.Notes, "NotesTypeValue", "NotesType", this.model.AttachmentType)
if(f.valid){
    var postData = {
      "IdentityType": this.IdentityType,
      "IdentityId": this.IdentityId,
      "AttachmentType": this.model.AttachmentType,
      "Attachment": this.Attachment,
      "AttachmentDesc": this.model.AttachmentDesc,
      "AttachmentOriginalFile": this.AttachmentOriginalFile,
      "AttachmentMimeType": this.AttachmentMimeType,
      "AttachmentSize": this.AttachmentSize,
      "AttachmentTypeName": this.AttachmentTypeName
    }
    this.commonService.postHttpService(postData, "AttachmentAdd").subscribe(response => {
      if (response.status == true) {
        this.triggerEvent(response.responseData);
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

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}

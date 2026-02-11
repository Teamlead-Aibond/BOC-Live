import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { attachment_thumb_images } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-followup-notes',
  templateUrl: './rr-followup-notes.component.html',
  styleUrls: ['./rr-followup-notes.component.scss']
})
export class RRFollowupNotesComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();
  model: any = {};
  submitted = false;
  IdentityId;
  IdentityType;
  editMode: boolean = false;
  FollowUpNoteId;
  result;
  attachmentThumb;
  Attachment;
  AttachmentTypeName;
  AttachmentOriginalFile;
  AttachmentMimeType;
  AttachmentSize;
  fileData;
  url;

  showsave: boolean = true;
  spinner: boolean = false
  constructor(private cd_ref: ChangeDetectorRef,
    public modalRef: BsModalRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,

  ) {

  }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;
    this.FollowUpNoteId = this.data.FollowUpNoteId;
    this.result = this.data.note
    this.attachmentThumb = attachment_thumb_images;


    //View
    if (this.FollowUpNoteId) {
      this.editMode = true;
      this.model.Notes = this.result.Notes
      this.model.Attachment = this.result.FileUrl;
      this.url = this.result.FileUrl;
      this.AttachmentOriginalFile = this.result.FileName;
      this.AttachmentMimeType = this.result.FileMimeType
      this.AttachmentSize = this.result.FileSize;
    }
  }




  closeModal() {
    this.modalRef.hide();
  }

  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.model.Attachment=(file ? file.name : ''); // <-- Set Value for Validation
  }

  //Attachment process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);

    this.spinner = true;
    this.showsave = false;
    this.commonService.postHttpImageService(formData, "RepairRequestUploadAttachment").subscribe(response => {
      this.Attachment = response.responseData.location;
      this.url = response.responseData.location;
      this.AttachmentOriginalFile = response.responseData.originalname;
      this.AttachmentMimeType = response.responseData.mimetype
      this.AttachmentSize = response.responseData.size;
      this.spinner = false;
      this.showsave = true;

      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      var postData = {
        "FollowUpNoteId": this.FollowUpNoteId,
        "RRId": this.IdentityId,
        "Notes":this.model.Notes,
        "FileUrl": this.Attachment || this.model.Attachment,
        "FileName": this.AttachmentOriginalFile,
        "FileMimeType": this.AttachmentMimeType,
        "FileSize": this.AttachmentSize,
      }
      if (this.FollowUpNoteId == '') {
        this.commonService.postHttpService(postData, "FollowpNotesAdd").subscribe(res => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Followup Notes Created Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Followup Notes could not be Created!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (this.FollowUpNoteId != '') {
        this.commonService.putHttpService(postData, "FollowpNotesUpdate").subscribe(res => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Followup Notes updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Followup Notes could not be updated!',
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



}

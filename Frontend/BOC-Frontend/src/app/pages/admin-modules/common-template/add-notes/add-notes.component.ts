import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss']
})
export class AddNotesComponent implements OnInit {
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
  btnDisabled:boolean =false;

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.IdentityId = this.data.IdentityId;
    this.IdentityType = this.data.IdentityType;
    this.NotesForm = this.fb.group({
      IdentityId: this.IdentityId,
      IdentityType: this.IdentityType,
      NotesType: ['', Validators.required],
      Notes: ['', Validators.required],
      Attachment: [''],
    })
    let obj = this
    if (obj.IdentityType == 5 || obj.IdentityType == 6 || obj.IdentityType == 4||obj.IdentityType==7||obj.IdentityType==8) {
      this.NotesForm.setValue({

        IdentityId: this.IdentityId,
        IdentityType: this.IdentityType,
        NotesType: "0",
        Notes: "",
        Attachment: [''],
      })
    }
    //DropdownList
    this.Notes = notes_type;
    this.attachmentThumb = attachment_thumb_images;
  }

  //get NotestForm validation control
  get NotesFormControl() {
    return this.NotesForm.controls;
  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  //Image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    
    this.spinner = true;
    this.showsave = false;
    this.commonService.postHttpImageService(formData, "RRNotesAttachment").subscribe(response => {
      this.imageresult = response.responseData;
      this.FileName = this.imageresult.originalname;
      this.FileUrl = this.imageresult.location;
      this.FileMimeType = this.imageresult.mimetype;
      this.FileSize = this.imageresult.size;      
      
      this.spinner = false;
      this.showsave = true;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSubmit() {
    let obj = this
    this.submitted = true;

    if (this.NotesForm.valid) {
      this.btnDisabled = true;

      if (obj.IdentityType != 5 && obj.IdentityType != 6 && obj.IdentityType != 4 &&  obj.IdentityType != 7 &&  obj.IdentityType != 8) {
        this.NotesTypeName = this.filterAndGetValue(this.Notes, "NotesTypeValue", "NotesType", this.NotesForm.value.NotesType)
      }
      var postData = {
        "IdentityId": this.IdentityId,
        "IdentityType": this.IdentityType,
        RRId: 0,
        "NotesType": this.NotesForm.value.NotesType,
        "Notes": this.NotesForm.value.Notes,
        "FileName": this.FileName,
        "FileUrl": this.FileUrl,
        "FileMimeType": this.FileMimeType,
        "FileSize": this.FileSize,
        "NotesTypeName": this.NotesTypeName
      }

      this.commonService.postHttpService(postData, "NotesAdd").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Notes saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Notes could not be saved!',
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

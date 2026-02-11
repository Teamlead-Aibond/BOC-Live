import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { RrCurrentHistoryComponent } from '../rr-current-history/rr-current-history.component';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.scss']
})
export class EditNotesComponent implements OnInit {
  btnDisabled:boolean =false;

  NotesForm: FormGroup;
  submitted = false;
  Notes;
  RRId;
  FileName;
  FileUrl
  imageresult;
  fileData;
  result;
  index;
  FileMimeType;
  FileSize;
  NotesTypeName;
  attachmentThumb;
  IdentityId;
  IdentityType;
  
  showsave: boolean = true;
  spinner: boolean = false;

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }


  ngOnInit(): void {
    this.result = this.data.note;
    this.IdentityId = this.data.IdentityId;
    this.IdentityType = this.data.IdentityType
    this.index = this.data.i
    this.NotesForm = this.fb.group({
      IdentityId: this.IdentityId,
      IdentityType: this.IdentityType,
      NotesId: ['', Validators.required],
      NotesType: ['', Validators.required],
      Notes: ['', Validators.required],
      Attachment: [''],
    })


    //DropdownList
    this.Notes = notes_type;
    this.attachmentThumb = attachment_thumb_images;

    this.NotesForm.setValue({
      NotesId: this.result.NotesId,
      IdentityId: this.IdentityId,
      IdentityType: this.IdentityType,
      NotesType: this.result.NotesType || 0,
      Notes: this.result.Notes,
      Attachment: [''],
    })
    this.FileName = this.result.FileName
    this.FileUrl = this.result.FileUrl
    this.FileMimeType = this.result.FileMimeType;
    this.FileSize = this.result.FileSize;
  }

  //get NotestForm validation control
  get NotesFormControl() {
    return this.NotesForm.controls;
  }

  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.NotesForm.controls['Attachment'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }

  //image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);

    this.spinner = true;
    this.showsave = false;

    this.commonService.postHttpImageService(formData, "RRNotesAttachment").subscribe(response => {
      this.imageresult = response.responseData;
      this.FileName = this.imageresult.originalname;
      this.FileUrl = this.imageresult.location
      this.FileMimeType = this.imageresult.mimetype;
      this.FileSize = this.imageresult.size;
      
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

  onSubmit() {
    let obj = this
    this.submitted = true;
    if (this.NotesForm.valid) {
      this.btnDisabled = true;

      if (obj.IdentityType != 5 && obj.IdentityType != 6 && obj.IdentityType != 4 && obj.IdentityType !=7 && obj.IdentityType !=8) {
        this.NotesTypeName = this.filterAndGetValue(this.Notes, "NotesTypeValue", "NotesType", this.NotesForm.value.NotesType)
      }
      var postData = {
        "RRId": 0,
        "IdentityId": this.NotesForm.value.IdentityId,
        "IdentityType": this.NotesForm.value.IdentityType,
        "NotesType": this.NotesForm.value.NotesType,
        "Notes": this.NotesForm.value.Notes,
        "FileName": this.FileName,
        "FileUrl": this.FileUrl,
        "NotesId": this.NotesForm.value.NotesId,
        "FileMimeType": this.FileMimeType,
        "FileSize": this.FileSize,
        "NotesTypeName": this.NotesTypeName
      }
      this.commonService.putHttpService(postData, "NotesUpdate").subscribe(response => {

        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Notes Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Notes could not be Updated!',
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

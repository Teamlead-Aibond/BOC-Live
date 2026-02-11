import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revert',
  templateUrl: './revert.component.html',
  styleUrls: ['./revert.component.scss']
})
export class RevertComponent implements OnInit {
  Name
  RevertForm: FormGroup;
  submitted = false;
  RRId;
  btnDisabled:boolean =false;

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.Name = this.data.Name;
    this.RRId = this.data.RRId;
    this.RevertForm = this.fb.group({
      RRId: this.RRId,
      Comments: [''],
    })
  }

  //get NotestForm validation control
  get RevertFormControl() {
    return this.RevertForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.RevertForm.valid) {
      this.btnDisabled = true;

      var postData = {
        "RRId": this.RRId,
        "Comments": this.RevertForm.value.Comments,
      }
      this.commonService.postHttpService(postData, "RRRevert").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Revert Process Successfully!',
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

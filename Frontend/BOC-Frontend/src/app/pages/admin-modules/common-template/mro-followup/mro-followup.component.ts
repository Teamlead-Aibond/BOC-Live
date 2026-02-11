import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mro-followup',
  templateUrl: './mro-followup.component.html',
  styleUrls: ['./mro-followup.component.scss']
})
export class MroFollowupComponent implements OnInit {

  submitted = false;
  MROId;
  IdentityType
  Email;
  followupName
  IdentityId;
  ViewFolloup;
  IdentityTypeName
  model: any = {}
  btnDisabled: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId;
    this.followupName = this.data.followupName
    this.IdentityTypeName = this.data.IdentityTypeName
    this.getFollowupContecnt();

  }


  getFollowupContecnt() {
    var postData = {
      "MROId": this.MROId,
      "IdentityType": this.IdentityType,
      "IdentityId": this.IdentityId
    }
    this.commonService.postHttpService(postData, "GetMROFollowUpGetContent").subscribe(response => {

      if (response.status == true) {
        this.ViewFolloup = response.responseData;
        this.model.From = this.ViewFolloup.FromEmail
        this.model.To = this.ViewFolloup.ToEmail
        this.model.CC = this.ViewFolloup.CC
        this.model.Subject = this.ViewFolloup.Subject;
        this.model.Message = this.ViewFolloup.Message


      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      this.btnDisabled = true;
      var postData = {
        "MROId": this.MROId,
        "IdentityType": this.IdentityType,
        "IdentityId": this.IdentityId,
        "FromEmail": this.model.From,
        "ToEmail": this.model.To,
        "CC": this.model.CC,
        "Subject": this.model.Subject,
        "Message": this.model.Message,
        "IdentityTypeName": this.IdentityTypeName,
      }
      this.commonService.postHttpService(postData, "CreateMROFollowup").subscribe(response => {

        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Followup saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Followup could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    } else {
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



import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject, NgModule } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.scss']
})
export class FollowupComponent implements OnInit {
  submitted = false;
  RRId
  IdentityType
  Email;
  followupName
  IdentityId;
  ViewFolloup;
  IdentityTypeName
  model: any = {}
  btnDisabled:boolean =false;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId;
    this.followupName = this.data.followupName
    this.IdentityTypeName=this.data.IdentityTypeName
    this.getFollowupContecnt();

  }


  getFollowupContecnt() {
    var postData = {
      "RRId": this.RRId,
      "IdentityType": this.IdentityType,
      "IdentityId": this.IdentityId
    }
    this.commonService.postHttpService(postData, "GetFollowup").subscribe(response => {

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

  onSubmit(f:NgForm) {
    this.submitted = true;
if(f.valid){
  this.btnDisabled = true;
    var postData = {
      "RRId": this.RRId,
      "IdentityType": this.IdentityType,
      "IdentityId": this.IdentityId,
      "FromEmail": this.model.From,
      "ToEmail": this.model.To,
      "CC": this.model.CC,
      "Subject": this.model.Subject,
      "Message": this.model.Message,
      "IdentityTypeName":this.IdentityTypeName,
    }
    this.commonService.postHttpService(postData, "CreateFollowup").subscribe(response => {

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
  }else{
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

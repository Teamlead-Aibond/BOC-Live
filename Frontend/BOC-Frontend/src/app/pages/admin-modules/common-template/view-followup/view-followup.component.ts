import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-followup',
  templateUrl: './view-followup.component.html',
  styleUrls: ['./view-followup.component.scss']
})
export class ViewFollowupComponent implements OnInit {
  FollowupId;
  btnDisabled:boolean =false;
  index;
  Notes;
  result;
  RRId;
  MROId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result=[];
    this.FollowupId = this.data.FollowupId;
    this.index=this.data.i
    this.RRId=this.data.RRId;
    this.MROId =  this.data.MROId
    this.getFollowupViewContecnt();
  
  }
  getFollowupViewContecnt() {
    var postData = {
      "FollowupId": this.FollowupId
    }
    this.commonService.postHttpService(postData, "ViewFollowup").subscribe(response => {

      if (response.status == true) {
        this.result = response.responseData[0];
        this.Notes=this.result.Notes
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSubmit(){
    this.btnDisabled = true;
    var postData = {
      "RRId": this.RRId,
      "FollowupId":this.FollowupId,
      "Notes":this.Notes,
      "ModifiedBy":localStorage.getItem('UserId')
    }
    this.commonService.putHttpService(postData, "UpdateFollowupNotes").subscribe(response => {

      if (response.status == true) {
        this.triggerEvent(response.responseData);
        this.modalRef.hide();

        Swal.fire({
          title: 'Success!',
          text: 'Followup Notes Updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Followup Notes could not be Updated!',
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

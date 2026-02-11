import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { Location, LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-copy-link',
  templateUrl: './copy-link.component.html',
  styleUrls: ['./copy-link.component.scss']
})
export class CopyLinkComponent implements OnInit {
  linkKey;
  public event: EventEmitter<any> = new EventEmitter();
  url: string;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private location: Location, private locationStrategy: LocationStrategy,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.linkKey = this.data.linkKey;
    console.log(location.origin);
    this.url = location.origin + "/#/admin/rr-vendorquote-attachment-selected-list/"+this.linkKey;
  }
  copyText(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.modalRef.hide();
    }

  triggerEvent(item: string) {
    // this.triggerEvent(response.responseData);
    this.event.emit({ data: item, res: 200 });
  }
}

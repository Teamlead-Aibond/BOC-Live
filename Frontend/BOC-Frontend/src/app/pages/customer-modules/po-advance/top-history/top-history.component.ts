/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-history',
  templateUrl: './top-history.component.html',
  styleUrls: ['./top-history.component.scss']
})
export class TopHistoryComponent implements OnInit {



  spinner: boolean = false;
  ImagesList: any = [];
  url
  mimetype
  CustomerBlanketPOId;
  Atachmenturl;
  Atachmentmimetype
  isLoadingCustomer: boolean = false;
  keywordForCustomer = 'CompanyName';
  CustomersList: any[]
  result: any = []
  // Timeline
  topupHistoryList: any = []
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router, private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef, private route: ActivatedRoute,

  ) {


  }

  ngOnInit(): void {

    if (history.state.CustomerBlanketPOId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.CustomerBlanketPOId = params['CustomerBlanketPOId'];
        }
      )
    }
    else if (history.state.CustomerBlanketPOId != undefined) {
      this.CustomerBlanketPOId = history.state.CustomerBlanketPOId
    }


    this.onTopHistory();
    this.getViewContent();
  }
  onTopHistory() {
    this.service.postHttpService({ CustomerBlanketPOId: this.CustomerBlanketPOId }, 'ListPOTopUpHistory').subscribe(response => {


      this.topupHistoryList = response.responseData;


    });
  }


  getViewContent() {
    this.service.postHttpService({ CustomerBlanketPOId: this.CustomerBlanketPOId }, 'ViewBlanketPOByCustomer').subscribe(response => {


      this.result = response.responseData;

      this.url = this.result.BlanketPOAtachment

      var urlString = this.result.BlanketPOAtachment;

      var Type = urlString.slice(-3);
      if (Type == "png") {
        this.mimetype = "image/png"
      }
      else if (Type == "jpg") {
        this.mimetype = "image/jpg"

      }
      else if (Type == "pdf") {
        this.mimetype = "application/pdf"

      }
      else {
        this.mimetype = "image/jpeg"
      }

    });

  }

}

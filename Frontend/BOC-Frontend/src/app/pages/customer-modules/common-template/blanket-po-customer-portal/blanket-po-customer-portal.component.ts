import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-po-customer-portal',
  templateUrl: './blanket-po-customer-portal.component.html',
  styleUrls: ['./blanket-po-customer-portal.component.scss'],
})
export class BlanketPoCustomerPortalComponent implements OnInit {

    submitted = false;
    model: any = {}
    btnDisabled: boolean = false;
    public event: EventEmitter<any> = new EventEmitter();
    BlanketList: any = []
    BlanketddlList: any = [];
  
  
    RRId;
    CustomerId;
    QuoteId;
    GrandTotal;
    BlanketPO: boolean = false;
    CustomPO: boolean = false;
    POValidationError=''
    POValidationErrorMessage
    CustomerPONo;
    showBlanketPO:boolean=false;
    showSpinner:boolean=true
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,) { }
  
    ngOnInit(): void {
      this.RRId = this.data.RRId;
      this.QuoteId = this.data.QuoteId;
      this.CustomerId = this.data.CustomerId;
      this.GrandTotal = this.data.GrandTotal;
      this.getBlanketList()
  
  
    
    }
    getBlanketList(){
      // this.showSpinner=true;
      var postData = {
        "CustomerId": this.CustomerId,
      }
      this.commonService.postHttpService(postData, 'ByCustomerPortalBlanketPOList').subscribe(response => {
        if(response.status==true){
  
        this.BlanketList = response.responseData
        this.BlanketddlList = response.responseData.map(function (value) {
          return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance: $ " + value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
        });
        if(this.BlanketList.length>0){
          this.showBlanketPO=true
        }
      }
        else{
          this.showBlanketPO=false
          this.CustomPO=true
        }
      this.cd_ref.detectChanges();
      // this.showSpinner=false
        });
    }
    setBlanketCutomer(value) {
      if (value == 1) {
        this.BlanketPO = true
        this.CustomPO = false
      
      }
    }
  
    setCustomerPO(value) {
      if (value == 0) {
        this.BlanketPO = false
        this.CustomPO = true
      }
    }
  
  
    onPOValidation(CustomerBlanketPOId) {
      var CurrentBalance = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CurrentBalance
      this.CustomerPONo =this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CustomerPONo
      if (this.GrandTotal >= CurrentBalance) {
        this.POValidationError = 'Error';
        this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
      }
      else {
        this.POValidationError = '';
        this.POValidationErrorMessage = ''
      }
  
    }
    onSubmit(f: NgForm) {
      if (f.valid && (this.POValidationError == '')) {
        this.btnDisabled = true;
        if(this.model.Type==1){
          var postData = {
            RRId: this.RRId,
            QuoteId: this.QuoteId,
            CustomerPONo: this.CustomerPONo,
            CustomerBlanketPOId:this.model.CustomerBlanketPOId,
            QuoteAmount:this.GrandTotal
          }
          this.commonService.postHttpService(postData, 'RRCustomerQuoteApprove').subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Approved!',
                text: 'Quote has been approved.',
                type: 'success'
              });
             
            }
            else {
              Swal.fire({
                title: 'Error!',
                text: 'Quote could not be approved!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
          }
          })
      }else{
        var postData1 = {
          RRId: this.RRId,
          QuoteId: this.QuoteId,
          CustomerPONo: this.model.CustomerPONo
        }
        this.commonService.postHttpService(postData1, 'RRCustomerQuoteApprove').subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Approved!',
              text: 'Quote has been approved.',
              type: 'success'
            });
           
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Quote could not be approved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
        }
        })
      }
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



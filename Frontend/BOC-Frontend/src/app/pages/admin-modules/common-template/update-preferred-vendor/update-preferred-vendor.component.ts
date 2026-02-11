import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-preferred-vendor',
  templateUrl: './update-preferred-vendor.component.html',
  styleUrls: ['./update-preferred-vendor.component.scss'],
  providers: [
    NgxSpinnerService
  ]
})
export class UpdatePreferredVendorComponent implements OnInit {
  item
  BaseCurrencySymbol
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any = []
  model: any = [];
  submitted = false;
  btnDisabled = true;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.item = ''
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.loadVendors()
  

  }



  getViewContent() {
    this.spinner.show();
    this.commonService.postHttpService({ PartId: this.data.PartId }, 'getInventoryView').subscribe(response => {
      this.item = response.responseData.data;
      this.item.PrimaryVendorId = this.removeValue(this.item.PrimaryVendorId, 0, ',')
      this.model.PrimaryVendorId = this.item.PrimaryVendorId ? this.item.PrimaryVendorId.split(",").map(a => {
        if(Number(a) != 0 && Number(a) != undefined){
          return Number(a)
        }
      }):[];
      this.btnDisabled=false;
      this.spinner.hide();

    
    })
  
      //this.model.PrimaryVendorId =  this.item.PrimaryVendorId ? this.item.PrimaryVendorId.split(",").map(a => Number(a)) : []
   
  }

  removeValue(list, value, separator) {
    console.log(list);
    if(list){
      separator = separator || ",";
      var values = list.split(separator);
      for(var i = 0 ; i < values.length ; i++) {
        if(values[i] == value) {
          values.splice(i, 1);
          return values.join(separator);
        }
      }
      return list;
    }else{
      return list;
    }
    
  }
  

  loadVendors() {
    this.vendors$ = concat(
      this.searchVendors().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }


  searchVendors(term: string = ""): Observable<any> {
    this.spinner.show();
    this.loadingVendors = true;
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          this.spinner.hide();
          this.getViewContent()
          return response.responseData;
        })
      );
  }

  selectAll() {
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.model.PrimaryVendorId])];
    this.model.PrimaryVendorId = cMerge
  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      this.btnDisabled=true
      var postData = {
        "PartId": this.data.PartId,
        "PrimaryVendorId": this.model.PrimaryVendorId.join()
      }
      this.commonService.postHttpService(postData, "onUpdatePreferredVendor").subscribe(response => {

        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'RR Parts saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          this.btnDisabled=false
          Swal.fire({
            title: 'Error!',
            text: 'RR Parts could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      this.btnDisabled=false
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




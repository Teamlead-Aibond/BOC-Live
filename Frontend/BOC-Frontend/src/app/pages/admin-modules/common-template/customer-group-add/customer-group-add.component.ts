import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-group-add',
  templateUrl: './customer-group-add.component.html',
  styleUrls: ['./customer-group-add.component.scss']
})
export class CustomerGroupAddComponent implements OnInit {

  CustomerGroupId
  Form: FormGroup;
  submitted = false;
  editMode: boolean = false;
  isSelectCustomer: boolean = false;
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  selected: any;
  index: any;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.CustomerGroupId = this.data.CustomerGroupId;
    this.Form = this.fb.group({
      CustomerGroupId: this.CustomerGroupId,
      CustomerGroupName: ['', Validators.required],
      CustomerGroupDesc: ['', Validators.required],
      MultipleCustomerIds: [''],
      IsActive: ['', Validators.required],
    });
    this.loadCustomers();
    if (this.CustomerGroupId) {
      this.editMode = true;
      var postData = {
        CustomerGroupId: this.CustomerGroupId
      }
      this.commonService.postHttpService(postData, 'viewCustomerGroup').subscribe((res: any) => {
        if (res.status == true) {
          var result = res.responseData;
          this.Form.patchValue({
            CustomerGroupId: this.CustomerGroupId,
            CustomerGroupName: result.CustomerGroupName,
            CustomerGroupDesc: result.CustomerGroupDesc,
            MultipleCustomerIds: result.MultipleCustomerIds ? result.MultipleCustomerIds.split(",").map(a => Number(a)) : [],
            IsActive: result.IsActive,
          })
        }
      })
    }
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.Form.value.MultipleAccessIdentityIds])];
    this.Form.patchValue({ "MultipleCustomerIds": cMerge })
  }

  selectAllMultipleCustomerIds() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.Form.value.MultipleCustomerIds])];
    this.Form.patchValue({ "MultipleCustomerIds": cMerge })
  }


  //get form validation control
  get FormControl() {
    return this.Form.controls;
  }
  closeModal() {
    this.modalRef.hide();
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      console.log(body);
      if (body.CustomerGroupId == '') {
        this.commonService.postHttpService(body, 'addCustomerGroup').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: res.message ? res.message : 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
      else if (body.CustomerGroupId != '') {
        this.commonService.putHttpService(body, 'updateCustomerGroup').subscribe((res: any) => {
          if (res.status == true) {
            this.triggerEvent(res.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Record Updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: res.message ? res.message : 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }


    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}


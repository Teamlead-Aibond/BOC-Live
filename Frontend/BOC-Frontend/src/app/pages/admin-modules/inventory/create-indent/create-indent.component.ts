import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-indent',
  templateUrl: './create-indent.component.html',
  styleUrls: ['./create-indent.component.scss']
})
export class CreateIndentComponent implements OnInit {

  AddForm: FormGroup;
  warehouseList: any[];
  submitted: boolean = false;

  constructor(public router: Router, public service: CommonService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getWarehouseList();

    this.AddForm = this.fb.group({
      PartNo: ['', Validators.required],
      WarehouseId: ['', Validators.required],
      Quantity: [1, Validators.required]
    })
  }

  getWarehouseList() {
    this.service.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.AddForm.invalid) {
      // this.markFormGroupTouched(this.AddForm);
      this.AddForm.markAllAsTouched();
      return;
    }

    let body = { ...this.AddForm.value };
    let api = "CreateIndent";
    if (body) {

      this.service.postHttpService(body, api).subscribe(response => {
        console.log(response, "response")

        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Indent request raised!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });

          this.router.navigate(["/admin/inventory/indent"]);
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-damage-add',
  templateUrl: './damage-add.component.html',
  styleUrls: ['./damage-add.component.scss']
})
export class DamageAddComponent implements OnInit {
  AddForm: FormGroup;
  submitted: boolean = false;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public service: CommonService,
  ) {

    this.AddForm = this.fb.group({
      SerialNo: ["", Validators.required],
      DamageType: ['', Validators.required],
      DamageDate: ['', Validators.required],
      Comments: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.AddForm.invalid) {
      // this.markFormGroupTouched(this.AddForm);
      this.AddForm.markAllAsTouched();
      return;
    }

    let body = { ...this.AddForm.value };
    let api = "CreateDamage";
    if (body) {

      this.service.postHttpService(body, api).subscribe(response => {
        console.log(response, "response")

        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Record added successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });

          this.router.navigate(["/admin/inventory/damage-list"]);
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

/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import { RfIdIntegrationService } from '../../rfid-integration/rfid-integration.service';
import { ReaderId } from '../../rfid-integration/rfid-integration.metadata';

@Component({
  selector: 'app-inventory-settings',
  templateUrl: './inventory-settings.component.html',
  styleUrls: ['./inventory-settings.component.scss']
})
export class InventorySettingsComponent implements OnInit {
  model: any = {}
  submitted = false;
  showRfidSettings = false;
  form: FormGroup;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  pattern = "(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}),?\s*){1,3}$";
  breadCrumbItems: Array<{}>;
  readerState: any;
  presetConfig: any;
  constructor(private service: CommonService,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef, private fb: FormBuilder,
    private rfIdIntegrationService: RfIdIntegrationService) { }

  ngOnInit(): void {
    document.title = 'Inventory Settings'

    this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Admin', path: '/' }, { label: 'Inventory Settings', path: '/', active: true }];

    this.form = this.fb.group({
      InventoryNotificationEmail: ['', [Validators.required, this.commaSepEmail]],
      InventoryNotificationMobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],

      IsRFIDEnabled: [""],
      ReaderInterfaceHost: ['', [Validators.required]],
      ReaderHost: ['', [Validators.required]],
      ReaderId: ['', [Validators.required]],
      PresetName: ['', [Validators.required]],
      RFIDStorageTime: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],

      Zones: this.fb.array([
        this.fb.group({
          RFIDZoneSettingsId: [""],
          ZoneId: [""],
          Zone: [""],
          readyAntennaPort: [""],
          acceptAntennaPort: [""]
        })
      ]),

      AntennaConfigs: this.fb.array([
        this.fb.group({
          AntennaName: [""],
          RFMode: [""],
          TransmitPowerCdbm: [""],
          ReceiveSensitivityDbm: [""],
          AntennaPort: [""]
        })
      ]),

    })

    this.rfIdIntegrationService.getPreset(ReaderId.mainStore).subscribe(data => {
      //debugger;
      this.presetConfig = data;
      this.resetAntennaConfigs()
      this.addAntennaConfigs(data.antennaConfigs.length)
      this.form.patchValue({
        AntennaConfigs: data.antennaConfigs.map(conf => {
          return {
            AntennaName: conf.antennaName,
            RFMode: conf.rfMode,
            TransmitPowerCdbm: conf.transmitPowerCdbm,
            ReceiveSensitivityDbm: conf.receiveSensitivityDbm,
            AntennaPort: conf.antennaPort
          }
        })
      })
      console.log(data)
    });
    this.getNotificationinfo();
  }

  get f() {
    return this.form.controls;
  }

  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(',');
    const InventoryNotificationEmail = emails.some(email => Validators.email(new FormControl(email)));
    // console.log(InventoryNotificationEmail);
    return InventoryNotificationEmail ? { 'InventoryNotificationEmail': { value: control.value } } : null;
  };
  getNotificationinfo() {
    var postData = {
      "SettingsId": "1"
    }
    this.service.postHttpService(postData, "InventoryNotificationsettingsView").subscribe(response => {
      if (response.status == true) {
        let res = response.responseData;

        this.resetZonesList();
        this.addReference(res.Zones.length);

        this.form.patchValue({
          InventoryNotificationEmail: res.InventoryNotificationEmail,
          InventoryNotificationMobile: res.InventoryNotificationMobile,

          IsRFIDEnabled: res.IsRFIDEnabled,
          ReaderInterfaceHost: res.ReaderInterfaceHost,
          ReaderHost: res.ReaderHost,
          ReaderId: res.ReaderId,
          PresetName: res.PresetName,
          RFIDStorageTime: res.RFIDStorageTime,

          Zones: res.Zones.map(zone => {
            return {
              RFIDZoneSettingsId: zone.RFIDZoneSettingsId,
              ZoneId: zone.ZoneId,
              Zone: zone.Zone,
              readyAntennaPort: zone.ReadyAntennaPort,
              acceptAntennaPort: zone.AcceptAntennaPort
            }
          })
        })
      } else {
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  public resetAntennaConfigs(): void {
    const refArray = <FormArray>this.form.controls.AntennaConfigs;
    refArray.clear();
  }

  public resetZonesList(): void {
    const refArray = <FormArray>this.form.controls.Zones;
    refArray.clear();
  }

  rfidChange(e) {
    this.showRfidSettings = e.target.value == "1";
  }

  public addReference(qty = 1): void {
    const refArray = <FormArray>this.form.controls.Zones;
    if (refArray.controls.filter(c => c.get('IsDeleted').value == 0).length == 4) {
      Swal.fire({
        title: 'Error!',
        text: 'Cannot add more that four zones!',
        type: 'warning',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      return;
    }
    for (let index = 0; index < qty; index++) {
      refArray.push(this.initReference());
    }
  }

  public addAntennaConfigs(qty = 1): void {
    const refArray = <FormArray>this.form.controls.AntennaConfigs;
    for (let index = 0; index < qty; index++) {
      refArray.push(this.initAntennaConfigs());
    }
  }

  get Ref(): FormArray {
    return this.form.get('Zones') as FormArray;
  }

  public initReference(): FormGroup {
    return this.fb.group({
      RFIDZoneSettingsId: [""],
      ZoneId: [""],
      Zone: [""],
      readyAntennaPort: [""],
      acceptAntennaPort: [""],
      IsDeleted: [0]
    });
  }

  public initAntennaConfigs(): FormGroup {
    return this.fb.group({
      AntennaName: [""],
      RFMode: [""],
      TransmitPowerCdbm: [""],
      ReceiveSensitivityDbm: [""],
      AntennaPort: [""]
    });
  }

  onSubmit() {
    var postData = {
      ...this.form.value
    }
    //console.log(postData, 'postData')
    if (this.form.valid) {
      var postData = {
        ...this.form.value
      }

      this.presetConfig.antennaConfigs.forEach(existingConfig => {
        let newConfigs = this.form.controls["AntennaConfigs"].value
        newConfigs.forEach(newConfig => {
          //debugger;
          if (existingConfig.antennaPort == newConfig.AntennaPort) {
            existingConfig.rfMode = newConfig.RFMode
            existingConfig.transmitPowerCdbm = newConfig.TransmitPowerCdbm
            existingConfig.receiveSensitivityDbm = newConfig.ReceiveSensitivityDbm
            existingConfig.antennaName = newConfig.AntennaName
          }
        });
      });

      this.presetConfig.readerHostApiPath = postData.ReaderHost;

      this.rfIdIntegrationService.setPreset(this.presetConfig).subscribe(data => {
        this.service.putHttpService(postData, "UpdateInventorySettings").subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Success!',
              text: 'Record Updated Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Record could not be Updated!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      })
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

  onZoneDelete(i) {
    const refArray = <FormArray>this.form.controls.Zones;
    if (refArray.controls[i].get("RFIDZoneSettingsId").value)
      refArray.controls[i].patchValue({ IsDeleted: 1 });
    else
      refArray.removeAt(i);
  }

  public trackByFn(index: number, item: any): number {
    return item.value.id;
  }

  checkIf(value: any) {
    //debugger;  //open the devtools and go to the view...code execution will stop here!
    //..code to be checked... `value` can be inspected now along with all of the other component attributes
  }
}

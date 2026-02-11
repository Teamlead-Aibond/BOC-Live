/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit } from '@angular/core';
import {AppConfig} from 'config';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  logo;
  appName;
  year;
  constructor() { }

  ngOnInit() {
    this.logo = AppConfig.image_base_path + 'full_logo.png';
    this.appName = AppConfig.app_name;
    this.year = (new Date()).getFullYear();
  }

}

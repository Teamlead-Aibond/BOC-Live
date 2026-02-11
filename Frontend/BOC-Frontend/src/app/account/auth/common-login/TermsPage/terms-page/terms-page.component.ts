import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'config';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss']
})
export class TermsPageComponent implements OnInit {
  //logo;
  junologo;
  appName;
  year;
  juno: string;
  constructor() { }
  ngOnInit() {
    this.juno = AppConfig.image_base_path + "juno_logo3.png";
    this.appName = AppConfig.app_name;
    this.year = new Date().getFullYear();
  }
}
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'config';

@Component({
  selector: 'app-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyPageComponent implements OnInit {
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

import { Component, OnInit } from '@angular/core';
import {AppConfig} from 'config';
import { BuildVersion } from 'src/assets/projects/ah-group/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showNav:boolean=false;
  showSideNav:boolean=false;
  appName;
  year;
  version
  constructor() { }

  ngOnInit() {
    this.appName = AppConfig.app_name;
    this.version = BuildVersion
    this.year = (new Date()).getFullYear();
    if(localStorage.getItem("IdentityType")=="0"  ){
      this.showNav=true;
      
        }
        else{
          this.showNav=false
      
        }
        if(localStorage.getItem("IdentityType")=="2" ||localStorage.getItem("IdentityType")=="1"){
          this.showSideNav=true;
          
            }
            else{
              this.showSideNav=false
          
            }
        }
  }


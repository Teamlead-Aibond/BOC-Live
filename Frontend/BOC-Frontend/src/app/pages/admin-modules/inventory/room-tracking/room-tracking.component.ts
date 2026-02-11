import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-tracking',
  templateUrl: './room-tracking.component.html',
  styleUrls: ['./room-tracking.component.scss']
})
export class RoomTrackingComponent implements OnInit {
  cube_active:boolean=false;
  cuberack1_active:boolean=true;
  cube_nonactive:boolean=false;
  cube_d:boolean=false;
  cube_rowb:boolean=false;
  cube_rowb2:boolean=false;
  cube_rowb3:boolean=false;
  cuberack_rowc2:boolean=false;
  cube_d1:boolean=false;
  cube_d2:boolean=false;
  cube_d3:boolean=false;
  cube_e1:boolean=false;
  cube_e2:boolean=false;
  cube_e3:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

 showCube()
  {this.cube_active=true 
  this.cuberack1_active=false
  this.cube_nonactive=false
  this.cube_d=false
  this.cube_rowb2=false
  this.cube_rowb3=false
  this.cube_rowb=false
  this.cube_d1=false
  this.cube_d2=false
  this.cube_d3=false
  this.cube_e1=false
  this.cube_e2=false
  this.cube_e3=false
  this.cuberack_rowc2=false
 };

  showCube_rack1()
{
  this.cuberack1_active=true
  this.cube_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=false
};
  
showCube_rack2() {
this.cube_nonactive=true
this.cube_active=false 
this.cuberack1_active=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=false
};

showCube_rack3() {
this.cube_d=true
this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=false
};

showCube_rack_rowb()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb2=false
this.cube_rowb=true
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=false
};

showCube_rackb2() {
this.cube_rowb2=true
this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=false
};

showCube_rackb3()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cube_rowb3=true
};

showCube_rackb4()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cuberack_rowc2=true
};

showCube_rackb5()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cube_d1=true
};

showCube_rackb6()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cube_d2=true
};

showCube_rackb7()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d2=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=false
this.cube_d3=true
};

showCube_racke1()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=true
this.cube_e3=false
this.cube_e2=false
};

showCube_racke2()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=true
this.cube_e3=false
};

showCube_racke3()
{this.cube_active=false 
this.cuberack1_active=false
this.cube_nonactive=false
this.cube_d=false
this.cube_rowb=false
this.cube_rowb2=false
this.cube_rowb3=false
this.cuberack_rowc2=false
this.cube_d1=false
this.cube_d2=false
this.cube_d3=false
this.cube_e1=false
this.cube_e2=false
this.cube_e3=true
};

}

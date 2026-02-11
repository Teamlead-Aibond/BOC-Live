import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { FullCalendarComponent, CalendarOptions, EventInput, Calendar } from 'plugins/@fullcalendar/angular';
import tippy from 'plugins/tippy.js';
import { HttpClient } from '@angular/common/http';
import { array_rr_status } from 'src/assets/data/dropdown';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-view-all-repair-request',
  templateUrl: './view-all-repair-request.component.html',
  styleUrls: ['./view-all-repair-request.component.scss']
})
export class ViewAllRepairRequestComponent implements OnInit {
  // calendarEvents: EventInput[];
  //calendarEvents: EventInput[] = [];
  eventDate;
  tippyCurrent = null;
  // calendarApi: Calendar;
  //initialized = false;
  event;
  data2;
  data3;
  data4;
  data5;
  data6;
  data7;
  data8;
  data9;
  data10;
  status = [];
  customerList = [];
  vendorList = [];
  dateEventArrayObject: any = [];
  filteredDateEventArrayObject: any = [];
  // calendarOptions: CalendarOptions = {
  //   expandRows: true,
  //   slotDuration: '00:15',
  //   headerToolbar: {
  //     left: 'prev,next today',
  //     center: 'title',
  //     right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  //   },
  //   initialView: 'dayGridMonth',
  //   navLinks: true, // can click day/week names to navigate views
  //   editable: false,
  //   selectable: true,
  //   nowIndicator: true,
  //   dayMaxEvents: true,
  //   lazyFetching: true,
  //   //dateClick: this.handleDateClick.bind(this),
  //   // eventClick: this.handleEventClick.bind(this),
  //   eventMouseEnter: this.mouseOver.bind(this),
  // }

  statusFilterId = [];
  customerFilterId = [];
  vendorFilterId = [];
  onStatusChange(statusList) {
    this.statusFilterId = statusList.map(function (value) { return value.status_name; });
    this.filterEvents();
  }

  onCustomerChange(customerFilterId) {
    this.customerFilterId = customerFilterId.map(function (value) { return value.CustomerName; });
    this.filterEvents();
  }

  onVendorChange(vendorFilterId) {
    this.vendorFilterId = vendorFilterId.map(function (value) { return value.VendorName; });
    this.filterEvents();
  }
  // @ViewChild('calendar', null) calendarComponent: FullCalendarComponent;
  @ViewChild('tippyTemplate', null) tippyTemplate: ElementRef;


  filterEvents() {
    let obj = this;

    obj.filteredDateEventArrayObject = this.dateEventArrayObject;
    if (obj.statusFilterId.length) {
      obj.filteredDateEventArrayObject = obj.filteredDateEventArrayObject.filter(function (value) {
        return obj.statusFilterId.includes(value.Status);
      }, obj);
    }


    if (obj.customerFilterId.length) {
      obj.filteredDateEventArrayObject = obj.filteredDateEventArrayObject.filter(function (value) {
        return obj.customerFilterId.includes(value.customer_name);
      }, obj);
    }
    if (obj.vendorFilterId.length) {
      obj.filteredDateEventArrayObject = obj.filteredDateEventArrayObject.filter(function (value) {
        return obj.vendorFilterId.includes(value.vendor_name);
      }, obj);
    }
    // let calendarAPI = this.calendarComponent.getApi();
    // calendarAPI.getEventSources()[0].remove();
    // calendarAPI.addEventSource(this.filteredDateEventArrayObject);
  }
  constructor(private cd_ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {


    this.status = array_rr_status


    this.getCustomerList();
    this.getVendorList();
    this._fetchData();
  }


  _fetchData() {
    this.httpClient.get("assets/data/repair-request-list.json").subscribe(response => {
      if (response['data'].length > 0) {
        // this.calendarEvents = response['data'];

        // for (var calendardata of this.calendarEvents) {
        //   this.eventDate = {
        //     title: calendardata.title,
        //     start: calendardata.start,
        //     id: calendardata.id,
        //     backgroundColor: calendardata.backgroundColor,
        //     CreatedDate: calendardata.CreatedDate,
        //     Status: calendardata.Status,
        //     ref_no: calendardata.ref_no,
        //     Description: calendardata.Description,
        //     SerialNo: calendardata.SerialNo,
        //     vendor_name: calendardata.vendor_name,
        //     Price: calendardata.Price,
        //     customer_name: calendardata.customer_name


        //   }
        //   this.dateEventArrayObject.push(this.eventDate);
        //   this.filteredDateEventArrayObject.push(this.eventDate);
        // }


      }
      // let calendarAPI = this.calendarComponent.getApi();
      // calendarAPI.addEventSource(this.filteredDateEventArrayObject);

      this.cd_ref.detectChanges();
    }, error => console.log(error))
  }



  // ngAfterViewChecked() {
  //   this.calendarApi = this.calendarComponent.getApi();

  //   if (this.calendarApi && !this.initialized) {
  //     this.initialized = true;
  //     this.loadEvents();
  //   }
  // }

  loadEvents() {
    this.event = {
      id: 1,
      title: 'GM, Bedford Powertrain' + '&nbsp;' + 'RR043678' + '&nbsp;' + 'AHR-N20764',
      start: '2020-10-10T12:42:00',
      backgroundColor: '#1abc9c',
      CreatedDate: '09/10/2020 10:00AM',
      Status: 'Completed',
      ref_no: 'TAG#6932',
      Description: 'Repair of Grundfos MTR3-6/6 B-W-A-HUUV Pump, Water, 60 Hz, 1.50 kW, Model A98344102P31623',
      SerialNo: 'G11L28379',
      vendor_name: 'SEW USA Troy Assembly',
      Price: '$11991.00'
    },
      this.data2 = {
        id: 2,
        title: 'Acromatic Deep Hole Drilling' + '&nbsp;' + 'RR043678' + '&nbsp;' + 'AHR-N20764',
        start: '2020-10-14T11:00:00',
        backgroundColor: '#f7b84b',
        CreatedDate: '12/10/2020 05:00PM',
        Status: 'Awaiting Vendor Quote',
        ref_no: 'MRO#028-12008R',
        Description: 'Repair of SMC Pneumatics VBA20AF03 Air Regulator w/o Gage',
        SerialNo: '11819',
        vendor_name: 'GearX',
        Price: '$300.00'
      }
    this.data3 = {

      id: 3,
      title: 'Ford UC' + '&nbsp;' + 'RR043654' + '&nbsp;' + ' 21010139',
      start: '2020-10-16T15:00:00',
      backgroundColor: '#d1dee4',
      CreatedDate: '16/10/2020 03:00PM',
      Status: '	Repair In Progress',
      ref_no: 'RMA',
      Description: 'Repair of Durr Turbine',
      SerialNo: '10021289',
      vendor_name: '',
      Price: '$0.00'
    }
    this.data4 = {

      id: 4,
      title: 'Amazon ONT8' + '&nbsp;' + 'RR043655' + '&nbsp;' + 'AHR-VBM3710TD',
      start: '2020-10-08T11:00:00',
      backgroundColor: '#6559cc',
      CreatedDate: '08/10/2020 10:00AM',
      Status: 'Needs Sourcing',
      ref_no: 'APN: 53906',
      Description: 'Repair of Baldor Electric Motor VBM3710T-D Spec. 37M909S150H1 7.5hp',
      SerialNo: 'F1406160080',
      vendor_name: 'A & P Tool',
      Price: '$400.00'
    }
    this.data4 = {

      id: 5,
      title: 'RIC' + '&nbsp;' + 'RR043657' + '&nbsp;' + '21010139',
      start: '2020-10-18T12:00:00',
      backgroundColor: '#37cde6',
      CreatedDate: '17/10/2020 05:00PM',
      Status: 'Customer Quote Submitted',
      ref_no: 'RMA',
      Description: 'Repair of Durr Turbine',
      SerialNo: '190865',
      vendor_name: 'ADVANCED',
      Price: '$1300.00'
    }
    this.data5 = {

      id: 6,
      title: 'Greg Nazareth' + '&nbsp;' + 'RR043656' + '&nbsp;' + 'RR043656',
      start: '2020-10-12T09:00:00',
      backgroundColor: '#f672a7',
      CreatedDate: '10/10/2020 05:00PM',
      Status: 'Needs to be Resourced',
      ref_no: 'RFS00',
      Description: 'Repair of Durr Turbine',
      SerialNo: '173148',
      vendor_name: '2V INDUSTRIES',
      Price: '$1500.00'
    }
    this.data6 = {

      id: 7,
      title: 'Ventra Grand Rapids #5' + '&nbsp;' + 'RR043659' + '&nbsp;' + 'AHR-24428KA41BLB10791',
      start: '2020-10-03T08:00:00',
      backgroundColor: '#6559cc',
      CreatedDate: '02/10/2020 03:00PM',
      Status: 'Needs Sourcing',
      ref_no: 'TAG#6933',
      Description: 'Repair Of VAT Vacuum 24vdc 250V Reg#2751#24428KA41BLB10791',
      SerialNo: 'AHVG45001',
      vendor_name: 'AH AMERICAN HYDROSTATICS',
      Price: '$10.00'
    }
    this.data7 = {

      id: 8,
      title: 'TERRI LUSK' + '&nbsp;' + 'RR043667' + '&nbsp;' + 'AHR-B287380001',
      start: '2020-10-06T13:00:00',
      backgroundColor: '#38414a',
      CreatedDate: '11/10/2020 08:00PM',
      Status: 'RR Generated',
      ref_no: '',
      Description: 'Repair of August Mossner GmbH B287380001 Spindle',
      SerialNo: 'M287300002',
      vendor_name: 'AUTO TECHNOLOGY',
      Price: '$200.00'
    }
    this.data8 = {

      id: 9,
      title: 'GM, Bedford Powertrain' + '&nbsp;' + 'RR043677' + '&nbsp;' + 'AHR-VBA20AF03',
      start: '2020-10-22T14:00:00',
      backgroundColor: '#f1556c',
      CreatedDate: '09/10/2020 05:00PM',
      Status: 'Quote Rejected',
      ref_no: '',
      Description: 'Repair of SMC Pneumatics VBA20AF03 Air Regulator w/o Gage',
      SerialNo: '91420',
      vendor_name: 'GearX',
      Price: '$0.00'
    }
    // this.data10={

    //   id: 2,
    //   title:'Acromatic Deep Hole Drilling'+'&nbsp;'+'RR043678'+'&nbsp;'+'AHR-N20764',
    //   start: '2020-10-14T11:00:00',
    //   backgroundColor: '#f7b84b',
    //    CreatedDate:'12/10/2020 05:00PM',
    //    Status:'waiting Supplier Quote',
    //    ref_no:'MRO#028-12008R',
    //    Description:'Repair of SMC Pneumatics VBA20AF03 Air Regulator w/o Gage',
    //    SerialNo:'11819',
    //    vendor_name:'GearX',
    //    Price:'$300.00'
    // }
    // this.calendarEvents.push(this.event);
    // this.calendarEvents.push(this.data2);
    // this.calendarEvents.push(this.data3);
    // this.calendarEvents.push(this.data4);
    // this.calendarEvents.push(this.data5);
    // this.calendarEvents.push(this.data6);
    // this.calendarEvents.push(this.data7);
    // this.calendarEvents.push(this.data8);
    // this.calendarApi.removeAllEventSources();
    // this.calendarApi.addEventSource(this.calendarEvents);
  }




  mouseOver(event) {
    let eventProps = event.event.toPlainObject();
    let content = this.tippyTemplate.nativeElement.innerHTML.replace('[title]', eventProps.title);
    //let guestType = this.guestDropdown[eventProps.extendedProps.guestType];
    content = content.replace('[background]', eventProps.backgroundColor);
    content = content.replace('[background]', eventProps.backgroundColor);
    content = content.replace('[createdDate]', eventProps.extendedProps.CreatedDate || "-");
    content = content.replace('[Status]', eventProps.extendedProps.Status || "-");
    content = content.replace('[ref_no]', eventProps.extendedProps.ref_no || "-");
    content = content.replace('[Description]', eventProps.extendedProps.Description || "-");
    //content = content.replace('[created_on]', (this..transform(eventProps.extendedProps.CreatedOnDateTime, 'mediumDate') + ' ' + this.datepipe.transform(eventProps.extendedProps.CreatedOnDateTime, 'shortTime')));
    content = content.replace('[SerialNo]', eventProps.extendedProps.SerialNo || "-");
    content = content.replace('[vendor_name]', eventProps.extendedProps.vendor_name);
    content = content.replace('[Price]', eventProps.extendedProps.Price || "-");

    if (this.tippyCurrent != null) this.tippyCurrent.destroy();
    this.tippyCurrent = tippy(event.el, {
      content: content,
      zIndex: 100000,
      animateFill: true,
      allowHTML: true,
      theme: 'light',
      popperOptions: {
        strategy: 'fixed',
      }
    });
  }



  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName , "CustomerId": value.CustomerId }
      });
    });
  }


  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }

}




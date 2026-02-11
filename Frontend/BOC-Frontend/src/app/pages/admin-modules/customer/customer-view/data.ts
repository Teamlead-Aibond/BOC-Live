import { ChartType } from "./profile.model";
const projectData = [
  {
    id: 1,
    name: "SO018237",
    startdate: "10/30/2019",
    duedate: "12/02/2019",
    client: "",
    status: "Open",
  },
  {
    id: 2,
    name: "	SO018246",
    startdate: "10/30/2019",
    duedate: "12/02/2019",
    client: "",
    status: "Open",
  },
  {
    id: 3,
    name: "SO018485",
    startdate: "11/04/2019",
    duedate: "11/28/2019",
    client: "",
    status: "Open",
  },
  {
    id: 4,
    name: "SO018248",
    startdate: "10/30/2019",
    duedate: "11/25/2019",
    client: "",
    status: "Closed",
  },
  {
    id: 5,
    name: "SO018249",
    startdate: "10/30/2019",
    duedate: "11/25/2019",
    client: "",
    status: "Open",
  },
];

const RepairRequestData = [
  {
    id: 1,
    RRNo: "RR028810",
    Part: "MAT1",
    Desc: "micro attire",
    Serial: "AM1",
    Vendor: "Ford B63 - Lima Engine Plant",
    Date: "09/09/2020",
    Status: "Completed",
  },
  {
    id: 2,
    RRNo: "	RR028788",
    Part: "AHR-GKPART11",
    Desc: "WTC INVERTER - 9021830 - SN: 15038314 - K500-600VAC/400A",
    Serial: "SN0011",
    Vendor: "Ford B63 - Lima Engine Plant",
    Date: "10/07/2020",
    Status: "Repair In Progress",
  },
];

const ContractData = [
  {
    id: 1,
    ContractNo: "2VI1891",
    startdate: "02/13/2020",
    enddate: "02/13/2075",
    MaximumDollars: "US$ 0.00",
    PurchasedDollars: "US$ 0.00",
  },
];

const VendorCostData = [
  {
    id: 1,
    Year: "2020",
    Price: "US $ 2164.55",
  },
  {
    id: 2,
    Year: "2019",
    Price: "US $ 152.00",
  },

  {
    id: 3,
    Year: "2018",
    Price: "US $ 0.00",
  },

  {
    id: 4,
    Year: "02/13/2020",
    Price: "US $ 0.00",
  },
];
const UsersData = [
  {
    id: 1,
    userId: "2VI1891_VENDOR",
    name: "Sana Sayyed",
    rights: "Manage User Rights",
    assigned: "Customer Assigned",
    status: "No",
  },
  {
    id: 2,
    userId: "2vi1891",
    name: "Super User",
    rights: "Manage User Rights",
    assigned: "Customer Assigned",
    status: "Yes",
  },
];

const CapabilitiesData = [
  {
    id: 1,
    Manufacturer: "A & P TOOL",
    Commodity: "MRO",
  },
  {
    id: 2,
    Manufacturer: "CENTERLINE WINDSOR",
    Commodity: "ELECTRONICS",
  },
];

const VendorContact = [
  {
    id: 1,
    name: "Sana Sayyed",
    jobTitle: "Production Manager",
    department: "Production",
    phone: "260-925-2316",
    email: "WHAYSE@2VINDUSTRIES.COM",
    primary: "Yes",
  },
  {
    id: 2,
    name: "Super User",
    jobTitle: "HR Manager",
    department: "HR",
    phone: "248-624-1824",
    email: "WHAYSE@2VINDUSTRIES.COM",
    primary: "No",
  },
];

const generateDayWiseTimeSeries = (baseval, count, yrange) => {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = baseval;
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
};

const revenueAreaChart: ChartType = {
  series: [
    {
      name: "2V INDUSTRIES Quote",
      // data: [44, 55, 41, 15, 50, 45, 78, 12, 45]
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2019 GMT").getTime(),
        20,
        {
          min: 100,
          max: 1500,
        }
      ),
    },
    {
      name: "Aibond Quote",
      // data: [94, 45, 41, 25, 57, 55, 88, 82, 65]
      data: generateDayWiseTimeSeries(
        new Date("11 Feb 2019 GMT").getTime(),
        20,
        {
          min: 100,
          max: 1000,
        }
      ),
    },
  ],
  toolbar: {
    show: false,
  },
  xaxis: {
    type: "datetime",
  },
  height: 320,
  stacked: true,
  events: {
    selection: (chart, e) => {
      console.log(new Date(e.xaxis.min));
    },
  },
  colors: ["#3bafda", "#CED4DC"],
  type: "area",
  stroke: {
    width: 2,
    curve: "smooth",
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.3,
      opacityTo: 0.9,
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
  tooltip: {
    y: {
      formatter(val) {
        return "$ " + val;
      },
    },
  },
  yaxis: {
    title: {
      text: "Amount $",
      offsetX: -20,
      style: {
        color: undefined,
        fontSize: "13px",
        cssClass: "apexcharts-yaxis-title",
      },
    },
  },
};

const PerformanceData = [
  {
    title: "Performance (Order: 38, On time: 6)",
    minValue: 0,
    default: 6,
    maxValue: 38,
    option: {
      floor: 0,
      ceil: 38,
      disabled: true,
    },
  },
];

const PartsData = [
  {
    id: 1,
    PartNo: "MAT1",
    PartDesc: "micro attire",
    primary: "Yes",
  },
  {
    id: 2,
    PartNo: "AHR-532270",
    PartDesc: "Repair of Festo Checkbox CHB-C-P",
    primary: "No",
  },
];

const cardData = [
  {
    icon: "fa-file-invoice-dollar",
    tickets: 15,
    title: "Quotes Submitted",
    text: "danger",
  },
  {
    icon: "fa-file-invoice-dollar",
    tickets: 10,
    title: "Quotes Accepted",
    text: "purple",
  },
  {
    icon: "fe-delete",
    tickets: 3,
    title: "Quotes Rejected",
    text: "danger",
  },
  {
    icon: "fas fa-tools",
    tickets: 15,
    title: "Total Requests",
  },
  {
    icon: "fas fa-dollar-sign",
    tickets: "6",
    title: "Received Invoices",
    text: "info",
  },
  {
    icon: "fas fa-file-invoice-dollar",
    tickets: "2",
    title: "Pending Invoices",
    text: "warning",
  },
  {
    icon: "far fa-thumbs-up",
    tickets: 8,
    title: "Completed",
    text: "success",
  },
  {
    icon: "fas fa-ellipsis-h",
    tickets: 2,
    title: "In Progress",
    text: "secondary",
  },
];

export {
  RepairRequestData,
  PartsData,
  PerformanceData,
  UsersData,
  projectData,
  revenueAreaChart,
  VendorContact,
  CapabilitiesData,
  ContractData,
  VendorCostData,
  cardData,
};

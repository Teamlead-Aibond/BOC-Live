import { ChartType } from "./profile.model";
const projectData = [
  {
    id: 1,
    name: "PO033042",
    startdate: "01/01/2015",
    duedate: "10/15/2018",
    status: "$ 0.00",
    client: "PeoplePlusSoftware",
  },
  {
    id: 2,
    name: "	PO033041",
    startdate: "21/07/2016",
    duedate: "12/05/2018",
    status: "$ 5.25",
    client: "SuperUser",
  },
  {
    id: 3,
    name: "PO033040",
    startdate: "18/03/2018",
    duedate: "28/09/2018",
    status: "-",
    client: "SuperUser",
  },
  {
    id: 4,
    name: "PO033034",
    startdate: "02/10/2017",
    duedate: "07/05/2018",
    status: "$ 74.08",
    client: "SuperUser",
  },
  {
    id: 5,
    name: "PO033033",
    startdate: "17/01/2017",
    duedate: "25/05/2021",
    status: "$ 0.00",
    client: "SuperUser",
  },
];

const RepairRequestData = [
  {
    id: 1,
    RRNo: "RR028810",
    Part: "MAT1",
    Desc: "micro attire",
    Serial: "AM1",
    Vendor: " A & P TOOL, 2V INDUSTRIES",
    Date: "09/09/2020",
    Status: "Completed",
  },
  {
    id: 2,
    RRNo: "	RR028788",
    Part: "AHR-GKPART11",
    Desc: "WTC INVERTER - 9021830 - SN: 15038314 - K500-600VAC/400A",
    Serial: "SN0011",
    Vendor: "A & P TOOL",
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
    title: "Total Orders: 38, On time: 6",
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
    Price: "$100",
    LastPurchasedDate: "02/13/2020",
    PartDesc: "micro attire",
    primary: "Yes",
  },
  {
    id: 2,
    PartNo: "AHR-532270",
    Price: "$150",
    LastPurchasedDate: "02/13/2020",
    PartDesc: "Repair of Festo Checkbox CHB-C-P",
    primary: "No",
  },
];

const cardData = [
  {
    icon: "fa-file-invoice-dollar",
    tickets: 15,
    title: "Awaiting Quotes",
    text: "info",
  },
  {
    icon: "fas fa-tools",
    tickets: 15,
    title: "Quoted",
  },
  {
    icon: "fa-file-invoice-dollar",
    tickets: 10,
    title: "Quotes Approved",
    text: "purple",
  },
  {
    icon: "fas fa-dollar-sign",
    tickets: "2",
    title: "Rush or Warranty",
    text: "primary",
  },
  {
    icon: "fas fa-ellipsis-h",
    tickets: 2,
    title: "In Progress",
    text: "secondary",
  },
  {
    icon: "fe-delete",
    tickets: 3,
    title: "Quotes Rejected",
    text: "danger",
  },
  {
    icon: "fe-delete",
    tickets: 3,
    title: "Overdue",
    text: "warning",
  },
  {
    icon: "fe-delete",
    tickets: 3,
    title: "Due Today",
    text: "danger",
  },
  {
    icon: "far fa-thumbs-up",
    tickets: 8,
    title: "Completed",
    text: "success",
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

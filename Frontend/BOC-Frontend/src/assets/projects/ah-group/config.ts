const CONFIG = {
  menuList: [
    {
      name: "Dashboards",
      icon: "remixicon-dashboard-line",
      href: "/admin/dashboard/ah-dashboard",
      children: [],
    },
    {
      name: "Repair Request",
      icon: "fas fa-tools",
      href: "#",
      children: [
        {
          name: "Repair Request List",
          icon: "",
          href: "/admin/repair-request/list",
          children: [],
        },
        {
          name: "Repair Request List (Basic)",
          icon: "",
          href: "/admin/repair-request/basic-RR-list",
          children: [],
        },
        {
          name: "Bulk Shipping List",
          icon: "",
          href: "/admin/repair-request/bulk-shipping-list",
          children: [],
        },
        {
          name: "Shipping-Ready for Pick Up List",
          icon: "",
          href: "/admin/repair-request/shipping-list",
          children: [],
        },
        {
          name: "UPS Label Generate",
          icon: "",
          href: "/admin/ups",
          children: [],
        },
        {
          name: "UPS Address Validation",
          icon: "",
          href: "/admin/ups-address",
          children: [],
        },
        {
          name: "UPS Tracking Cancel",
          icon: "",
          href: "/admin/ups-cancel",
          children: [],
        },
        {
          name: "RR Batch Login",
          icon: "",
          href: "/admin/repair-request/batch-list",
          children: [],
        },
        {
          name: "RR Vendor Quote Attachment",
          icon: "",
          href: "/admin/rr-vendorquote-attachmentlist",
          children: [],
        },
      ],
    },
    {
      name: "MRO",
      icon: "fas fa-toolbox",
      href: "#",
      children: [
        { name: "MRO List", icon: "", href: "/admin/mro/list", children: [] },
      ],
    },
    {
      name: "Online Store",
      icon: "fas fa-shopping-cart",
      href: "#",
      children: [
        {
          name: "Dashboard",
          icon: "",
          href: "/admin/shop/dashboard",
          children: [],
        },
        {
          name: "Shop",
          icon: "",
          href: "/admin/shop/product-list",
          children: [],
        },
        { name: "Cart", icon: "", href: "/admin/shop/cart", children: [] },
        {
          name: "Request For Quotes",
          icon: "",
          href: "/admin/shop/list-request-a-quote",
          children: [],
        },
        {
          name: "Order History",
          icon: "",
          href: "/admin/shop/order-history",
          children: [],
        },
      ],
    },
    {
      name: "Vendor",
      icon: "fas fa-users-cog",
      href: "#",
      children: [
        {
          name: "Vendor List",
          icon: "",
          href: "/admin/vendor/list",
          children: [],
        },
      ],
    },
    {
      name: "Customers",
      icon: "fas fa-users",
      href: "#",
      children: [
        {
          name: "Customer List",
          icon: "",
          href: "/admin/customer/list",
          children: [],
        },
        {
          name: "Blanket PO List",
          icon: "",
          href: "/admin/Blanket-PO-List",
          children: [],
        },
        {
          name: "Blanket PO Excluded Parts",
          icon: "",
          href: "/admin/Blanket-PO-Excluded-Parts",
          children: [],
        },
      ],
    },

    {
      name: "Quotes",
      icon: "remixicon-todo-line",
      href: "#",
      children: [
        {
          name: "Sales Quote List",
          icon: "",
          href: "/admin/Quotes-List",
          children: [],
        },
      ],
    },
    {
      name: "Orders",
      icon: "fas fa-shopping-cart",
      href: "#",
      children: [
        {
          name: "Sales Order List",
          icon: "",
          href: "/admin/SO-Order-List",
          children: [],
        },
        {
          name: "Purchase Order List",
          icon: "",
          href: "/admin/PO-Order-List",
          children: [],
        },
      ],
    },
    {
      name: "Invoices",
      icon: "fas fa-file-invoice-dollar",
      href: "#",
      children: [
        {
          name: "Invoice List",
          icon: "",
          href: "/admin/Invoice-List",
          children: [],
        },
        {
          name: "Vendor Bills List",
          icon: "",
          href: "/admin/VendorBill-List",
          children: [],
        },
        {
          name: "Consolidate Invoice List",
          icon: "",
          href: "/admin/ConsolidateInvoice-List",
          children: [],
        },
        { name: "EDI Log", icon: "", href: "/admin/EDI-Log", children: [] },
      ],
    },
    {
      name: "Reports",
      icon: "fa fa-file",
      href: "/admin/reports",
      children: [],
    },
    {
      name: "Inventory",
      icon: "fas fa-box-open",
      href: "#",
      children: [
        {
          name: "Inventory Dashboard",
          icon: "",
          href: "/admin/inventory/dashboard",
          children: [],
        },
        {
          name: "RFID Dashboard",
          icon: "",
          href: "/admin/inventory/RFID-dashboardv1",
          children: [],
        },
        {
          name: "Inventory List",
          icon: "",
          href: "/admin/inventory/list",
          children: [],
        },
        {
          name: "Stock In",
          icon: "",
          href: "/admin/inventory/stockin-list",
          children: [],
        },
        {
          name: "Stock Out",
          icon: "",
          href: "/admin/inventory/stockout-list",
          children: [],
        },
        {
          name: "Indent",
          icon: "",
          href: "/admin/inventory/indent",
          children: [],
        },
        {
          name: "Transfer Product",
          icon: "",
          href: "/admin/inventory/transfer-product",
          children: [],
        },
        {
          name: "Receive Product",
          icon: "",
          href: "/admin/inventory/receive-product",
          children: [],
        },
        {
          name: "Damage Comments",
          icon: "",
          href: "/admin/inventory/damage-list",
          children: [],
        },
        {
          name: "Part Tracking",
          icon: "",
          href: "/admin/inventory/part-tracking",
          children: [],
        },
        {
          name: "Employee",
          icon: "",
          href: "/admin/Employee-List",
          children: [],
        },
        {
          name: "Employee Responsibility List",
          icon: "",
          href: "/admin/Employee-Responsibility-List",
          children: [],
        },
        {
          name: "Inventory Settings",
          icon: "",
          href: "/admin/inventory-settings",
          children: [],
        },
      ],
    },
    {
      name: "Admin",
      icon: "fas fa-user-shield",
      href: "#",
      children: [
        {
          name: "Masters",
          icon: "",
          href: "#",
          children: [
            {
              name: "Parts List",
              icon: "",
              href: "/admin/total-PartsList",
              children: [],
            },
            {
              name: "Parts List - Store",
              icon: "",
              // href: "/admin/total-PartsList-store",
              href: "/admin/PartsList-amazonstore",
              children: [],
            },
            {
              name: "User Roles",
              icon: "",
              href: "/admin/user-roles/list",
              children: [],
            },
            {
              name: "Countries",
              icon: "",
              href: "/admin/countries/list",
              children: [],
            },
            {
              name: "State",
              icon: "",
              href: "/admin/state/list",
              children: [],
            },
            {
              name: "Terms",
              icon: "",
              href: "/admin/terms/list",
              children: [],
            },
            {
              name: "Manage Currency",
              icon: "",
              href: "/admin/currency-list",
              children: [],
            },
            {
              name: "Manage Currency Exchange Rate",
              icon: "",
              href: "/admin/currency-exchange-rate-list",
              children: [],
            },
            {
              name: "Manage RR Sub Status",
              icon: "",
              href: "/admin/Sub-Status",
              children: [],
            },
            {
              name: "Manage Part Location",
              icon: "",
              href: "/admin/Part-Location",
              children: [],
            },
            {
              name: "Store Location",
              icon: "",
              href: "/admin/store-location",
              children: [],
            },
            {
              name: "Customer Group",
              icon: "",
              href: "/admin/customer-group",
              children: [],
            },
          ],
        },
        { name: "Admin List", icon: "", href: "/admin/list", children: [] },
        { name: "Login Log List", icon: "", href: "/admin/Login-LogList", children: [] },
        {
          name: "Settings",
          icon: "",
          href: "/admin/admin-settings",
          children: [],
        },
        {
          name: "Inventory Masters",
          icon: "",
          href: "#",
          children: [
            {
              name: "Manage Warehouse",
              icon: "",
              href: "/admin/warehouse_list",
              children: [],
            },
            {
              name: "Manage Building",
              icon: "",
              href: "/admin/building_list",
              children: [],
            },
            {
              name: "Manage Room",
              icon: "",
              href: "/admin/room_list",
              children: [],
            },
            {
              name: "Manage Shelf",
              icon: "",
              href: "/admin/manage_shelf",
              children: [],
            },
            {
              name: "Manage Row",
              icon: "",
              href: "/admin/row_list",
              children: [],
            },
          ],
        }
      ],
    },
  ],
};
const BuildVersion = "4.7.10";
export { CONFIG, BuildVersion };

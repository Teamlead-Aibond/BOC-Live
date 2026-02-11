const CONFIG = {
  menuList : [
      {
          name : 'Dashboards',
          icon : 'remixicon-dashboard-line',
          href: '#',
          children : [
              {name : 'RFID Dashboard', icon : '', href : '/admin/inventory/RFID-dashboardv1', children: []},
              {name : 'Inventory Dashboard', icon : '', href : '/admin/inventory/dashboard', children: []},
          ]
      },
      {
          name : 'Inventory',
          icon : 'fas fa-box-open',
          href: '#',
          children : [
              {name : 'Inventory List', icon : '', href : '/admin/inventory/list', children: []},
              {name : 'Stock In', icon : '', href : '/admin/inventory/stockin-list', children: []},
              {name : 'Stock Out', icon : '', href : '/admin/inventory/stockout-list', children: []},
              {name : 'Indent', icon : '', href : '/admin/inventory/indent', children: []},
              {name : 'Transfer Product', icon : '', href : '/admin/inventory/transfer-product', children: []},
              {name : 'Receive Product', icon : '', href : '/admin/inventory/receive-product', children: []},
              {name : 'Damage Comments', icon : '', href : '/admin/inventory/damage-list', children: []},
            //   {name : 'Stock Audit', icon : '', href : '/', children: []},
            //   {name : 'Part Tracking', icon : '', href : '/admin/inventory/part-tracking', children: []},
            // //   {name : 'Loss Prevention Control', icon : '', href : '/inventory/control', children: []},
            //   {name : 'Part Location', icon : '', href : '/admin/inventory/part-location', children: []},
          ]
      },
      {
          name : 'Admin',
          icon : 'fas fa-user-shield',
          href: '#',
          children : [
              {name : 'Admin List', icon : '', href : '/admin/list', children: []},
              {name : 'Settings', icon : '', href : '/admin/admin-settings', children: []},
              {name : 'Inventory Settings', icon : '', href : '/admin/inventory-settings', children: []},
              {name : 'Masters', icon : '', href : '#', children: [
                      {name : 'Manage Warehouse', icon : '', href : '/admin/warehouse_list', children : []},
                      {name : 'Manage Building', icon : '', href : '/admin/building_list', children : []},
                      {name : 'Manage Room', icon : '', href : '/admin/room_list', children : []},
                      {name : 'Manage Row', icon : '', href : '/admin/row_list', children : []},
                      {name : 'Manage Shelf', icon : '', href : '/admin/manage_shelf', children : []},
                    //   {name : 'Department List', icon : '', href : '#', children : []},
                      {name : 'User Roles', icon : '', href : '/admin/user-roles/list', children : []},
                      {name : 'Countries', icon : '', href : '/admin/countries/list', children : []},
                      {name : 'State', icon : '', href : '/admin/state/list', children : []},
                      {name : 'Terms', icon : '', href : '/admin/terms/list', children : []},
                  ]},
          ]
      },
  ]
};

export {CONFIG};

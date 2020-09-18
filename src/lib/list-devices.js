#!/usr/bin/env node
/*
For mac {
    vendorId: 1133,
    productId: 49695,
    path: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC1@14/XHC1@14000000/HS04@14400000/IOUSBHostDevice@14400000/AppleUSB20Hub@14400000/AppleUSB20HubPort@14420000/USB 2.0 Hub@14420000/AppleUSB20Hub@14420000/AppleUSB20HubPort@14423000/Wireless Gamepad F710@14423000/Xbox360Peripheral/Xbox360ControllerClass',
    serialNumber: '89CA9F99',
    manufacturer: 'Logitech',
    product: 'Xbox 360 Wired Controller',
    release: 0,
    interface: -1,
    usagePage: 1,
    usage: 1
  },

*/
var HID = require('node-hid');

// Linux: choose driverType
// default is 'hidraw', can also be 'libusb'
if( process.argv[2] ) {
    var type = process.argv[2];
    console.log("driverType:",type);
    HID.setDriverType( type );
}

console.log('devices:', HID.devices());

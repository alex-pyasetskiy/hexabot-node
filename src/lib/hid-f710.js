var HID = require('node-hid');
var devices = HID.devices();

var deviceInfo = devices.find( function(d) {
    return d.vendorId===1133 && d.productId===49695;
});

console.log(deviceInfo);

if( deviceInfo ) {
  var device = new HID.HID( deviceInfo.path );
  
  device.on("data", function(data) {
      console.log(data);
      var buf = {
        buffer: data,
        length: data.length
    };
    console.log(buf);
  });
  device.on("error", function(err) {
      console.log(err.toString());
  });

}
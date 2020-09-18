var HID = require('node-hid');
var devices = HID.devices();

var deviceInfo = devices.find( function(d) {
    return d.vendorId===1133 && d.productId===49695;
});

console.log(deviceInfo);

if( deviceInfo ) {
  var device = new HID.HID( deviceInfo.path );
  
  device.on("data", function(bytes) {
      var buf = {
        buffer: bytes,
        length: bytes.length,
        hex: bytes.toString("hex")
    };
    console.log(buf);
    const hex = bytes.toString("hex");

    let event = {
        fn: hex.slice(4,5),
        dpad: hex.slice(5,6),
        btn: hex.slice(6,8),
        lt: hex.slice(8, 10),
        rt: hex.slice(10,12),
        lah: hex.slice(12,16),
        lav: hex.slice(16,20),
        rah: hex.slice(20,24),
        rav: hex.slice(24, 28)
    }

    console.log(event)

  });
  device.on("error", function(err) {
      console.log(err.toString());
  });

}
const HID = require('node-hid');

var monitor = require('node-usb-detection');
console.log("Usb Devices:\n", monitor.list());

const EventEmitter = require('events');

const { GAMEPAD_VENDOR_ID, GAMEPAD_PRODUCT_ID } = require('./configs')

const devices = HID.devices();

const deviceInfo = devices.find( function(d) {
    return d.idVendor===GAMEPAD_VENDOR_ID && d.idProduct===GAMEPAD_PRODUCT_ID;
});

const GamepadEmitter = new EventEmitter();

if( deviceInfo ) {
    var device = new HID.HID( deviceInfo.path );
    console.log(deviceInfo);
    device.on("data", function(bytes) {
        const hex = bytes.toString("hex");
        GamepadEmitter.emit('START_BACK', hex.slice(4,5));
        GamepadEmitter.emit('DPAD', hex.slice(5,6));
        GamepadEmitter.emit('BUTTON', hex.slice(6,8));
        GamepadEmitter.emit('TRIGGER', bytes.readUIntBE(4, 1), bytes.readUIntBE(5, 1));
        GamepadEmitter.emit('LEFT_STICK', bytes.readUIntBE(6, 2), bytes.readUIntBE(8, 2));
        GamepadEmitter.emit('RIGHT_STICK', bytes.readUIntBE(10, 2), bytes.readUIntBE(12, 2));

    });

    device.on("error", function(err) {
        console.log(err.toString());
    });
}

module.exports.ControllerEvents = GamepadEmitter;
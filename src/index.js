const HID = require('node-hid');
const colors = require('colors')

const EventEmitter = require('events');

// const hexapod = require("./hexapod");
const configs = require("./configs");
const { solveInverseKinematics } = require('./hexapod/solvers/ik/hexapodSolver');
const { getWalkSequence } = require("./hexapod/solvers/walkSequenceSolver");
const { controllerCMD } = require('./hexapod/servo');

const devices = HID.devices();

const deviceInfo = devices.find( function(d) {
    return d.vendorId===1133 && d.productId===49695;
});

const GamepadEmitter = new EventEmitter();

const countSteps = sequence => sequence["leftMiddle"].alpha.length

const getPose = (sequences, i) => {
    return Object.keys(sequences).reduce((newSequences, legPosition) => {
        const { alpha, beta, gamma } = sequences[legPosition]
        newSequences[legPosition] = { alpha: alpha[i], beta: beta[i], gamma: gamma[i] }
        return newSequences
    }, {})
}

function main() {

    if( deviceInfo ) {
        var device = new HID.HID( deviceInfo.path );
        
        device.on("data", function(bytes) {
            const hex = bytes.toString("hex");
            console.debug(bytes);
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
}

const reset = () => {
    console.log("Resetting position...")
    const result = solveInverseKinematics(
        configs.DEFAULT_DIMENSIONS,
        configs.DEFAULT_IK_PARAMS
    )
    console.dir(result);
}

const setPose = (ikParams) => {
    const result = solveInverseKinematics(configs.DEFAULT_DIMENSIONS, ikParams)
    const cmd = controllerCMD(result.pose).join("");    
}

function move(isForward, inWalkMode) {
    const walkSequence = getWalkSequence(configs.DEFAULT_DIMENSIONS, configs.DEFAULT_GAIT_PARAMS, "tripod", "walking");
    const stepCount  = countSteps(walkSequence);
    const animationCount = 1;
    let tempStep = isForward ? animationCount : stepCount - animationCount;
    let step = Math.max(0, Math.min(stepCount - 1, tempStep));
    let pose = getPose(walkSequence, step)
    const cmd = controllerCMD(pose).join("");
    console.log(step, cmd);
}

GamepadEmitter.on('START_BACK', (value) => {
    switch(parseInt(value)) {
        case 1:
            // stadn up
            console.log('start pressed')
            setPose({hipStance: 0, legStance: "0", rx: 0, ry: 0, rz: 0, tx: 0, ty: 0, tz: 0});
          break;
        case 2:
            // Sitdown
            console.log('back pressed');
            setPose({ hipStance: 0, legStance: "70", rx: 0, ry: 0, rz: 0, tx: 0, ty: 0, tz: 0 });
          break;
        case 3:
            // reset
            console.log('start + back pressed');
            reset();
            break
        default:
            console.log('0 state - buttons released')
      }
});

GamepadEmitter.on('DPAD', (value) => {
    // console.log(`DPAD pressed ${value}`);
});

GamepadEmitter.on('BUTTON', (value) => {
    // x y b a | X or logitech btn | top triggers LB and RB
    // console.log(`BUTTON pressed ${value}`);
});

GamepadEmitter.on('TRIGGER', (LTValue, RTValue) => {
    // console.log(`TRIGGER pressed ${LTValue}, ${RTValue}`);
});

GamepadEmitter.on('LEFT_STICK', (x_val, y_val) => {
    switch (true){
        case y_val < 10000:
            var moveId = setInterval(move, 1000, true, true);
            console.log("walk forward")
            break;
        case y_val > 45000:
            console.log('move backward');
            break;
        default:
            clearTimeout(moveId);
            console.log("stop");
    }
    console.log(`LEFT_STICK pressed ${x_val}, ${y_val}`);
});

GamepadEmitter.on('RIGHT_STICK', (x_val, y_val) => {
    console.log(`START_BACK pressed ${x_val}, ${y_val}`);
});


main();
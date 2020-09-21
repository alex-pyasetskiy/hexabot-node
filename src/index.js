
const { ControllerEvents } = require('./gamepad');

const configs = require("./configs");
const { solveInverseKinematics } = require('./hexapod/solvers/ik/hexapodSolver');
const { getWalkSequence } = require("./hexapod/solvers/walkSequenceSolver");
const { controllerCMD } = require('./hexapod/servo');


const countSteps = sequence => sequence["leftMiddle"].alpha.length

const getPose = (sequences, i) => {
    return Object.keys(sequences).reduce((newSequences, legPosition) => {
        const { alpha, beta, gamma } = sequences[legPosition]
        newSequences[legPosition] = { alpha: alpha[i], beta: beta[i], gamma: gamma[i] }
        return newSequences
    }, {})
}

function main() {
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

ControllerEvents.on('START_BACK', (value) => {
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

ControllerEvents.on('DPAD', (value) => {
    // console.log(`DPAD pressed ${value}`);
});

ControllerEvents.on('BUTTON', (value) => {
    // x y b a | X or logitech btn | top triggers LB and RB
    // console.log(`BUTTON pressed ${value}`);
});

ControllerEvents.on('TRIGGER', (LTValue, RTValue) => {
    // console.log(`TRIGGER pressed ${LTValue}, ${RTValue}`);
});

ControllerEvents.on('LEFT_STICK', (x_val, y_val) => {
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

ControllerEvents.on('RIGHT_STICK', (x_val, y_val) => {
    console.log(`START_BACK pressed ${x_val}, ${y_val}`);
});


main();
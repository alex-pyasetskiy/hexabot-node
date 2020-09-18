const hexapod = require("./hexapod");
const configs = require("./configs");

function main() {
    let res = hexapod.solveInverseKinematics(configs.DEFAULT_DIMENSIONS, configs.DEFAULT_IK_PARAMS);
    console.log(res);
}

setInterval(main, 5000);
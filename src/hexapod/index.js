const { VirtualHexapod } = require("./VirtualHexapod");
const { solveInverseKinematics } = require("./solvers/ik/hexapodSolver");
const { POSITION_NAMES_LIST } = require("./constants");
const { controllerCMD } = require("./servo");

module.exports = {
    VirtualHexapod: VirtualHexapod,
    solveInverseKinematics: solveInverseKinematics,
    POSITION_NAMES_LIST: POSITION_NAMES_LIST,
    controllerCMD: controllerCMD
}

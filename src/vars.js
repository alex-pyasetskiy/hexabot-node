const BOARD_SOCKET = "ws://192.168.31.147:81/"


const ANGLE_NAMES = [
    "alpha", 
    "beta",
    "gamma"
]
const DIMENSION_NAMES = [
    "front", 
    "side", 
    "middle", 
    "coxia", 
    "femur", 
    "tibia"
]

const LEG_NAMES = [
    "leftFront",
    "rightFront",
    "leftMiddle",
    "rightMiddle",
    "leftBack",
    "rightBack",
]

const rangeParams = absVal => ({ minVal: -absVal, maxVal: absVal, stepVal: 1 })

const RANGES = {
    30: rangeParams(30),
    45: rangeParams(45),
    60: rangeParams(60),
    90: rangeParams(90),
    180: rangeParams(180),
}

const translateInputs = { minVal: -1, maxVal: 1, stepVal: 0.01 }

const RANGE_PARAMS = {
    dimensionInputs: { minVal: 0, maxVal: Infinity, stepVal: 1 },
    tx: translateInputs,
    ty: translateInputs,
    tz: translateInputs,
    rx: RANGES[30],
    ry: RANGES[30],
    rz: RANGES[60],
    legStance: RANGES[90],
    hipStance: RANGES[60],
    alpha: RANGES[45],
    beta: RANGES[90],
    gamma: RANGES[60],
}

const GAIT_RANGE_PARAMS = {
    tx: { minVal: -0.25, maxVal: 0.25, stepVal: 0.01, defaultVal: 0 },
    tz: { minVal: -0.5, maxVal: 0.5, stepVal: 0.01, defaultVal: -0.1 },
    rx: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    ry: { minVal: -15, maxVal: 15, stepVal: 0.5, defaultVal: 0 },
    legStance: { minVal: -80, maxVal: 40, stepVal: 1, defaultVal: -25 },
    hipStance: { minVal: 0, maxVal: 40, stepVal: 1, defaultVal: 20 },
    hipSwing: { minVal: 10, maxVal: 40, stepVal: 1, defaultVal: 15 },
    liftSwing: { minVal: 10, maxVal: 70, stepVal: 1, defaultVal: 40 },
    stepCount: { minVal: 2, maxVal: 15, stepVal: 1, defaultVal: 2 },
}

module.exports = {
    GAIT_RANGE_PARAMS: GAIT_RANGE_PARAMS,
    RANGE_PARAMS: RANGE_PARAMS,
    RANGES: RANGES,
    LEG_NAMES: LEG_NAMES,
    DIMENSION_NAMES: DIMENSION_NAMES,
    ANGLE_NAMES: ANGLE_NAMES,
    BOARD_SOCKET: BOARD_SOCKET
}

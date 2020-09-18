import solveInverseKinematics from "../src/hexapod/solvers/ik/hexapodSolver"
import CASE1 from "../src/tests/cases/ikSolver/case1"
import CASE2 from "../src/tests/cases/ikSolver/case2"
import CASE3 from "../src/tests/cases/ikSolver/case3"

import { expectToBeEqualPose } from "./helpers"

const CASES = [CASE1, CASE2, CASE3]

test.each(CASES)("IK Solver %p", thisCase => {
    const { dimensions, ikParams } = thisCase.params
    const result = solveInverseKinematics(dimensions, ikParams)
    expectToBeEqualPose(result.pose, thisCase.result.pose)
    expect(result.obtainedSolution).toBe(thisCase.result.obtainedSolution)
})

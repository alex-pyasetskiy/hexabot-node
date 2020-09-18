import Hexagon from "../hexapod/Hexagon"
import { tRotXYZmatrix } from "../hexapod/geometry"
import { expectToBeEqualPoints } from "../tests/helpers.js"
import CASE1 from "../tests/cases/Hexagon/case1.js"

const CASES = [CASE1]

test.each(CASES)(
    "When shifted and then rotated, the hexagon's points must be in the intended locations %p",
    thisCase => {
        const { rx, ry, rz, tx, ty, tz } = thisCase.params.transformParams
        const startHexagon = new Hexagon(thisCase.params.dimensions)
        const transformMatrix = tRotXYZmatrix(rx, ry, rz)
        // prettier-ignore
        const testPoints = startHexagon
            .cloneShift(tx, ty, tz)
            .cloneTrot(transformMatrix).allPointsList

        thisCase.result.points.forEach((expectedPoint, index) => {
            expectToBeEqualPoints(testPoints[index], expectedPoint)
        })
    }
)

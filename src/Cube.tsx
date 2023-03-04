import {useEffect, useState} from "react";


function main() {
    console.clear();
}

export default function Cube() {
    const width = 80, height = 34;
    const [counter, setCounter] = useState(0);
    const [text, setText] = useState("");

    const sin = Math.sin;
    const cos = Math.cos;

    const zBuffer = new Float32Array(width * height);
    const backgroundASCIICode = '.';
    const distanceFromCam = 100;
    const incrementSpeed = 1.0;

    const buffer = new Array(width * height).fill(backgroundASCIICode);
    // rotations in radians
    let A = 0, B = 0, C = 0;
    let cubeWidth = 10;
    let horizontalOffset = -2 * cubeWidth;
    let K1 = 40;

    function calculateX(i, j, k) {
        return j * sin(A) * sin(B) * cos(C) - k * cos(A) * sin(B) * cos(C) +
            j * cos(A) * sin(C) + k * sin(A) * sin(C) + i * cos(B) * cos(C);
    }

    function calculateY(i, j, k) {
        return j * cos(A) * cos(C) + k * sin(A) * cos(C) -
            j * sin(A) * sin(B) * sin(C) + k * cos(A) * sin(B) * sin(C) -
            i * cos(B) * sin(C);
    }

    function calculateZ(i, j, k) {
        return k * cos(A) * cos(B) - j * sin(A) * cos(B) + i * sin(B);
    }

    function calculateForSurface(cubeX, cubeY, cubeZ, ch) {
        const x = calculateX(cubeX, cubeY, cubeZ);
        const y = calculateY(cubeX, cubeY, cubeZ);
        const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;
        const ooz = 1 / z;

        const xp = Math.floor(width / 2 + horizontalOffset + K1 * ooz * x * 2);
        const yp = Math.floor(height / 2 + K1 * ooz * y);
        const idx = xp + yp * width;

        if (idx >= 0 && idx < width * height && ooz > zBuffer[idx]) {
            zBuffer[idx] = ooz;
            buffer[idx] = ch;
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + 1);


            buffer.fill(backgroundASCIICode);
            zBuffer.fill(0);
            cubeWidth = width / 4;
            horizontalOffset = 0;

            for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
                for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
                    calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
                    calculateForSurface(cubeWidth, cubeY, cubeX, '$');
                    calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
                    calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
                    calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
                    calculateForSurface(cubeX, cubeWidth, cubeY, '+');
                }
            }

            let resultText = "";
            for (let i = 0; i < width * height; i++) {
                resultText += i % width ? buffer[i] : "\n";
            }
            setText(resultText);

            A += 0.005;
            B += 0.004;
            C += 0.001;

        }, 10);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="display-linebreak monospace-font">{text}</div>
    );
}
const path = require("path");
const Piscina = require("piscina");

const express = require("express");
const app = express();
const port = 3000;

const randomMatrix = createRandomMatrix(100, 100);
const randomMatrixTwo = createRandomMatrix(200, 200);

app.get("/", (req, res) => {
  let Total = [];
  console.time("add");
  for (let index = 0; index < randomMatrix.length; index++) {
    for (let i = 0; i < randomMatrix[0].length; i++) {
      Total[index] ||= [];
      Total[index].push(randomMatrix[index][i] + randomMatrixTwo[index][i]);
    }
  }
  console.timeEnd("add");
  res.send(JSON.stringify(Total));
});

const piscina = new Piscina({
  filename: path.resolve(__dirname, "lib/worker.js"),
  concurrentTasksPerWorker: 100,
  minThreads: 5,
  recordTiming: false,
});

app.get("/worker", async (req, res) => {
  //   const value = await piscina.run({ a: 500, b: 1222 }, { name: "add" });

  console.time("add");
  const Total = await piscina.run({ a: randomMatrix, b: randomMatrixTwo }, { name: "worker" });
  console.timeEnd("add");

  res.send(JSON.stringify(Total));
  //   console.log(value);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a 2D array filled with random numbers
function createRandomMatrix(rows, cols) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(getRandomInt(0, 9));
    }
    matrix.push(row);
  }
  return matrix;
}

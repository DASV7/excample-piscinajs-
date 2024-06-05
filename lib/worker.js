const bigDecimal = require("js-big-decimal");
const BigDecimal = bigDecimal.default;

function add(a, b) {
  return +BigDecimal.add(a, b);
}
module.exports = {
  /*
   * This function adds two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  worker: async function ({ a, b }) {
    let Total = [];

    for (let index = 0; index < a.length; index++) {
      for (let i = 0; i < a[index].length; i++) {
        Total[index] ||= [];
        Total[index].push(add(a[index][i], b[index][i]));
      }
    }
    return Total;
  },
  /*
   * This function subtracts two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  sub: function (a, b) {
    return +BigDecimal.subtract(a, b);
  },
  /*
   * This function multiplies two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  mul: function (a, b) {
    return +BigDecimal.multiply(a, b);
  },
  /*
   * This function divides two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  div: function (a, b) {
    if (+a == 0 || +b == 0 || !a || !b) return 0;
    return +BigDecimal.divide(a, b, 20);
  },
  /*
   * This function divides two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  divDirect: function (a, b) {
    if (+a == 0 || +b == 0 || !a || !b) return 0;
    return +BigDecimal.divide(a, b, 20);
  },
  /*
   * This function divides two numbers and returns the result.
   * @param {Number 1} a
   * @param {Number 2} b
   * @returns {Number} */
  round: function (a) {
    return +BigDecimal.round(a, 20, BigDecimal.ROUND_HALF_EVEN);
  },
  /*
   * This  function create this operation and returns the result.
   * const Month2 = [((1 + (season.Month2 + acum) * yearValue / 10000) / (1 + acum * yearValue / 10000)) - 1] * 100;
   * @param {Number 1} season
   * @param {Number 2} acum
   * @param {Number3} yearValue
   * @param {Number 2} acum
   * @returns {Number} */
  calcProjection: function (season, acum, yearValue) {
    // Verificar si el divisor es cero
    const divisor = BigDecimal.multiply(acum, yearValue);
    if (divisor == 0) {
      // Devolver cero como resultado de la división
      //return 0;
    }

    // Calcular el numerador de la división
    const numerator = BigDecimal.add(1, BigDecimal.multiply(BigDecimal.add(season, acum), BigDecimal.divide(yearValue, 10000)));

    // Calcular el denominador de la división
    const denominator = BigDecimal.add(BigDecimal.divide(BigDecimal.multiply(acum, yearValue), 10000), 1);

    // Realizar la división y el resto de las operaciones
    const divisionResult = BigDecimal.divide(numerator, denominator);
    const subtractionResult = BigDecimal.subtract(divisionResult, 1);
    const multiplicationResult = BigDecimal.multiply(subtractionResult, 100);

    // Redondear el resultado final y devolverlo
    return +BigDecimal.round(multiplicationResult, 20, BigDecimal.ROUND_HALF_EVEN);
  },
};

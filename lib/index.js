/**
 * Convert number from source radix to target radix
 * with optional custom character encoding
 * http://www.deimel.org/comp_sci/conversion.htm
 * @module lib/index
 */
'use strict'

module.exports = PowerRadix

var BIG_ZERO = BigInt(0)

/**
 * Default radix encoding
 */
var B62 = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

/**
 * Creates a new instance of PowerRadix
 * @class
 * @throws {InvalidArgumentException}
 * @param {Array|String} digits
 * @param {Array|Number} sourceRadix
 */
function PowerRadix (digits, sourceRadix) {
  sourceRadix = Array.isArray(sourceRadix) ? sourceRadix : B62.slice(0, sourceRadix)
  this._digits = Array.isArray(digits) ? digits : (digits + '').split('')
  this._sourceRadixLength = BigInt(sourceRadix.length)
  this._sourceRadixMap = sourceRadix.reduce(function (map, char, i) {
    map[char + ''] = BigInt(i)
    return map
  }, {})
}

/**
 * Convert to target radix, return as Array
 *
 * @param {Array} targetRadix - target radix / encoding characters
 * @return {Array} - source digits converted to target
 * radix presented in format of Array
 *
 * @param {Number} targetRadix - target radix
 * @return {Array} - source digits converted to target
 * radix presented in format of Array
 */
PowerRadix.prototype.toArray = function (targetRadix) {
  return convertBase.call(this, targetRadix)
}

/**
 * Convert to target radix, return as String
 *
 * @param {Array} targetRadix - target radix / encoding characters
 * @return {Array} - source digits converted to target
 * radix presented in format of Array
 *
 * @param {Number} targetRadix - target radix
 * @return {Array} - source digits converted to target
 * radix presented in format of Array*
 */
PowerRadix.prototype.toString = function (targetRadix) {
  return convertBase.call(this, targetRadix).join('')
}

/**
 * @param {Number} targetRadix - radix to convert to
 * @return {Array} digits converted from sourceRadix to targetRadix
 */
function convertBase (targetRadix) {
  var bignum = BIG_ZERO
  var converted = []
  var targetRadixEncoding = Array.isArray(targetRadix) ? targetRadix : B62
  var val
  targetRadix = BigInt(Array.isArray(targetRadix) ? targetRadix.length : targetRadix)
  this._digits.forEach(function (digit) {
    val = this._sourceRadixMap[digit + '']
    if (val === undefined) {
      throw new Error('invalid target: ' + digit + ' not found in target encoding')
    }
    bignum = (bignum * this._sourceRadixLength) + val
  }.bind(this))
  do {
    // push vs unshift
    // https://jsperf.com/array-push-vs-unshift
    // use let when block-scoping more widely available
    var divided = bignum / targetRadix
    var remainder = bignum % targetRadix
    converted.push(targetRadixEncoding[Number(remainder.toString())])
    bignum = divided
  } while (bignum !== BIG_ZERO)
  converted.reverse()
  return converted
}

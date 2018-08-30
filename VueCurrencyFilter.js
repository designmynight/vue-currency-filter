import accounting from 'accounting'

const VueCurrencyFilter = {
  install (Vue, options) {

    // helper to check undefined variable
    function _isUndefined (obj) {
      return typeof obj === "undefined"
    }

    class CurrencyConfig {
      constructor() {
        // build default options
        this.resetAll()
      }

      resetAll(options = {}) {
        this.symbol = _isUndefined(options.symbol) ? '' : options.symbol
        this.thousandsSeparator = _isUndefined(options.thousandsSeparator) ? '.' : options.thousandsSeparator
        this.fractionCount = _isUndefined(options.fractionCount) ? 0 : options.fractionCount
        this.fractionSeparator = _isUndefined(options.fractionSeparator) ? ',' : options.fractionSeparator
        this.symbolPosition = _isUndefined(options.symbolPosition) ? 'front' : options.symbolPosition
        this.symbolSpacing = _isUndefined(options.symbolSpacing) ? true : options.symbolSpacing
      }
    }

    Vue.currencyFilterConfig = new CurrencyConfig();

    if (_isUndefined(options)) options = {}

    // overide with custom currencyFilterConfig if exist
    Vue.currencyFilterConfig.resetAll(options)

    Vue.filter('currency',
      function (value,
        _symbol,
        _thousandsSeparator,
        _fractionCount,
        _fractionSeparator,
        _symbolPosition,
        _symbolSpacing) {

      // overide again with on the fly currencyFilterConfig
      let symbol = _isUndefined(_symbol) ? Vue.currencyFilterConfig.symbol : _symbol
      let thousandsSeparator = _isUndefined(_thousandsSeparator) ? Vue.currencyFilterConfig.thousandsSeparator : _thousandsSeparator
      let fractionCount = _isUndefined(_fractionCount) ? Vue.currencyFilterConfig.fractionCount : _fractionCount
      let fractionSeparator = _isUndefined(_fractionSeparator) ? Vue.currencyFilterConfig.fractionSeparator : _fractionSeparator
      let symbolPosition = _isUndefined(_symbolPosition) ? Vue.currencyFilterConfig.symbolPosition : _symbolPosition
      let symbolSpacing = _isUndefined(_symbolSpacing) ? Vue.currencyFilterConfig.symbolSpacing : _symbolSpacing

      console.log('symbol', _symbol, symbol,  Vue.currencyFilterConfig.symbol);

      let result = 0.0
      let isNegative = String(value).charAt(0) === '-'

      if (isNegative) {
        value = String(value).slice(1)
      }

      let amount = parseFloat(value)

      if (!isNaN(amount)) {
        result = amount
      }

      let formatConfig = "%s%v"

      if (symbolPosition === 'front'){
        formatConfig = symbolSpacing ? "%s %v": "%s%v"
      } else {
        formatConfig = symbolSpacing ? "%v %s" : "%v%s"
      }

      if (fractionCount > 0) {
        value = accounting.toFixed(value, fractionCount)
      }

      result = accounting.formatMoney(value, {
        format:  formatConfig,
        symbol: symbol,
        precision : fractionCount,
        thousand : thousandsSeparator,
        decimal : fractionSeparator,
      })

      if (isNegative) {
        result = '-' + result
      }

      return result
    })
  }
}

export default VueCurrencyFilter

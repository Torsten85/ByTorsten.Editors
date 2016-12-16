/**
 * Validator for countable things
 */
define(
  [
    'Shared/Validation/AbstractValidator',
    'Library/underscore',
    'Shared/I18n'
  ],
  function(AbstractValidator, _, I18n) {
    return AbstractValidator.extend({
      /**
       * @var {object}
       */
      supportedOptions: {
        'minimum': [0, 'The minimum count to accept', 'integer'],
        'maximum': [Number.MAX_VALUE, 'The maximum count to accept', 'integer']
      },

      /**
       * The given value is valid if it is an array or object that contains the specified amount of elements.
       *
       * @param {*} value The value that should be validated
       * @return {void}
       */
      isValid: function(value) {

        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch(e) {}
        }

        if (typeof value !== 'object') {
          this.addError(I18n.translate('content.inspector.validators.countValidator.notCountable'));
          return;
        }

        var options = this.get('options');
        var minimum = typeof options.minimum === 'number' ? Math.round(options.minimum) : parseInt(options.minimum, 10);
        var maximum = typeof options.maximum === 'number' ? Math.round(options.maximum) : parseInt(options.maximum, 10);
        var length = Array.isArray(value) ? value.length : _.keys(value).length;

        if (length < minimum || length > maximum) {
          this.addError(I18n.translate('content.inspector.validators.countValidator.countBetween', null, null, null, {
            minimum: minimum,
            maximum: maximum === Number.MAX_VALUE ? '\u221E' : maximum
          }));
        }

      }
    });
  }
);
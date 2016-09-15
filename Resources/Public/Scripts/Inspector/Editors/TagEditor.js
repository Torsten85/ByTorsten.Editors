define([

  'Library/jquery-with-dependencies',
  'emberjs',
  'Shared/Utility',
  'Library/sortable/Sortable'

], function($, Ember, Utility, Sortable) {

  return Ember.TextField.extend({

    didInsertElement: function() {
      this._initializeSelect2();
    },

    _initializeSelect2: function() {
      var $element = this.$();

      // Ensure we have a value to force "initSelection" to be called
      if ($element.val() === '')
          $element.val('[]');

      this.$().select2('destroy').select2({
        minimumInputLength: 1,
        relative: true,
        tags: true,

        initSelection: function (element, callback) {
          var select2Instance = element.data('select2');

          // override get and set to work with json
          select2Instance.getVal = function () {
            var value = select2Instance.opts.element.val();
            return JSON.parse(value);
          };

          select2Instance.setVal = function (val) {
            select2Instance.opts.element.val(JSON.stringify(val));
          };

          var value = element.val();
          element.val('[]');
          callback(JSON.parse(value).map(function (val) {
              return {
                id: val,
                text: val
              }
          }));
        },

        formatResult: function (result) {
          return result.text;
        }
      })
        .on('select2-open', function() {
          var that = this;
          var $parent = $(this).parent();
          var $document = $('#neos-application');

          $('.neos-select2-offscreen', '#neos-inspector').not(this).each(function() {
            $(this).select2('close');
          });

          $document.on('click.select2-custom', document, function(event) {
            if (!$.contains($parent, event.target)) {
              $(that).select2('close');
              $document.off('click.select2-custom');
            }
          });

          $parent.css('padding-bottom', $('#neos-select2-drop').height());
        })

        .on('select2-close', function() {
          $(this).parent().css('padding-bottom', 0);
          $('#neos-application').off('click.select2-custom');
        });

      this._makeSortable();
    },

    _makeSortable: function() {
      var select2Ul, sortable, that = this;
      select2Ul = this.$().select2('container').find('ul.neos-select2-choices').first().addClass('neos-sortable');
      sortable = Sortable.create(select2Ul.get(0), {
        ghostClass: 'neos-sortable-ghost',
        chosenClass: 'neos-sortable-chosen',
        draggable: '.neos-select2-search-choice',
        onUpdate: function () {
          var values = [];
          select2Ul.find('.neos-select2-search-choice').each(function() {
            values.push($(this).data('select2-data').id);
          });
          that.set('value', JSON.stringify(values));
        }
      });
    }
  });
});

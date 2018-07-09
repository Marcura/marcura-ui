angular.module('marcuraUI.services', []);
angular.module('marcuraUI.components', ['marcuraUI.services']);
angular.module('marcuraUI', ['marcuraUI.components']);

angular.element(document).ready(function () {
    // Override angular-modal hideModal method so it does not remove
    // 'modal-open' CSS-class from body if there are opened modals.
    // E.g. when bootbox modal is displayed above angular-modal.
    if ($.fn.modal) {
        $.fn.modal.Constructor.prototype.hideModal = function () {
            var that = this;
            this.$element.hide();
            this.backdrop(function () {
                that.resetAdjustments();
                that.resetScrollbar();
                that.$element.trigger('hidden.bs.modal');

                // Remove CSS-class if only there no opened modals.
                if ($('.modal').length === 0) {
                    that.$body.removeClass('modal-open');
                }
            });
        };
    }

    if (window.Trix) {
        // Override Trix toolbar in order to add Underline button to it.
        // https://github.com/basecamp/trix/blob/master/src/trix/config/toolbar.coffee
        window.Trix.config.textAttributes.underline = {
            tagName: 'underline',
            style: { 'textDecoration': 'underline' },
            inheritable: true,
            parser: function (element) {
                return window.getComputedStyle(element).textDecoration === 'underline';
            }
        };

        window.Trix.config.toolbar.getDefaultHTML = function () {
            return '\
            <div class="trix-button-row">\
                <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\
                    <div class="trix-button trix-button--icon"\
                        data-trix-attribute="bold" data-trix-key="b">\
                        <i class="fa fa-bold"></i>\
                    </div>\
                    <div class="trix-button trix-button--icon"\
                        data-trix-attribute="italic" data-trix-key="i">\
                        <i class="fa fa-italic"></i>\
                    </div>\
                    <div class="trix-button trix-button--icon"\
                        data-trix-attribute="underline">\
                        <i class="fa fa-underline"></i>\
                    </div>\
                    <!--<div class="trix-button trix-button--icon"\
                        data-trix-attribute="strike">\
                        <i class="fa fa-strikethrough"></i>\
                    </div>-->\
                </span>\
            </div>';
        };
    }
});

// Add a polyfill for String.prototype.endsWith().
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
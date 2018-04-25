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
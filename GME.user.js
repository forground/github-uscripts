(function () {
    $(document).on('pjax:success', monospace);

    function monospace() {
        var css = '<style>.comment-form-textarea{font-family: monospace;}</style>';

        $(document.head).append($(css));
    }

    monospace();
})();

/* global $ */
function getClassName(e) {
    var href = e.currentTarget.href;
    return href.substr(href.indexOf('#') + 1);
}

$().ready(function () {
    // show on hover
    $('.yaml-docs').on('click mouseover', 'a', function (e) {
        var className = getClassName(e);
        $('#' + className).removeClass('hidden');
        $(e.currentTarget).addClass('highlight');
        e.preventDefault();
    });

    // hide on mouseout
    $('.yaml-docs').on('mouseout', 'a', function (e) {
        var className = getClassName(e);
        $(e.currentTarget).removeClass('highlight');
        $('#' + className).addClass('hidden');
        e.preventDefault();
    });
});

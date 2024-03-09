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
        // use ".example" as the reference point
        var reference = $('#' + className).parent().siblings('.example').first();
        // set the position 10px to the right side of reference point
        $('#' + className).parent().css('left', (reference[0].getBoundingClientRect().right+10) + 'px');
        $(e.currentTarget).addClass('highlight');
        e.preventDefault();
    });

    // hide on mouseout
    $('.yaml-docs').on('mouseout', 'a', function (e) {
        var className = getClassName(e);
        $(e.currentTarget).removeClass('highlight');
        $('#' + className).addClass('hidden');
        // reset left position for ".yaml-side"
        $('#' + className).parent().css('left', '');
        e.preventDefault();
    });
});
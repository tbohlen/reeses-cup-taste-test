var positive = true
    , best
    , worst;

$.fn.fadeout = function(duration, callback) {
    if (duration === null || typeof(duration) === 'undefined') {
        duration = 0;
    }
    if (callback === null || typeof(callback) === 'undefined') {
        callback = function(){};
    }
    $(this).stop(true, true).animate({opacity: '0.0'}, {
        duration: duration
        , complete: callback
    });
};

$.fn.fadein = function(duration, callback) {
    if (duration === null || typeof(duration) === 'undefined') {
        duration = 0;
    }
    if (callback === null || typeof(callback) === 'undefined') {
        callback = function(){};
    }
    $(this).stop(true, true).animate({opacity: '1.0'}, {
        duration: duration
        , complete: callback
    });
};

$(document).ready(function() {
    var buttons = $('.cup-button');
    var images = $('.cup-image');
    buttons.on('click', function() {
        var on = false;
        if (positive === true) {
            if (!$(this).hasClass('cup-button-best')) {
                on = true;
            }
            buttons.removeClass('cup-button-best');
            if (on) {
                best = $(this).attr('cupName');
                $(this).addClass('cup-button-best');
                statementTwo();
            }
        }
        else {
            if (!$(this).hasClass('cup-button-worst')) {
                on = true;
            }
            if (!$(this).hasClass('cup-button-best')) {
                buttons.removeClass('cup-button-worst');
                if (on) {
                    worst = $(this).attr('cupName');
                    $(this).addClass('cup-button-worst');
                    submit();
                }
            }
            else {
                $(this).removeClass('cup-button-best');
                statementOne();
            }
        }
    });

    buttons.on('mouseenter', function() {
        $(this).addClass('cup-button-hover');
        images.hide();
        $('#' + $(this).attr('cupName') + '-image').show();
    });

    buttons.on('mouseleave', function() {
        $(this).removeClass('cup-button-hover');
        $('#' + $(this).attr('cupName') + '-image').hide();
    });

    var socket = io.connect();
    socket.on('vote', function (best, worst) {
        console.log(' new vote!');
        var bestElem = $('#' + best + '-best-votes');
        var worstElem = $('#' + worst + '-worst-votes');
        bestElem.text(parseInt(bestElem.text()) + 1);
        worstElem.text(parseInt(worstElem.text()) + 1);
    });
});

function statementTwo() {
    positive = false;
    $('#prompt-one').hide(200);
    $('#prompt-two').show(200)
}

function statementOne() {
    positive = true;
    $('#prompt-two').hide(200);
    $('#prompt-one').show(200)
}

function submit() {
    function downOne() {
        var element = $('#countdown-number');
        if (element.text() === 'submission completed') {
            window.clearInterval(id);
             $('.cup-button').off('click mouseenter mouseleave');
            $('#countdown').hide();
            element.removeClass('countdown-text-done');
            afterSubmit();
        }
        var text = (parseInt(element.text()) - 1).toString();
        element.fadeout(100, function() {
            if (text === '-1') {
                text = 'submission completed';
                element.addClass('countdown-text-done');
            }
            $('#coundown-label').fadeout(200);
            element.text(text).fadein(100);
        });
    }
    runSubmission();
    $('#countdown').show();
    var id = window.setInterval(downOne, 1000);
}

function afterSubmit() {
    $('#vote-area').fadeout(600, function() {
        $('#vote-area').remove();
    });
}

function runSubmission() {
    var postRequest = $.post('/vote/', {
        best: best
        , worst: worst
    });

    postRequest.success(function() {
    });
}


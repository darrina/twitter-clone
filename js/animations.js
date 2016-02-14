/* global moment */
$(function () {
    var templateCache = {};
    var GetView = function (view, data) { 
        if (!templateCache[view]) {
            var template = $.ajax({
                type: "GET",
                url: 'views/' + view + '.html',
                async: false
            }).responseText;
            templateCache[view] = Handlebars.compile(template);
        }
        return templateCache[view](data);
     };
    
	$('time.timeago').timeago();
	$('#tweet-controls').hide();
	$('.tweet-actions, .stats').hide();

	$('#dashboard').hover(function () {
		$('#tweet-controls').show();
		$(this).find('textarea.tweet-compose').height(80);
	}, function() {
		$('#tweet-controls').hide();
		$(this).find('textarea.tweet-compose').height(40);
    })

	$(document).on('keyup', 'textarea.tweet-compose', function (e) {
		if (e.keyCode == 13) {
			$('#tweet-submit').click();
			this.value = "";
		}
        $('#char-count').text(140 - this.value.length);
	});

	$(document).on('keypress', 'textarea.tweet-compose', function () {
		var count = 140 - this.value.length;
		$('#char-count').text(count);
		$('#char-count').css('color', count < 10 ? 'red' : '');
		if (count < 0) {
			$('#tweet-submit').attr('disabled', 'disabled');
		} else {
			$('#tweet-submit').removeAttr('disabled');
		}
	});

	$('#tweet-submit').on('click', function () {
        $('#main').prepend(GetView('tweet', { 
            avatarUrl: $('#profile-summary').find('img').attr('src'),
            fullName: $('#profile-summary').find('p').text(),
            handle: 'bigDeal',
            text: $('#tweet-content textarea').val(),
            dateStamp: moment().format('YYYY-MM-DDTHH:mm:ss')
        }));
		$('time.timeago').timeago();		
	});

	$(document).on('click', 'div.tweet', function () {
		$(this).find('.stats').animate({ height: 'toggle' });
	});

	$(document).on({
		mouseenter: function () {
			$(this).find('.tweet-actions').show();
		},
		mouseleave: function () {
			$(this).find('.tweet-actions').hide();
		}
	}, 'div.tweet');
});
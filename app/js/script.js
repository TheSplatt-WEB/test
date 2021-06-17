function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});
$(function () {
	$('.menu__btn, .menu__body').on('click', function () {
		$('.menu__btn, .menu__body').toggleClass('open');
	});
	$(document).on('click', function (e) {
		if (!$('.menu__btn').is(e.target) && $('.menu__btn').has(e.target).length === 0 &&
			!$('.menu__body').is(e.target) && $('.menu__body').has(e.target).length === 0) {
			$('.menu__body, .menu__btn').removeClass('open');
		}
	});
	$(document).on('click', '.work__link', function (event) {
		event.preventDefault();
		if ($('.work__list').hasClass('one')) {
			$('.work__popup').not($(this).next()).slideUp();
			$('.work__row').not($(this).parent()).removeClass('open');
			$('.work__link').not($(this)).removeClass('open');
		}
		$(this).next('.work__popup').slideToggle();
		$(this).parent('.work__row').toggleClass('open');
		$(this).toggleClass('open');
	});
	$(document).on('click', function (e) {
		if (!$('.popup__body').is(e.target) && $('.work__link').has(e.target).length === 0 &&
			!$('.popup__title').is(e.target) && $('.popup__title').has(e.target).length === 0 &&
			!$('.popup__descr').is(e.target) && $('.popup__descr').has(e.target).length === 0 &&
			!$('.work__name').is(e.target) && $('.work__name').has(e.target).length === 0) {
			$('.work__popup').slideUp();
			$('.work__row').removeClass('open');
		}
	});
	$('.work__link').hover(function () {
		$(this).parent().addClass('hover');
	}, function () {
		$(this).parent().removeClass('hover');
	});
	let i = 0;
	$(".tab").each(function () {
		i++;
		$(this).attr("data-id", "item" + i);
	});
	let ii = 0;
	$(".tab__item").each(function () {
		ii++;
		$(this).attr("id", "item" + ii);
	});
	$('.advantages__tabs .tab').on('click', function (event) {
		var id = $(this).attr('data-id');
		$('.advantages__tabs').find('.tab__item').removeClass('active-tab').hide();
		$('.advantages__tabs .tabs').find('.tab').removeClass('active');
		$(this).addClass('active');
		$('#' + id).addClass('active-tab').fadeIn();
		return false;
	});
});
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
});
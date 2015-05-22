(function($){
$(document).ready(function($) {
	"use_strict";

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__
	;


	Hc.curr_depth = $(window).scrollTop();
	Hc.prev_depth = 0;
	Hc.header_block_height = $(".block.head").height() + 280;
	Hc.header_shown = false;

	// Scroll event
	$(document).on("scroll", function(e) {

		Hc.prev_depth = Hc.curr_depth;
		Hc.curr_depth = $(window).scrollTop();

		// Down scroll event
		if(Hc.prev_depth < Hc.curr_depth){


		// Up scroll event
		}else {


		}

		// Show the fixed header at the end of the header block
		if(Hc.curr_depth > Hc.header_block_height){
			if(!Hc.header_shown){
				$("header").fadeIn("fast")
				Hc.header_shown = true;

			}

		}else{
			if(Hc.header_shown){
				$("header").fadeOut("fast")
				Hc.header_shown = false;

			}

		}

	});



});
})(jQuery);
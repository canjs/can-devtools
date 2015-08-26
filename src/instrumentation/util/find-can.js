export default function (found, notFound, checkLimit = 100000) {
	var curCheck = 0;

	function findCan() {
		curCheck++;
		if(curCheck >= checkLimit) {
			notFound();
			return false;
		}

		//First try!
		if(window.can) {
			found();
			return;
		}

		return window.setTimeout(findCan, 10);
	}

	if (window.can) {
		//Found it right away
	  found();
	} else if (window.steal && window.steal.done) {
		//New steal detected, wait until everything is loaded then check
		window.steal.done().then(function(){
			if(window.can) {
				found();
			} else {
				notFound();
			}
		});
	} else {
		//Poll for 10 seconds before deciding
		findCan();
	}
}
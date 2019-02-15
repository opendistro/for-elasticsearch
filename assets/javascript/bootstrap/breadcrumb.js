
	window.onscroll = function() {myFunction()};
    console.log("breadcrumbs");
	var breadcrumbs = document.getElementById("breadcrumbs");
	var pippo = document.getElementById("pippo");
	console.log(breadcrumbs);
	console.log(pippo);
	var sticky = breadcrumbs.offsetTop;
	
	console.log(sticky);
	console.log(window.pageYOffset);

	function myFunction() {
	  if (window.pageYOffset >= sticky) {
	    breadcrumbs.classList.add("sticky")
	  } else {
	    navbar.classList.remove("sticky");
	  }
	}

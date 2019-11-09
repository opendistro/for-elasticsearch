var Slider = function ( id ){
  this.slider = document.getElementById( id );
  this.slideList = this.slider.getElementsByClassName('js-slide-list')[0];
  this.slideListItems = this.slider.getElementsByClassName('js-slide-list-item');
  this.slideWidth = this.slideListItems[0].offsetWidth;
  this.slidesLength = this.slideListItems.length; 
  // Means we're at slide 0 (Slide 1)
  this.current = 1;
  this.direction;
  this.animating = false;
  
};

Slider.prototype = {
  constructor : Slider,
  init : function(){
    this.listenEvents();
    this.cloneFirstAndLastItem();
  },
  
  listenEvents : function(){
    var that = this;
    var arrowButtons = this.slider.getElementsByClassName('js-arrow-button');
    for (var i = 0; i < arrowButtons.length; i++) {
      arrowButtons[i].addEventListener('click', function(){
        that.clickArrowButton( this );
      });
    };
    var pagerItems = this.slider.getElementsByClassName('js-pager-item');
    for (var i = 0; i < pagerItems.length; i++){
      pagerItems[i].addEventListener('click', function(){
        that.clickPagerItem( this );
      });
    };
  },
  
  cloneFirstAndLastItem : function(){
    var firstSlide = this.slideListItems[0];
    var lastSlide = this.slideListItems[ this.slidesLength - 1 ];
    var firstSlideClone = firstSlide.cloneNode( true );
    var lastSlideClone = lastSlide.cloneNode( true );
    
    // Remove data-slide-index for pager items to choose correct target
    firstSlideClone.removeAttribute('data-slide-index');
    lastSlideClone.removeAttribute('data-slide-index');
    
    this.slideList.appendChild( firstSlideClone );
    this.slideList.insertBefore( lastSlideClone, firstSlide );
  },

  clickArrowButton : function( el ){
    var direction = el.getAttribute('data-direction');
    var pos = parseInt( this.slideList.style.left ) || 0;
    var newPos; 
    // direction will be added to current slide number
    this.direction = direction === 'prev' ? -1 : 1;
    newPos = pos + ( -1 * 100 * this.direction );
    if( !this.animating ) {
      this.slideTo(this.slideList, function( progress ){
        return Math.pow(progress, 2);
      }, pos, newPos, 500);
      // Update current slide number
      this.current += this.direction;
    }
  },
  
  clickPagerItem : function( el ){
    var slideIndex = el.getAttribute('data-slide-index');
    var targetSlide = this.slider.querySelector('.js-slide-list-item[data-slide-index="' + slideIndex +'"]');
    var pos = parseInt( this.slideList.style.left ) || 0;
    var newPos = Math.round( targetSlide.offsetLeft / targetSlide.offsetWidth ) * 100 * -1;
    
    if( !this.animating && pos !== newPos ){
      this.slideTo(this.slideList, function( progress ){
        return Math.pow(progress, 2);
      }, pos, newPos, 500);
      // Update current slide number
      this.current = parseInt(slideIndex) + 1;
    }
    
  },

  
  slideTo : function( element, deltaFunc, pos, newPos, duration ){
   this.animating = true;
   this.animate({
     delay: 20,
     duration: duration || 1000,
     deltaFunc: deltaFunc,
     step: function( delta ){
       var direction = pos > newPos ? 1 : -1
       element.style.left = pos  + Math.abs(newPos - pos) * delta * direction * -1 + '%';
       
       // PREV
       // Direction: -1
       // Pos = -600
       // newPos = 0
       // Ex: Slide 4 (0px) <- Slide 1 (-600px)
       //element.style.left = -600  + Math.abs(0 - (-600)) * 0.021 * -1 * -1+ 'px';
       
       // NEXT
       // Direction: +1
       // Pos = -600
       // newPos = -1200
       // Next: Slide 1 (-600px) -> Slide 2 (-1200px)
       //element.style.left = -600  + Math.abs( -600 - (-1200) ) * 0.021 * 1 * -1 + 'px';

     }
   }); 
  },
  
  animate : function( opts ){
    var that = this;
    var start = new Date();
    var id = setInterval(function(){
      var timePassed = new Date - start;
      var progress = timePassed / opts.duration;
      
      if( progress > 1 ) {
        progress = 1;
      }
      var delta = opts.deltaFunc( progress );
      opts.step( delta );
      
      if( progress === 1 ){
        clearInterval( id );
        that.animating = false;
        that.checkCurrentSlide();
      }
    }, opts.delay || 10 );
  },
  
  checkCurrentSlide : function( ){
    var cycle = false;
    //this.current += this.direction;
    // Are we at the cloned slides? 
    cycle = !!( this.current === 0 || this.current > this.slidesLength )
    if ( cycle ) {
      // update current in order to adapt new slide list
      // we'll use current value to relocate slide list
      this.current = ( this.current === 0 ) ? this.slidesLength : 1;
      // For 4 x 600px slides, 
      // left pos will be either -600px (first slide clone -> first slide)       // or -2400px (last slide clone -> fourth slide)
      this.slideList.style.left = ( -1 * this.current * 100 ) + '%';
    } 
    
  }
};



document.addEventListener('DOMContentLoaded', function(){
    new Slider('categorySlider').init();
})

// inspired by: https://output.jsbin.com/ufoceq/8/
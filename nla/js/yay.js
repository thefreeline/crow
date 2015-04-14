/*!
 * Yay
 * Advanced Sidebar for Bootstrap
 * http://nkdev.info
 * @author nK
 * @version 1.0.0
 * Copyright 2015.
 */
(function(){
  "use strict";

  // yaybar variables
  var yay = $('.yaybar');
  var body = $('body');
  var content = $('.yaybar ~ .content-wrap');
  var useGestures = yay.hasClass('yay-gestures');
  var sidebarSpeed = 400;

  // check if sidebar show
  function isShow() {
    return !body.hasClass('yay-hide');
  }

  // check show type
  function showType() {
    if(yay.hasClass('yay-overlay')) return 'overlay';
    if(yay.hasClass('yay-push')) return 'push';
    if(yay.hasClass('yay-shrink')) return 'shrink';
  };

  // check if hide on content click
  function isHideOnContentClick() {
    return yay.hasClass('yay-overlap-content');
  }

  // check if sidebar static position
  function isStatic() {
    return yay.hasClass('yay-static');
  }

  // init Nano Scroller
  yay.find(".nano").nanoScroller({ preventPageScrolling: true });

  // toggle sub menus
  yay.on('click', 'li a.yay-sub-toggle', function(e) {
    e.preventDefault();

    var toggle = $(this);
    var toggleParent = toggle.parent();
    var subMenu = toggleParent.find('> ul');
    var opened = toggleParent.hasClass('open');

    function closeSub(subMenu) {
      subMenu.css('display', 'block').slideUp(sidebarSpeed, 'swing', function() {
        // close child dropdowns
        $(this).find('li a.yay-sub-toggle').next().attr('style', '');

        // resize for nano scroller
        $(window).resize();
      });
      
      subMenu.parent().removeClass('open');
      subMenu.find('li a.yay-sub-toggle').parent().removeClass('open');
    }

    if(subMenu.length) {

      // close
      if(opened) {
        closeSub(subMenu);
      }

      // open
      else {
        subMenu.css('display', 'none');
        subMenu.slideDown(sidebarSpeed, 'swing', function() {
          // resize for nano scroller
          $(window).resize();
        });
        toggleParent.addClass('open');

        closeSub( toggleParent.siblings('.open').find('> ul') );
      }

    }
  });

  // sidebar hide
  function checkSidebarNano() {
    if( isShow() ) {
      if( isHideOnContentClick() && !isStatic() ) {
        body.css('overflow', 'hidden');
      }
      // restore scroller on normal sidebar after end animation (300ms)
      setTimeout(function() {
        yay.find(".nano").nanoScroller();
      }, 300);
    } else {
      if( isHideOnContentClick() && !isStatic() ) {
        body.css('overflow', 'visible');
      }
      // destroy scroller on hidden sidebar
      yay.find(".nano").nanoScroller({ destroy: true });
    }
  }
  $('.yay-toggle').on( 'click', function(e) {
    e.preventDefault();
    body.toggleClass('yay-hide');
    checkSidebarNano();
  });
  checkSidebarNano();


  // hide sidebar when push content overlay
  content.on( 'click', function() {
    if( isHideOnContentClick() && isShow() ) {
      body.toggleClass('yay-hide');
      checkSidebarNano();
    }
  })

})();
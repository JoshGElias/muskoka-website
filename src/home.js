(function(document) {

  const navMenu = document.getElementsByClassName("nav-menu")[0];

  setInterval(() => {
    if(!navMenu.hasAttribute('data-nav-menu-open')) {
      document.getElementsByClassName("fs-slider_arrow-right")[0].click();
    }
    
  }, 5000);

})(document);
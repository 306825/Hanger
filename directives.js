exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    templateUrl: 'templates/add_to_cart.html'
  };
};

exports.categoryProducts = function() {
  return {
    controller: 'CategoryProductsController',
    templateUrl: '/B-examples/templates/category_products.html'
  }
};

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    templateUrl: '/B-examples/templates/category_tree.html'
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    templateUrl: '/B-examples/templates/shoping-cart.html'
  };
};

exports.navBar = function() {
  return {
    controller: 'NavBarController',
    templateUrl: '/B-examples/templates/nav_bar.html'
  };
};

exports.productDetails = function() {
  return {
    controller: 'ProductDetailsController',
    templateUrl: '/B-examples/templates/product_details.html'
  };
};

exports.footerDirective = function() {
  return {
    controller: 'FooterController',
    templateUrl: '/B-examples/templates/footer.html'
  };
};

exports.orderHistory = function() {
  return {
    controller: 'OrdersController',
    templateUrl: '/B-examples/templates/orders.html'
  };
};

//exports.loginDirective = function() {
  //return {
    //controller: 'LoginController',
    //templateUrl: 'views/templates/watchlist-panel.html'
  //};
//};
exports.RegisterController = function($scope, $http){

  $scope.register = function(){
    $http({
      method :'POST',
      url: '/register',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
      data:{
        name:$name,
        surname: $surname,
        usenrame:$scope.username,
        password:$scope.password,
        mobile: $scope.mobile
      }
    }).then(function(response){
      $scope.user = response;
    }, function(err){
      console.log(err);
    })
  }

}

exports.AddToCartController = function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(product) {
    var obj = { product: product._id, quantity: 1 };
    $user.user.data.cart.push(obj);

    $http.
      put('/api/v1/me/cart', { data: { cart: $user.user.data.cart } }).
      success(function(data) {
        $user.loadUser();
        $scope.success = true;

        $timeout(function() {
          $scope.success = false;
        }, 5000);
      });
  };
};

exports.NavBarController = function($scope, $user, $modal, $http) {
  $scope.user = $user;
  $scope.loginStatus = false;
  $scope.credentials = {};
  $scope.details = {};
  $scope.incorrectCred = false;
  $scope.cartSize = 0;
  
  if ($scope.user){
    $scope.loginStatus = true;
  }

  var loginFormModal = $modal({
      scope: $scope,
      template: 'templates/login_form.html',
      show: false
  });

  var registerFormModal = $modal({
      scope: $scope,
      template: 'templates/register_form.html',
      show: false
  });

  $scope.register = function(){
    $http.post('/register', {
      name:$scope.details.name,
      surname: $scope.details.surname,
      username:$scope.details.username,
      password:$scope.details.password,
      mobile: $scope.details.mobile
      }, 
      {headers: {'Content-Type': 'application/json'}}).
    success(function(data){
      $scope.user = data;
      console.log(data);
      registerFormModal.hide();
    }).error(function(err){
      console.log(err);
      $scope.incorrectCred = true;
    });
  }

  $scope.login = function(){
    $http.post('/login', {username :$scope.credentials.username, password: $scope.credentials.password}, 
      {headers: {'Content-Type': 'application/json'}}).
    success(function(data){
      $scope.user = data;
      loginFormModal.hide();
      $scope.cartSize = data.data.cart.length;
      $scope.loginStatus = true;
    }).error(function(err){
      console.log(err);
      $scope.incorrectCred = true;
    });
  }

  $scope.logout = function(){
    $http.get('/logout').success(function(data){
      $scope.message = data.message;
      $scope.loginStatus = false;
    });
  }


  // Display login form
  $scope.showModal = function (){
      loginFormModal.$promise.then(loginFormModal.show);
  };
  $scope.showRegisterModal = function (){
      registerFormModal.$promise.then(registerFormModal.show);
  };


  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};


exports.CategoryProductsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);

  $scope.price = undefined;

  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };

  $scope.load = function() {
    var queryParams = { price: $scope.price };
    $http.
      get('/api/v1/product/category/' + encoded, { params: queryParams }).
      success(function(data) {
        $scope.products = data.products;
      });
  };

  $scope.load();

  setTimeout(function() {
    $scope.$emit('CategoryProductsController');
  }, 0);
};

exports.CategoryTreeController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);
  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get('/api/v1/category/parent/' + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

exports.CheckoutController = function($scope, $user, $http) {
  // For update cart
  $scope.total = 0;
  $scope.user = $user;
  $scope.updateCart = function() {
    $http.
      put('/api/v1/me/cart', $scope.user, {headers: {'Content-Type': 'application/json'}}).
      success(function(data) {
        $scope.updated = true;
      }).error(function(err){
        console.log(err);
      });
  };

  // For checkout
  Stripe.setPublishableKey('pk_test_KJXcgbmMx3EbUq6ol1AfivI4');

  $scope.stripeToken = {
    number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2018'
  };

  $scope.updateTotal = function(){
    var temp = 0
    for (var i = 0; i < $scope.user.user.data.cart.length; i++) {
      console.log($scope.user.user.data.cart[i].quantity);
      temp = temp + ($scope.user.user.data.cart[i].product.price.amount*$scope.user.user.data.cart[i].quantity);
    };
    $scope.total = temp;
  }

  $scope.incrementQnty = function(){
    $scope.user.user.data.cart[0].quantity = $scope.user.user.data.cart[0].quantity + 1;
    $scope.updateTotal();
  }

  $scope.decrementQnty = function(){
    $scope.user.user.data.cart[0].quantity = $scope.user.user.data.cart[0].quantity - 1;
    $scope.updateTotal();
  }

  $scope.checkout = function() {
    $scope.error = null;
    console.log($scope.stripeToken);
    Stripe.card.createToken($scope.stripeToken, function(status, response) {
      if (status.error) {
        console.log('there is an error creating stripe credid card');
        $scope.error = status.error;
        return;
      }

      $http.
        post('/api/v1/checkout', { stripeToken: response.id }, {headers: {'Content-Type': 'application/json'}}).
        success(function(data) {
          console.log(data);
          $scope.checkedOut = true;
          $user.user.data.cart = [];
        });
    });
  };

};

exports.OrdersController = function($scope, $user){
  $scope.user = $user;
  console.log($scope.user);
}



exports.ProductDetailsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.id);

  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      $scope.product = data.product;
    });

  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};

exports.FooterController =function($scope, $user){
  $scope.test = false;
}

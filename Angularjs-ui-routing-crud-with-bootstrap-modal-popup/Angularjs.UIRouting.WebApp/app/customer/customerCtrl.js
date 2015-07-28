﻿var app = angular.module("MyApp")
app.controller('customerCtrl', ['$scope', '$state', '$stateParams', '$modal', '$log', 'Customer', function ($scope, $state, $stateParams, $modal, $log, Customer) {

    var customerId = $stateParams.customerId;

    $scope.searchText = '';
    $scope.customers = searchCustomers();
    $scope.contacts = [];
    $scope.customer = {};
    $scope.currentCustomer = {};


    $scope.$watch('searchText', function (newVal, oldVal) {
        if (newVal != oldVal) {
            searchCustomers();
        }
    }, true);


    function searchCustomers() {
        Customer.search($scope.searchText)
        .then(function (data) {
            $scope.customers = Customer.customers;
        });
    };

    $scope.customerDetail = function (id) {
        if (!id) return;
        Customer.customerDetail(id)
        .then(function (data) {
            $scope.currentCustomer = Customer.currentCustomer;
            $state.go('customer.detail', { 'customerId': id });
        });
    };

    /* Need to call after defining the function
       It will be called on page refresh        */
    $scope.currentCustomer = $scope.customerDetail(customerId);

    // Delete a customer and hide the row
    $scope.deleteCustomer = function ($event, id) {
        var ans = confirm('Are you sure to delete it?');
        if (ans) {
            Customer.delete(id)
            .then(function () {
                var element = $event.currentTarget;
                $(element).closest('div[class^="col-lg-12"]').hide();
            })
        }
    };

    // Add Customer
    $scope.addCustomer = function () {
        Customer.newCustomer()
        .then(function (data) {
            $scope.customer = Customer.customer;
            $scope.open();
        });
    }

    // Add Customer
    $scope.editCustomer = function (id) {
        if (!id) return;
        Customer.customerDetail(id)
        .then(function (data) {
            $scope.currentCustomer = Customer.currentCustomer;
            $scope.customer = Customer.currentCustomer;
            $scope.open();
        });
    }

    // Open model to add edit customer
    $scope.open = function (size) {
        $scope.headerTitle = "New Customer";
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'app/customer/AddEditCustomer.html',
            controller: 'customerModalCtrl',            
            resolve: {
                customer: function () {
                    return $scope.customer;
                }
            }
        });
        modalInstance.result.then(function (response) {
            debugger;            
            $scope.currentCustomer = response;
            $state.go('customer.detail', { 'customerId': response.CustomerId });            
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    
}]);

app.controller('customerModalCtrl', ['$scope', '$modalInstance', 'Customer', 'customer', function ($scope, $modalInstance, Customer, customer) {

    $scope.customer = customer;
    $scope.save = function () {
        Customer.Save($scope.customer).then(function (response) {
            $modalInstance.close(response.data);
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

var app = angular.module('excelApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'login.html',
        controller: 'LoginController'
    })
    .when('/products', {
        templateUrl: 'products.html',
        controller: 'ProductsController'
    })
    .when('/table', {
        templateUrl: 'table.html',
        controller: 'TableController'
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.controller('LoginController', function($scope, $location) {
    $scope.username = '';
    $scope.password = '';
    $scope.loginError = false;
    $scope.login = function() {
        if ($scope.username === 'admin' && $scope.password === 'password') {
            $location.path('/products');
        } else {
            $scope.loginError = true;
            $scope.loginErrorMessage = "Invalid username or password.";
        }
    };
});

app.controller('ProductsController', function($scope, $location) {
    $scope.products = [
        { name: 'Artev', image: 'images/artev.jpeg' },
        { name: 'CP', image: 'images/cp.jpeg' },
        { name: 'ID Baby', image: 'images/baby.jpeg' },
        { name: 'ID Touch', image: 'images/touch.jpeg' }
    ];

    $scope.viewProduct = function(product) {
        alert('Viewing ' + product.name);
    };

    $scope.viewAllProducts = function() {
        $location.path('/table');
    };
});

app.controller('TableController', function($scope) {
    $scope.headers = ["عدد كل كرتونة", "رصيد حالي", "هالك", "مرتجع", "منصرف", "وارد", "اسم", "كود"];
    $scope.tableData = [
        { "Column 1": "Data 1-1", "Column 2": "Data 1-2", "Column 3": "Data 1-3", "Column 4": "Data 1-4", "Column 5": "Data 1-5", "Column 6": "Data 1-6", "Column 7": "Data 1-7", "Column 8": "Data 1-8" },
        { "Column 1": "Data 2-1", "Column 2": "Data 2-2", "Column 3": "Data 2-3", "Column 4": "Data 2-4", "Column 5": "Data 2-5", "Column 6": "Data 2-6", "Column 7": "Data 2-7", "Column 8": "Data 2-8" }
    ];

    $scope.showModal = false;
    $scope.showHistoryModal = false;
    $scope.editContext = {};
    $scope.editHistories = {};

    $scope.showConfirmationModal = function(row, key, event) {
        const newValue = event.target.innerText;
        if (newValue !== row[key]) {
            $scope.editContext = {
                row: row,
                key: key,
                previousValue: row[key],
                newValue: newValue
            };
            $scope.showModal = true;
            event.target.innerText = row[key];
        }
    };

    $scope.confirmYes = function() {
        if ($scope.editContext.row && $scope.editContext.key) {
            const rowKey = $scope.tableData.indexOf($scope.editContext.row);
            const edit = {
                date: new Date().toLocaleString(),
                before: $scope.editContext.previousValue,
                after: $scope.editContext.newValue
            };

            if (!$scope.editHistories[rowKey]) {
                $scope.editHistories[rowKey] = [];
            }

            $scope.editHistories[rowKey].push(edit);
            $scope.editContext.row[$scope.editContext.key] = $scope.editContext.newValue;
        }
        $scope.showModal = false;
        $scope.editContext = {};
    };

    $scope.confirmNo = function() {
        $scope.showModal = false;
        $scope.editContext = {};
    };

    $scope.addRow = function() {
        var newRow = {};
        $scope.headers.forEach(header => newRow[header] = '');
        $scope.tableData.push(newRow);
    };

    $scope.deleteRow = function(index) {
        $scope.tableData.splice(index, 1);
    };

    $scope.saveData = function() {
        alert("Data saved successfully!");
    };

    $scope.customFilter = function(row) {
        if (!$scope.searchText) return true;
        return Object.values(row).some(val => val.toLowerCase().includes($scope.searchText.toLowerCase()));
    };

    $scope.viewEditHistory = function(row) {
        const rowKey = $scope.tableData.indexOf(row);
        $scope.selectedRowEditHistory = $scope.editHistories[rowKey] || [];
        $scope.showHistoryModal = true;
    };

    $scope.closeHistory = function() {
        $scope.showHistoryModal = false;
        $scope.selectedRowEditHistory = [];
    };

    $scope.closeHistoryOnClick = function(event) {
        if (event.target.className.includes('custom-modal')) {
            $scope.closeHistory();
            $scope.$apply(); 
        }
    };
});

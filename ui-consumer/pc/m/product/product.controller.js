app.controller('ProductController', function(
                $scope
                , $rootScope
                , $state
                , $modal
                , $q
                , CartServ
                , ControllerHelper
                , Dialogs
                , ProductRS
                , DestAreaRS
                , Cache
                )  {

    $scope.productAttrs = [
        {
            label: 'Name',
            name: 'name',
            prop: true,
        },
        {
            label: 'Chemical Name',
            name: 'chemicalName',
            prop: true,
        },
        {
            label: 'Synonyms',
            name: 'synonyms',
            prop: true,
        },
        {
            label: 'CAS No',
            name: 'casNo',
            prop: true,
        },
        {
            label: 'EC No',
            name: 'ecNo',
            prop: true,
        },
        {
            label: 'Molecular Formula',
            name: 'moleFormula',
            prop: true,
        },
        {
            label: 'Molecular Weight',
            name: 'moleWeight',
            prop: true,
        },
        {
            label: 'InChl',
            name: 'inChl',
            prop: true,
        },
        {
            label: 'Description',
            name: 'description',
            type: 'Html',
        }
    ];

    $scope.COMPANY = COMPANY;
 
    var LoadProducts = function(keyword) {
        var cond = {company: COMPANY._id};
        if (!$scope.products) {
            return ProductRS.Load(cond);
        }
    }

    $scope.SearchProducts = function(keyword) {
        var cond = {company: COMPANY._id};
        if (keyword)
            cond.keyword = keyword;
        return ProductRS.Load(cond);
    }


    var LoadDestAreas = function() {
        if (!$scope.destAreas) {
            return DestAreaRS.Load({company: COMPANY._id});
        }
    }

    var ReadProduct = function() {
        if ($state.params.product) {
            return ProductRS.Read($state.params.product).then(function(product){
                $scope.product = product;
            }, Errhandler);
        }
    }

    $scope.AddToCart = function(product) {
        var product_copy = angular.copy(product);
        product_copy.skus.forEach(function(sku){
            sku.prices.forEach(function(price){
                if (price.quantity <= 0)
                    return;
                var destArea = Cache.get(price.destArea);
                CartServ.AddItem({
                    id: price._id,
                    quantity: price.quantity,
                    unitPrice: price.value,
                    mainName: product.name,
                    subName: sku.name + (destArea?' to ' + destArea.name:'') + '(' + price.priceType + ')',
                    productId: product._id,
                    skuId: sku._id,
                    priceId: price._id,
                });
            })
        })

        //清零
        product.skus.forEach(function(sku){
            sku.prices.forEach(function(price){
                price.quantity = 0;
            });
        });

    }

   $scope.OpenDocument = function(doc) {
        window.open(doc.url);
    }

    $rootScope.curMenu = 'product';
    $rootScope.IsMenu = function(name) {
        return $rootScope.curMenu === name;
    }
    $rootScope.SetMenu = function(name) {
    $rootScope.curMenu = name;
    }

    return $q.when()
            .then(LoadDestAreas)
            .then(LoadProducts)
            .then(ReadProduct);



});


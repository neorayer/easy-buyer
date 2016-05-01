'use strict'

app.controller('ProductController', function(
                $scope
                , $state
                , ControllerHelper
                , Dialogs
                , VLDT
                , ProductRS
                , SupplierRS
                , Cache
                )  {
    $scope.$state = $state;

    var pSchema = $scope.pSchema = {
        category: {
            title: '产品类别',
            el: 'ztree-select',

            rootName: '所有类别',
            optionLabel: 'name',
            optionValue: '_id',
            options: $scope.categorys,
        },
        name: {
            title: '产品名称 Name *',
            el: 'input',
            validators: { required: VLDT.required },
        },
        casNo: { 
            title: 'CAS No *',
            el: 'input',
            validators: { required: VLDT.required },
        },
        chemicalName: {
            title: '学名 Chemical Name',
            el: 'input',
        },
        finalStepName: {
            title: '最终品名 Final Step Name',
            el: 'input',
        },
        synonyms: {
            title: '异名 Synonyms',
            el: 'input',
        },
        ecNo: {
            title: 'EC No',
            el: 'input',
        },
        moleFormula: {
            title: '分子式 Molecular Formula',
            el: 'input',
        },
        moleWeight: { 
            title: '分子量 Molecular Weight',
            el: 'input',
        },
        inChl: {
            title: 'InChl',
            el: 'input',
        },
        description: {
            title: '详细描述 Description',
            el: 'text-angular',
        }
    }
    for (let k in pSchema)
        pSchema[k].name = k;

    $scope.propRows = [];
    ['name', 'casNo', 'chemicalName', 'finalStepName', 
            'synonyms', 'ecNo', 'moleFormula', 'moleWeight', 
            'inChl'
            ].forEach(function(name){
        var prop = $scope.pSchema[name];
        $scope.propRows.push(prop);
    });

    $scope.getProductThumb = function(product) {
        if (product.pictures.length > 0)
            return product.pictures[0].thumbSrc;
    }

    $scope.categoryNameOf = function(product) {
        if (!product.category)
            return '';
        var category = Cache.get(product.category);
        if (!category)
            return '';
        return category.name;
    }

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ProductController',
        modelLabel: '产品',
        modelName:  'product',
        rs:         ProductRS,
        restricts:  null,
        stateHead:  null,
        newTpl:     {},
    }).then(function(){
        if ($scope.product && !$scope.isNew) {
            var stateParams = '({product:"' + $scope.product._id + '"})';
            let canModify = $scope.can.modify($scope.product);
            $scope.productOneTabs = [
                {   
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'product.one.detail', 
                    state: 'product.one.detail' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: $scope.isNew,
                },
                {   
                    text: '基本信息', 
                    color: 'orange',
                    stateGroup:'product.one.edit', 
                    state: 'product.one.edit' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: !canModify,
                },
                {
                    text: '图片', 
                    color: 'orange',
                    stateGroup:'product.one.picture', 
                    state: 'product.one.picture' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: $scope.isNew || !canModify,
                },
                 {
                    text: '价格', 
                    color: 'orange',
                    stateGroup:'product.one.price', 
                    state: 'product.one.price' + stateParams,
                    icon: 'fa fa-home',
                    isDisabled: $scope.isNew || !canModify,
                },
                {   text: '文件', 
                    color:'blue', 
                    stateGroup: 'product.one.document',
                    state: 'product.one.document' + stateParams,
                    icon: 'fa fa-file',
                    isDisabled: $scope.isNew || !canModify,
                },
                {   text: '供应商', 
                    color:'green', 
                    stateGroup: 'product.one.supplier',
                    state: 'product.one.supplier.list' + stateParams,
                    icon: 'fa fa-truck',
                    isDisabled: $scope.isNew || !canModify,
                },
            ];
        }

        if (!$scope.formProduct.documents)
            $scope.formProduct.documents = [];
        if (!$scope.formProduct.suppliers)
            $scope.formProduct.suppliers = [];
        if (!$scope.formProduct.pictures)
            $scope.formProduct.pictures= [];
    });


    $scope.can = {
        modify: function(p) {
            if (USER.role === 'admin') return true;
            if (USER.role === 'product-admin') return true;
            if (p.creater._id === USER._id && p.status !== 'accepted') return true;
        },

        opStatus: function(p) {
            if (USER.role === 'admin') return true;
            if (USER.role === 'product-admin') return true;
            return false;
        }
    }

    $scope.SaveStatus = function(product, status) {
        ProductRS.Save({_id: product._id, status: status });
    }

    $scope.EditPrice = function(product) {
        $state.go('product.one.price', {product:product._id});
    }

    $scope.GotoDetail = function(product) {
        $state.go('product.one.detail', {product:product._id});
    }

    $scope.GotoEdit = function(product) {
        $state.go('product.one.edit', {product:product._id});
    }

    $scope.GotoPicture = function(product) {
        $state.go('product.one.picture', {product:product._id});
    }

    $scope.GotoDocument = function(product) {
        $state.go('product.one.document', {product:product._id});
    }


    $scope.GotoSupplier = function(product) {
        $state.go('product.one.supplier.list', {product:product._id});
    }


    $scope.ProductOnePriceUrl = '/ui-user/pc/m/product/product.one.price.html';
    $scope.ProductOneDocumentUrl = '/ui-user/pc/m/product/product.one.document.html';
})

app.controller('ProductOneEditController', function(
            $scope
            , $state
            , VLDT
            , zformServ
            , ControllerHelper
            , ProductRS
            , Cache
            ){

    $scope.formRows = [];

    ['category', 'name', 'casNo', 'chemicalName', 'finalStepName', 
            'synonyms', 'ecNo', 'moleFormula', 'moleWeight', 
            'inChl', 'description'
            ].forEach(function(name) {
        var prop = $scope.pSchema[name];
        prop.name = name;
        $scope.formRows.push([
                prop.title,
                prop
            ])
    });

    
    $scope.formRows.push([
        '',
        {
            el: 'button',
            type: 'submit',
            icon: 'fa fa-check',
            text: '保存',
            onClick: function(done, m) {
                ProductRS.Save($scope.formProduct).then(function(p){
                    $state.go('product.one.detail', {product: p._id});
                }, function(err) {
                    zformServ.handleServerErr($scope.theForm, err);
                }).finally(done);
            }
        },
    ]);


});

app.controller('ProductOnePriceController', function(
                $scope
                , $state
                , $interval
                , ControllerHelper
                , Dialogs
                , Dict
                , ProductRS
                , Cache
                )  {

    $scope.SaveSku = function(product) {
        $scope.Save({
            _id: product._id,
            skus: product.skus,
        });
    }

    $scope.AddSku = function(product) {
        if (!product.skus)
            product.skus = [];
        product.skus.push({
            name: '',
            weight: 0,
            prices: [{priceType: 'FOB', value: '0.00', } ],
        })
    }

    $scope.DeleteSku = function(product, sku) {
        $scope.product.isNeedSave = true;
        product.skus.Delete(sku);
        $scope.SaveSku(product);
    }

    $scope.AddSkuPrice = function(product, sku) {
        if (!sku.prices)
            sku.prices = [];
        sku.prices.push({
            priceType: 'CIF',
            value: '0.00',
        });
    }

    $scope.DeleteSkuPrice = function(product, sku, price) {
        sku.prices.Delete(price);
        $scope.SaveSku(product);
    }

});



app.controller('ProductOneDocumentController', function(
                $scope
                , $state
                , $timeout
                , FileTypeServ
                , ControllerHelper
                , Dialogs
                , Dict
                , ProductRS
                , Cache
                )  {

    $scope.SaveDocuments = function(product) {
        return ProductRS.Save({
            _id: product._id,
            documents: product.documents,
        });
    }

    $scope.SaveDocumentsOnBlur = function(product) {
        var isDocsChanged = false;
        product.documents.forEach(function(doc){
            if (doc.$_isChanged)
                isDocsChanged = true;
            delete doc.$_isChanged;
        });

        if (!isDocsChanged)
            return;

        return $scope.SaveDocuments(product);
    }

    $scope.OpenDocument = function(doc) {
        window.open(doc.url);
    }
 
    $scope.DeleteDocument = function(product, doc) {
        // Dialogs.Confirm('是否确认删除此文件？', '确认').then(function(isYes){
        //     if (!isYes)
        //         return;
            if (!doc.$_isUploading) {
                product.documents.Delete(doc);
                $scope.SaveDocuments(product);
            }else {
                uploader.removeFile(doc.$_id);
                product.documents.Delete(doc);
            }
//        })
    }

    $scope.CheckKeyEnter = function($event) {
        if ($event.keyCode===13) {
            $timeout(function(){
                $event.target.blur();
            },100);
        }
    }


    var PreUploadFile = function(file) {
        $scope.product.documents.push({
            $_isUploading: true,
            $_id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            ext: FileTypeServ.GetExt(file.name, file.type),
            upPercent: 0,
            upSize: 0,
        });
    }

    $scope.outDocs = function() {
        console.log($scope.product.documents);
    }
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'productDocumentAddBtn',       //上传选择的点选按钮，**必需**
        uptoken_url: '/public-qiniu/uptoken',  //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true,            // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,             // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7xp52k.com1.z0.glb.clouddn.com/',
        //container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',           //最大文件体积限制
        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    $timeout(function(){
                        PreUploadFile(file)
                    }, 10);
                });
            },
            'BeforeUpload': function(up, file) {

                   // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                $timeout(function(){
                    var doc = $scope.product.documents.FindOne({$_id:file.id});
                    if (!doc) {
                        console.error('Can not find doc');
                        return;
                    }
                    doc.upPercent = file.percent;
                    doc.upSize = file.loaded;
                 },10);
            },
            'FileUploaded': function(up, file, info) {
                 // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var url = domain + res.key; ///获取上传成功后的文件的Url
                //注意：这里一定要用$timeout，否则无法通知变量更改。
                $timeout(function(){
                    if (!$scope.product.documents)
                        $scope.product.documents = [];
                    var doc = $scope.product.documents.FindOne({$_id:file.id});
                    if (!doc) {
                        console.error('Can not find doc');
                        return;
                    }
                    doc.url = url;
                    delete doc.$_isUploading;
                    $scope.SaveDocuments($scope.product);
                }, 1);
            },
            'Error': function(up, err, errTip) {
                   //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                   //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "";
                // do something with key here
                return key
            }
        }

    });

});


app.controller('ProductOneSupplierController', function(
                $scope
                , $state
                , $timeout
                , ControllerHelper
                , Dialogs
                , ProductRS
                , SupplierRS
                , PspRS
                , Cache
                )  {
    if ($state.params.supplier) {
        $scope.supplier = Cache.get($state.params.supplier);

        PspRS.Load({
            product:$scope.product._id,
            supplier: $scope.supplier._id
        });
    }

    SupplierRS.Load();

    $scope.formPsp = {_id: 'new'};

    $scope.SaveSupplier = function(product) {
        var sus = product.suppliers.map(function(su){
            return su._id;
        });
        return ProductRS.Save({
            _id: product._id,
            suppliers: product.suppliers,
        })
    }
    $scope.AddSupplier = function(product, supplier, $select) {
        if (!supplier)
            return;
        product.suppliers.push(supplier);
//        $select.select();   //清除选择框的数据
        $scope.SaveSupplier(product);
    }

    $scope.DeleteSupplier = function(product, supplier) {
        product.suppliers.Delete(supplier);
        $scope.SaveSupplier(product);
    }

    $scope.GotoPsp = function(product, supplier) {
        $state.go('product.one.supplier.one', {
            product:product._id, 
            supplier: supplier._id,
        });
    }

    $scope.SavePsp = function(product, supplier, psp) {
        psp.product = product._id;
        psp.supplier = supplier._id;
        return PspRS.Save(psp).then(function(_psp){
            psp.content = '';
        }, Errhandler);
    }

    $scope.Copy = function(obj) {
        return angular.copy(obj);
    }

    $scope.DeletePsp = function(psp) {
        if (!psp.content || psp.content.trim().length === 0)
            return PspRS.DeleteById(psp._id).catch(Errhandler);
        Dialogs.Confirm('是否确认删除此报价记录？', '确认').then(function(isYes){
            if (!isYes)
                return;
            return PspRS.DeleteById(psp._id).catch(Errhandler);
        })
    }
});

app.controller('ProductOnePictureController', function(
                $scope
                , $state
                , $timeout
                , ControllerHelper
                , Dialogs
                , Dict
                , ProductRS
                , Cache
                )  {
    $scope.picEditDef = {
        el: 'pics',
        name: 'pictures',
        qiniu: {
            uptoken_url: '/public-qiniu/uptoken',
            domain: 'http://7xp52k.com1.z0.glb.clouddn.com/',
        },
        onSelected: function(pic) {
            $scope.picSelected = pic;
        },
        onAdded: function(pic) {
            $scope.picSelected = pic;
            ProductRS.Save({
                _id: $scope.formProduct._id,
                pictures: $scope.formProduct.pictures
            });
        },
        onDeleted: function(pic) {
            ProductRS.Save({
                _id: $scope.formProduct._id,
                pictures: $scope.formProduct.pictures
            });
        }
    }

    var pics = $scope.formProduct.pictures;

    $scope.picSelected = {src: ''}
    if (pics.length > 0)
        $scope.picSelected = pics[0];

    $scope.getCurPicSrc = function() {
        if ($scope.picSelected)
            return $scope.picSelected.src;
        else if ($scope.formProduct.pictures.length > 0)
            return $scope.formProduct.pictures[0].src;
    }
});

app.controller('ProductCategoryController', function(
                $scope
                , $state
                , ControllerHelper
                , VLDT
                , ProductRS
                , CategoryRS
                )  {
    $scope.cateTreeDef = {
        expandDepth: 1,
        rootName: '所有分类',
        itemLabel: 'name',
        onSelect: function(item) {
            $scope.curItem = item;
        },
    }

    $scope.CreateChild = function(name) {
        CategoryRS.Save({
            pid: $scope.curItem._id,
            name: name,
        }).then(function(){
            $scope.newItem = {};
        });
    }

    $scope.openNode = function(item) {
       $scope.cateTreeDef.treeCtl.expand(item, true); 

    }

    $scope.GotoNewProductEdit = function() {
        $state.go('product.one.edit', {
            product:'new', 
            init: JSON.stringify({
                category:$scope.curItem._id,
            }),
        });
    }

    ControllerHelper.Init({
        scope:     $scope,
        controller: 'ProductCategoryController',
        modelLabel: '产品分类',
        modelName:  'category',
        rs:         CategoryRS,
        restricts:  null,
        stateHead:  null,
        newTpl:     {},
    }).then(function(){
    });
});
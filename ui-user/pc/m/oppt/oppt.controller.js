app.controller('OpptController', function(
                $scope
                , $state
                , $modal
                , $timeout
                , ControllerHelper
                , Dict
                , Dialogs
                , ContactRS
                , ClientRS
                , OpptRS
                , Cache
                )  {

    $scope.opptAttrs = [
        {
            label: '机会主题',
            name: 'name',
        },
        {
            label: '客户',
            name: 'client',
            options: $scope.clients,
            optionLabelName: 'name',
            optionValueName: '_id',
            additions: [
                {
                    type: 'Button',
                    label: '新建',
                    click: function(){
                        $scope.formClient = {_id: 'new'};
                        Dialogs.Form($scope, {
                            title: '新建客户',
                            templateUrl: '/ui-user/pc/m/client/client.one.edit.html',
                            Confirm: function() {
                                return ClientRS.Save($scope.formClient).then(function(client){
                                    $scope.formOppt.client = client._id;
                                });
                            }
                        });
                    },
                }
            ]
        },
        {
            label: '客户联系人',
            name: 'contact',
            options: $scope.contacts,
            optionLabelName: 'name',
            optionValueName: '_id',
             additions: [
                {
                    type: 'Button',
                    label: '新建',
                    click: function(){
                        $scope.formContact = {_id: 'new'};
                        Dialogs.Form($scope, {
                            title: '新建客户联系人',
                            templateUrl: '/ui-user/pc/m/contact/contact.one.edit.html',
                            Confirm: function() {
                                return ContactRS.Save($scope.formContact).then(function(contact){
                                    $scope.formOppt.contact = contact._id;
                                });
                            }
                        });
                    },
                }
            ]
       },
        {
            label: '发现时间',
            name: 'opptDate',
            type: 'Date',
        },
        {
            label: '来源',
            name: 'source',
            options: ['电话来访', '客户介绍', '独立开发', '展会', '媒体宣传','老客户','代理商', '合作伙伴','Alibaba','其它网站','其他'],
        },
        {
            label: '我方负责人',
            name: 'opptOwner',
            options: $scope.users,
            optionLabelName: 'username',
            optionValueName: '_id',
            // options: $scope.users.map(function(user){
            //     return {
            //         label: user.username + ' - ' + user.fullname,
            //         value: user._id,
            //     }
            // }),
        },
        {
            label: '客户需求',
            name: 'need',
            type: 'Article',
        },
        {
            label: '优先级',
            name: 'priority',
            options: ['高', '中', '低'],
            type: 'Radio',
        },
        {
            label: '当前阶段',
            name: 'step',
            options: ['初期询价', '询价已回复','价格及细节谈判','合同签订', '待付款', '待发货', '待收尾款','结束'],
        },
        {
            label: '状态',
            name: 'status',
            options: ['正在进行', '项目搁置','项目失效','项目成功'],
            type: 'Radio',
        },
        {
            label: '可能性',
            name: 'possibility',
            options: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
            type: 'Radio',
        },
        {
            label: '备注',
            name: 'comment',
        },
    ];

    $scope.newOppt = {
        _id:'new', 
        opptOwner: $scope.USER._id, 
        opptDate: Date.now(),
        client: $scope.client ? $scope.client._id : null,
    };

    ControllerHelper.Init($scope, 'OpptController', '销售机会', 'oppt', OpptRS).then(function(){
        if ($scope.oppt) {
            var stateParams = '({oppt:"' + $scope.oppt._id + '"})';
            $scope.opptOneTabs = [
                {   
                    text: '主页', 
                    color: 'orange',
                    stateGroup:'oppt.one.detail', 
                    state: 'oppt.one.detail' + stateParams,
                    icon: 'fa fa-home',
                },
                {
                    text: '文档', 
                    color: 'orange',
                    stateGroup:'oppt.one.document', 
                    state: 'oppt.one.document' + stateParams,
                    icon: 'fa fa-home',
                },
            ];

            if (!$scope.oppt.documents)
                $scope.oppt.documents = [];
        }


    });

});


app.controller('OpptOneDocumentController', function(
                $scope
                , $state
                , $modal
                , $timeout
                , FileTypeServ
                , ControllerHelper
                , Dialogs
                , Dict
                , OpptRS
                , Cache
                )  {

    $scope.SaveDocuments = function(oppt) {
        return OpptRS.Save({
            _id: oppt._id,
            documents: oppt.documents,
        });
    }

    $scope.SaveDocumentsOnBlur = function(oppt) {
        var isDocsChanged = false;
        oppt.documents.forEach(function(doc){
            if (doc.$_isChanged)
                isDocsChanged = true;
            delete doc.$_isChanged;
        });

        if (!isDocsChanged)
            return;

        return $scope.SaveDocuments(oppt);
    }

    $scope.OpenDocument = function(doc) {
        window.open(doc.url);
    }
 
    $scope.DeleteDocument = function(oppt, doc) {
        // Dialogs.Confirm('是否确认删除此文件？', '确认').then(function(isYes){
        //     if (!isYes)
        //         return;
            if (!doc.$_isUploading) {
                oppt.documents.Delete(doc);
                $scope.SaveDocuments(oppt);
            }else {
                uploader.removeFile(doc.$_id);
                oppt.documents.Delete(doc);
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


    PreUploadFile = function(file) {
        $scope.oppt.documents.push({
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
        console.log($scope.oppt.documents);
    }
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'opptDocumentAddBtn',       //上传选择的点选按钮，**必需**
        uptoken_url: '/u/qiniu/uptoken',  //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true,            // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,             // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7sbqgr.com1.z0.glb.clouddn.com/', //bucket 域名，下载资源时用到，**必需**
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
                    var doc = $scope.oppt.documents.FindOne({$_id:file.id});
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
                    if (!$scope.oppt.documents)
                        $scope.oppt.documents = [];
                    var doc = $scope.oppt.documents.FindOne({$_id:file.id});
                    if (!doc) {
                        console.error('Can not find doc');
                        return;
                    }
                    doc.url = url;
                    delete doc.$_isUploading;
                    $scope.SaveDocuments($scope.oppt);
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


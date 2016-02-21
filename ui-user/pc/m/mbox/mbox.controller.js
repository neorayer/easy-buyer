app.controller('MboxController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , ControllerHelper
                , MessageRS
                )  {
});
app.controller('MboxOneMessageController', function(
                $scope
                , $rootScope
                , $state
                , $timeout
                , ControllerHelper
                , MessageRS
                )  {
    ControllerHelper.Init({
        scope:     $scope,
        controller: 'MessageController',
        modelLabel: '消息',
        modelName:  'message',
        rs:         MessageRS,
        restricts:   ['mbox'],
        stateHead:  null,
    }).then(function(){
    });

    $scope.View = function(message, isOpen) {
        if (isOpen) {
            $scope.messages.forEach(function(msg){
                msg.isBeingView = false;
            })
            message.isBeingView = true;
        }else {
            message.isBeingView = false;
        }
    }
});
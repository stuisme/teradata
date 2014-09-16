angular.module('reddit', [])
    .constant('reddit.urls', {
        pics :"http://www.reddit.com/r/pics.json"
    })
    .controller('MainCtrl', ['$scope', 'dataService', '$filter', '$window', function($scope, dataService, $filter, $window){
        $scope.loading = true;
        $scope.posts = [];

        $scope.selectPost = function(post){
            post.selected = !post.selected;
            setPostIndicator();
        };

        $scope.deselectedAll = function(){
            angular.forEach($scope.posts, function(post){
                post.selected = false;
            });
            setPostIndicator();
        };

        $scope.hideSelected = function(){
            setHideFlag(getSelected())
        };

        $scope.openImage = function(post){
            $window.open(post.data.url);
        };

        // privates
        var getSelected = function(){
            return $filter('filter')($scope.posts, {selected: true});
        };

        var setPostIndicator = function(){
            $scope.postCount = getSelected().length;
            $scope.noneSelected =  $scope.postCount == 0;
        };

        var setHideFlag = function(posts) {
            angular.forEach(posts, function(post){
                post.hide = true;
                post.selected = false;
            });

            setPostIndicator();
        };

        // init
        setPostIndicator();

        dataService.getPosts().then(function getPostsSuccess(result){
            $scope.posts = result.data.data.children;
        }, function getPostsFailed(){
            $scope.error = true;
        }).finally(function(){
            $scope.loading = false;
        });

    }])
    .service('dataService', ['$http', 'reddit.urls', function($http, urls){

        return {
            getPosts : function(){
                return $http.get(urls.pics);
            }
        };
    }]);
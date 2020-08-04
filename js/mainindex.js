require.config({
  paths:{
      jquery:"../node_modules/jquery/dist/jquery.min",
      echart:"./echart",
      example:"./lib/example",
      index:"./index"
  },
  shim:{}
});
require(['jquery','example','echart','index'],function($,example,echart,index){
  index.start(map_change,mapCode,mapName);
  example.left_middleecharts(map_change);
  
  example.right_middleecharts(map_change);
  example.right_bottomecharts(map_change);
  example.map_bottomecharts(map_change);

  index.back();
   index.mpaClick();
  index.jump();    // 标签名点击跳转页面地图点击跳转内嵌在mpaClick里面

//请求数据
  example.rander_duty(map_change);
  example.rander_table(map_change);
  example.rander_rightTop(map_change)
  // example.scrool_table();
  // example.scrool_system();
});

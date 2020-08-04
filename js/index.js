var map_change = {
  area:'',
  name:''
}
var mapCode = "360000"
var mapName = "江西"

var mapStack = [];
var curMap = {};
var richTime='' ;
var sid = {};

var chart = echarts.init(document.getElementById('map'));
define(['jquery','example'],function($,example){
	return {
		start:function (map_change,code_1,name_1) {
			let _self = this
			$.ajax({
				type: 'get',
				url: `${baseUrl}/map`,
				data:map_change,
				success: function (res) {
					console.log('获取的数据',res)
				$('.title-number-1').html(`${res.country.num}/`)
				$('.point-number-1').html(`${res.country.total}个`)

				$('.title-number-2').html(`${res.province.num}/`)
				$('.point-number-2').html(`${res.province.total}个`)

					var longAndLat=[];
					var legend_data = [];
					var series_data_1 = [];
					var scenic_data = [];
					$('.title-number').html()
					let warning = {
								color:'red'
						};
					let online = {
						color:'#afb4db'
					};

					if( name_1 === "江西"){
						res.list.forEach((item,index) => {
							longAndLat.push( {coord:item.coord.reverse(), name:Number(index + 1), value:item.name} );
							if(item.warning){
								longAndLat[index]['itemStyle']= warning
							} 
						});
					} else {
						res.scenic.forEach((item,index) => {
							scenic_data.push( {coord:item.coord.reverse(), name:Number(index + 1), value:item.name,sid:item.scenic_id,
																warnSum:item.info.warn,inspect:item.info.inspect,staff:item.info.staff,nameList:item.nameList});
							legend_data.push( {name:String(index+1 + '.') + item.name} );
							series_data_1.push({name:String(index+1 + '.') + item.name, type:'map',}),

							sid[(String(index+1 + '.') + item.name)]= item.scenic_id

							if(item.warning){
								scenic_data[index]['itemStyle']= warning
								legend_data[index]['textStyle'] = warning
								
								legend_data[index]['itemStyle'] = warning
							}
							if(!(item.online)){	
								scenic_data[index]['itemStyle']= online
								scenic_data[index]['symbolSize']= [30,20]
								legend_data[index]['textStyle'] = online
							}else {
								scenic_data[index]['symbolSize']= [30,30]
								scenic_data[index]['z'] = 10
								scenic_data[index]['zlevel'] = 20
							}
						})
					}
					if ( name_1 === "江西"){
						console.log("mapStack.length",scenic_data)
						_self.map_echarts(longAndLat,code_1,name_1,series_data_1,legend_data)
					} else {
						_self.map_echarts(scenic_data, code_1,name_1, series_data_1,legend_data)
						console.log(legend_data,'dsfafdsafdsafdsa')
					}
				},
				});
		},
			map_echarts:function(technical, code_1,name_1,series_data_1,legend_data){

				console.log("对调了么",series_data_1)
				var series_data = [
					{  // 含引导线的省份，用lines实现
						name:'',
						type: 'lines',
						markPoint: {
							symbol: 'pin',
							symbolSize:[30,20],
							// z:1,
							tooltip:{
								trigger: "item",
								formatter:function(params){
								if(params.data.value === "庐山别墅建筑群"){
									console.log('shifou zhixign ',params)
										let list = params.data.nameList.toString().split('，');
										let s = '';
										console.log('是否有值',list)
										s += params.data.value + '\n';
										s +=  list[0]+ '\n';
										s += list[1]+ '\n';
										s += list[2]+ '\n';
										s += list[3];
										return s
									} else {
										return params.data.value
									}
								},
								extraCssText:'white-space:pre-wrap'
							},
							label: {	
								show: true,
								formatter:function (params){
									if(name_1 === "江西"){
										return ''
									} else {
										return params.name
									}
								},
								distance:12,
								position: 'inside',
								color: '#7a1723',
								fontSize: ".12rem",
								emphasis: {
										show: true
								}
						},
						itemStyle: {
							normal: {
								color:"#7fb80e"
							}
						},
							data:technical.reverse(),
						},
					},
				]
				console.log(technical)
				var seriesData = name_1 === "江西" ? series_data : series_data.concat(series_data_1)

		var data1 = [
		 {name: "南昌市", value: "10"},
		 {name: "景德镇市", value: "12"},	
		 {name: "萍乡市", value: "5"},
		 {name: "九江市", value: "20"},
		 {name: "新余市", value: "4"},
		 {name: "鹰潭市", value: "3"},
		 {name: "赣州市", value: "28"},
		 {name: "吉安市", value: "22"},
		 {name: "宜春市", value: "19"},
		 {name: "抚州市", value: "16"},
		 {name: "上饶市", value: "21"}
		]
		
		var opation = {
			tooltip: {
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: "{c}",
				triggerOn: "mousemove",
			},
			title:{
				show:true,
				text:name_1,
				left:'center',
				top:'15%',
				textStyle:{
					color:'rgb(22, 186, 219)',
					fontWeight: 'bold',
    			fontWize: '0.4rem',
    			fontFamily: "lisu",
    			// color: '#fff',
				}
			},
			legend:[
				{
					top:'15%',
					left:'0%',
					icon:'circle',
					itemStyle:{
						color:'#afb4db'
					},
					
					inactiveColor:'#afb4db',
					itemGap:5,
					backgroundColor:'rgba(36,107,178,0.2)',
					itemWidth:10,
					itemHeight:10,
					orient :'vertical',
					align:'left',
					width:12,
					show:true,
					tooltip: {
						show:true,
					},
					formatter: function (name) {
						return (name.length > 12 ? (name.slice(0, 12) +'\n' + '\u0020\u0020\u0020'+ name.slice(12)) : name);
					},
				  textStyle: {
						color:'#7fb80e',
						fontSize:12,
		          },
						data:  legend_data.splice(0,Math.ceil(legend_data.length/2))
				},
				{
					right:'0%',
					bottom:'0%',
					icon:'circle',
					itemStyle:{
						color:'#afb4db'
					},
					itemGap:5,
					backgroundColor:'rgba(36,107,178,0.2)',
					itemWidth:10,
					itemHeight:10,
					orient :'vertical',
					align:'left',
					width:12,
					show:true,
					tooltip: {
						show:true,
					},
					formatter: function (name) {
						return (name.length > 12 ? (name.slice(0, 12) + '\n' + '\u0020\u0020\u0020\u0020\u0020'+ name.slice(12)) : name);
					},
				  textStyle: {
						color:'#7fb80e',
						fontSize:12,
		          },
						data:legend_data
				}
			],
			
			
			geo:{
					type:'map',
					top:'25%',
					bottom:'0%',
					containLabel: true,
					map:'jiangxi',
					zoom:1,
					roam: true, //是否开启平游或缩放
					scale: true,
					scaleLimit: { //滚轮缩放的极限控制
						min: 1,
						max: 5
					},
					itemStyle: {
						normal: {
							areaColor:'#24507F',
							borderWidth:1,
							borderColor:'#389BB7',
							},
						},
						label: {
							show:true,
							textStyle: {
								color:'#6CE9FF',
							},
							normal: {
									show: true,
									color:'#6CE9FF',
									formatter:function(params){
										for (var i = 0; i < data1.length; i++) {
											if (data1[i].name == params.name) {
													return params.name +"\n"+ data1[i].value;
											}
										}
									}
							},
						},
						
					},
			series: seriesData,
		};
		
		loadMap(code_1,name_1);
		
		function loadMap(code_1,name_1){
			
			console.log('kkk',code_1,name_1)
				let spstr = code_1.split('');
				let code = spstr.pop();
			
				if(	richTime){
					clearInterval(richTime)
				};
			if( -(code) ){
				$.getJSON('https://geo.datav.aliyun.com/areas_v2/bound/' + code_1 + '.json',function (data) {
					console.log('是否静茹改地图')
					chart.hideLoading()
				echarts.registerMap('jiangxi', data);
			
				chart.setOption(opation,true);
				curMap = {
					mapCode: code_1,
					mapName: name_1
				};
				});
			} else {
				$.getJSON('https://geo.datav.aliyun.com/areas_v2/bound/' + code_1 + '_full.json', function (data) {
					chart.hideLoading()
					echarts.registerMap('jiangxi', data);
				
					chart.setOption(opation,true);
					 curMap = {
						mapCode: code_1,
						mapName: name_1
				};
			});
			}
			
		};
			window.onresize = function () {
				chart.resize();
			}
		},


		mpaClick:function(){
	   let _self = this
		var city = { "江西":"360000","九江市" :'360400',"南昌市":"360100","宜春市":"360900","吉安市":"360800","庐山市":"360483",
		"景德镇市":"360200","浮梁县":"360222","珠山区":"360203","昌江区":"360202","乐平市":"360281"};

			chart.on('click', function (params) {
				console.log("地图点击事件",params)
				if(params.componentType === "geo" ){
					switch (params.name) {
						case  '九江市' :
								map_change.area='city';
								map_change.name="九江市";
								mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
								_self.changeDate();
			
								console.log('访问curMap',curMap.mapCode)
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
								console.log("数组是否添加",	mapStack)
						break;
							case  '庐山市' :
								map_change.area='district',
								map_change.name="庐山市",
								mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
								console.log("数组是否添加",	mapStack)
						break;
							case '南昌市' :
							map_change.area='city',
							map_change.name="南昌市",
							mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
								_self.changeDate();
		
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
					
						break;
							case '宜春市' :
							map_change.area='city',
							map_change.name="宜春市",
			
							mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
						
						break;
							case '景德镇市' :
							map_change.area='city',
							map_change.name="景德镇市",
			
							mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
			
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
								console.log("数组是否添加",	mapStack)
						break;
							case '浮梁县' :
							map_change.area='district',
							map_change.name="浮梁县",
							mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
		
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
							
						break;
						case '珠山区' :
							map_change.area='district',
							map_change.name="珠山区",
			
								mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
			
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
							
						break;
						case '昌江区' :
							map_change.area='district',
							map_change.name="昌江区",
							mapCode = city[params.name];
								mapName = params.name;
								_self.start(map_change,city[params.name],params.name);
			
								_self.changeDate();
								mapStack.push({
									mapCode: curMap.mapCode,
									mapName: curMap.mapName
								}); 
							
						break;
						case '乐平市' :
							map_change.area='district',
							map_change.name="乐平市",
							mapCode = city[params.name];
							mapName = params.name;
							_self.start(map_change,city[params.name],params.name);
			
							_self.changeDate();
							mapStack.push({
								mapCode: curMap.mapCode,
								mapName: curMap.mapName
							}); 
						 
						break;
							case '吉安市' :
							map_change.area='district',
							map_change.name="吉安市",
							mapCode = city[params.name];
							mapName = params.name;
							_self.start(map_change,city[params.name],params.name);
			
							_self.changeDate();
							mapStack.push({
								mapCode: curMap.mapCode,
								mapName: curMap.mapName
							}); 
							default:
								break;
							}
					} else if ( mapName !=="江西" ) {
						if(!(params.data.sid)){
							alert('此景点暂未安装设备')
						}else {
							window.location.href=`${mapUrl}/aixm/index/maps/scenic_id?sid=${params.data.sid}`;
						}	
					}
				
			});
		},

		jump:function () {
			 var siddata = sid
			chart.on('legendselectchanged', function(params) {
					params.selected[params.name] = true
				console.log("paramsparams",params,params.name)
				if( !(siddata[params.name])){
					alert('此景点暂未安装设备')
					params.selected[params.name] = true
				}else {	
					window.location.href=`${mapUrl}/aixm/index/maps/scenic_id?sid=${siddata[params.name]}`;
				}
			});
		},
	
		back:function(){
			let _self = this 
			$("#back-map").on("click", function(){
				var map = mapStack.pop();
				console.log('删除返回的元素',map)
				console.log('mapStack',mapStack)
				if( mapStack.length === 1){
						map_change.area='city',
						map_change.name= map.mapName,
						console.log('请求的数据', map.mapName)
						_self.start(map_change,map.mapCode,map.mapName);
						_self.changeDate();
					} else {
						map_change.area='',
						map_change.name='',
						mapName = "江西",
						mapCode = "360000",
						console.log('请求的数据',map.mapName)
						_self.start(map_change, map.mapCode, map.mapName);
						_self.changeDate();
					}
				});
		},
		changeDate:function(){
			example.left_middleecharts(map_change);
			example.right_middleecharts(map_change);
			example.right_bottomecharts(map_change);
			example.map_bottomecharts(map_change);
		//请求数据
			example.rander_duty(map_change);
			example.rander_table(map_change);
			example.rander_rightTop(map_change);
		},
	}
})
let tiem = ''
define([],function(){
    return {
    setOptions: function(ech, options, click, mapData) {
            let _self
            if (options && typeof options === "object") {
                if (echarts.getInstanceByDom(ech)) echarts.dispose(ech);
                _self = echarts.init(ech);
                if (mapData && (mapData.action === null || mapData.action === undefined)) {
                    _self.hideLoading();
                    let name = null;
                    if (options.geo3D) name = options.geo3D.map;
                    else if (options.geo) name = options.geo.map;
                    else name = options.series[0].map;
                    echarts.registerMap(name, mapData);
                }
                _self.setOption(options);
                _self.resize();
                _self.on('click', params => {
                    //      _self.dispatchAction({ type: 'highlight', dataIndex: params.dataIndex });
                    click(params)
                });
                _self.on('mouseover', params => {
                    // _self.dispatchAction({ type: 'downplay', dataIndex: params.dataIndex });
                });
                _self.on('contextmenu', params => { //鼠标右键事件
                    //      _self.dispatchAction({ type: 'highlight', dataIndex: params.dataIndex });
                    mapData.callback(params)
                });
                let str = ech.getAttribute("id");
                let str1 = function() {
                    if (!$("#" + str).length) {
                        window.removeEventListener("resize", str1, true);
                        str1 = null;
                        _self = null;
                        str = null;
                    } else _self.resize();
                };
                window.addEventListener("resize", str1, true);
            }
            return _self
          },
    left_middle:function (dom, option, click){
        var trafficWay = option.data;
        var data = [];
        var color=['#00ffff','#00cfff','#006ced','#ffe000','#ffa800','#ff5b00','#ff3000']
        for (var i = 0; i < trafficWay.length; i++) {
            data.push({
                value: trafficWay[i].value,
                name: trafficWay[i].name,
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        shadowBlur: 5,
                        borderColor:color[i],
                        shadowColor: color[i]
                    }
                }
            }, {
                value: 2,
                name: '',
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
        }
            });
        }
        var seriesOption = [{
            name: '',
            type: 'pie',
            clockWise: false,
            center:['50%','55%'],
            radius: [50, 58],   
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'outside',
                        color: '#ddd',
                        formatter: function(params) {
                            var percent = 0;
                            var total = 0;
                            for (var i = 0; i < trafficWay.length; i++) {
                                total += trafficWay[i].value;
                            }
                            percent = ((params.value / total) * 100).toFixed(0);
                            if(params.name !== '') {
                                return  params.name + '：' + params.value + '\n' + '占比:' + percent + '%';
                            }else {
                                return '';
                            }
                        },
                    },
                    labelLine: {
                        length:10,
                        length2:10,
                        show: true,
                        color:'#00ffff'
                    }
                }
            },
            data: data
        }];
        option = {
            color : color,
            title: {
                text: option.name,
                top:"48%",
                left:'48%',
                textAlign: "center",
                textStyle: {
                    color: option.color,
                    fontSize: 16,
                    fontWeight: '300'
                }
            },
            // graphic: {
            //     elements: [{
            //         type: "image",
            //         z: 3,
            //         style: {
            //             image: option.img,
            //             width: 88,
            //             height: 88
            //         },
            //         left: '38%',
            //         top:  '30%',
            //         position: [1, 1],
            //     }]
            //     },
            tooltip: {
                show: false
            },
            toolbox: {
                show: false
            },
            series: seriesOption
            }
         this.setOptions(dom, option, click); 
        },
    right_middle:function (dom, option, click){
        console.log(option.thunder,option.yAirs, option.fire,)
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                top:'13%',
                textStyle:{
                    color:'#FFFFFF'
                },
                data: ['消防设备', '安防设备', '防雷设备']
            },
            grid: {
                left: '4%',
                right: '8%',
                top:'30%',
                bottom: '-8%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                show:false,
                axisLine:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                }
            },
            yAxis: {
                type: 'category',
                data: option.yAirs,
                axisLine:{
                    show:false,
                },
                axisLabel:{
                    margin:10,
                    interval: 0, //强行显示一行
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: '14',
                        fontFamily:'Microsoft YaHei',
                        // fontWeight:400,
                    },
                },
                axisTick:{
                    show:false
                },
            },
            color:['#FF1936','#FFD400','#00CCFF'],
            series: [
                {
                    name: '消防设备',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: option.fire,
                    barMaxWidth:50
                },
                {
                    name: '安防设备',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: option.safety
                },
                {
                    name: '防雷设备',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: option.thunder
                },
               
                ]
            };
            this.setOptions(dom, option, click);
        },
    right_bottom:function (dom, option, click){
        option = {
            radar: {
                indicator: option.name,
                nameGap : 10, // 图中工艺等字距离图的距离
                center: ['50%', '55%'],
                radius: '60%',
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                name: {
                    formatter:'{value}',
                    textStyle: {
                        color:'#FFFFFF'
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['transparent']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#085F73'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#085F73'
                    }
                }
              },
              series: [{
                name: '告警处置率',
                type: 'radar',
                symbol: "none",
                areaStyle: {
                    normal: {
                        width: 1,
                        opacity: 0.7,
                    },
                },
                    data: [{
                        itemStyle: {
                            normal: {
                                color: '#00FFFF',
                            },
                        },
                        value: option.val,
                        areaStyle: {
                            opacity: 0.5,
                            color:'#00FFFF' }
                    }]
                }]
            };
        this.setOptions(dom, option, click);
        },
    map_bottom:function (dom, option, click){
        option = {
            tooltip: {
                show: true,
                trigger: 'axis',

            },
            color:[ '#17D8A1','#00A8FF','#E0BB11','#6939D2' ], 
            legend: {
                top:'20%',
                itemWidth:15,
                itemHeight:5,
               data:[
                 {
                   name:'日常巡检',
                   icon:'rect',
                   textStyle: {
                        color: '#17D8A1'          // 图例文字颜色
                     }
                 },
                {
                  name:'设备巡检',
                  icon:'rect',
                   textStyle: {
                        color: '#00A8FF'          // 图例文字颜色
                     }
                 },
                {
                   name:'文物巡检',
                   icon:'rect',
                   textStyle: {
                        color: '#E0BB11'          // 图例文字颜色
                     }
                 },
                 {
                   name:'防火巡检',
                   icon:'rect',
                   textStyle: {
                        color: '#6939D2'          // 图例文字颜色
                     }
                 },
               ]
            },

            grid: {
                left: '3%',
                right: '6%',
                top:'40%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: option.xAxis,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    
                    axisLabel:{
                        interval: 0, //强行显示一行
                        textStyle: {
                            color: "#E6E6E6",
                            fontSize: '12',
                            fontFamily:'Microsoft YaHei',
                            axisLabel: {
                                interval: 0, //强行显示一行
                            },
                        },
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max:8,
                    name:'次数',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#38435B'
                        }
                    },
                    axisLabel:{
                        textStyle: {
                            color: "#FFFFFF",
                            fontSize: '14',
                            fontFamily:'Microsoft YaHei',
                            fontWeight:400,
                        },
                    },
                    nameTextStyle:{
                        color:'#5FE4FF'
                    }
                }
            ],
            series: [
                {
                    name: '日常巡检',
                    type: 'line',
                    // symbol: 'triangle',
                    lineStyle:{
                        color: "#17D8A1",
                        // type:'dashed'
                    },
                    data: option.daily
                },
                {
                    name: '设备巡检',
                    type: 'line',
                    // symbol: 'none',
                    lineStyle:{
                        color: "#00A7FE",
                        // type:'dashed'
                    },
                    data: option.device
                },
                {
                    name: '文物巡检',
                    type: 'line',
                    // symbol: 'none',
                    lineStyle:{
                        color: "#E0BB11",
                        // type:'dashed'
                    },
                    data: option.cultural_relic
                },
                {
                    name: '防火巡检',
                    type: 'line',
                    // symbol: 'none',
                    lineStyle:{
                        color: "#6939D2",
                        // type:'dashed'
                    },
                    data: option.fire
                },
            ]
        };
        if (echarts.getInstanceByDom(dom)) echarts.dispose(dom);
        let _self = echarts.init(dom);
        if (time){
            clearInterval(tiem)
        }
        _self.setOption(option);
        _self.resize();
        let str = dom.getAttribute("id");
        let str1 = function() {
            if (!$("#" + str).length) {
                if (time){
                    clearInterval(tiem)
                }
                window.removeEventListener("resize", str1, true);
                str1 = null;
                _self = null;
                str = null;
            } else _self.resize();
        };

        
        window.addEventListener("resize", str1, true);
        var index = 0; //播放所在下标
        time = setInterval(function() {
            console.log('是否有值',$('.main').height())
            _self.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: index
            });
            index ++;
            if( index > option.xAxis[0].data.length) {
                index = 0;
                _self.dispatchAction({
                    type: 'showTip',
                    seriesIndex: index,
                    dataIndex: index
                });
                index++;
            }
        }, 5000);
       },
    };
})

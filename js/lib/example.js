

let baseUrl = "https://ai.tehn.com.cn/aixm/api/indexmap";
let mapUrl = "https://ai.tehn.com.cn";
let barTime = '';
let alarmTime = '';
let earlyTime1 = '';

define(['jquery','echart'],function($,echart){
  return{
    addKeyFrames:function(y){
      var style = document.createElement('style');
      style.type = 'text/css';
      var keyFrames = '\
      @-webkit-keyframes rowup {\
          0% {\
              -webkit-transform: translate3d(0, 0, 0);\
              transform: translate3d(0, 0, 0);\
          }\
          100% {\
              -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
              transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
          }\
      }\
      @keyframes rowup {\
          0% {\
              -webkit-transform: translate3d(0, 0, 0);\
              transform: translate3d(0, 0, 0);\
          }\
          100% {\
              -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
              transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
          }\
      }';
      style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, y);
      document.getElementsByTagName('head')[0].appendChild(style);
  },
    rander_duty: function(map_change) {
      $.ajax({
              type: 'get',
              url: `${baseUrl}/duty`,
              data:map_change,
              success: function (res) {
                $(".station-detail").empty();      
                  let tempstr='';
                  res.forEach((elm,index)=>{
                    tempstr=` <li class="left-top-li"><span class="city-name">${elm.name}</span><div class="bar-number bar-number-${index}"><div class="bar-width bar-width-${index}"></div></div><div class="txt-number txt-number-${index}">${elm.sign_num}/${elm.total_num}</div></li>`
                    $('.station-detail').append(tempstr);

                    if(res.length > 6){ 
                      $(".bar-number").css("width","1.07rem")
                      $(".city-name").css({"width":"0.65rem","marginRight":"0.05rem"})
                      $(".txt-number").css("width","0.5rem")
                      var  kuan =  ( (elm.sign_num / elm.total_num) * 1.07).toFixed(2)
                      $(".bar-width-"+ index).css("width", 0+kuan + "rem")//试试
                     
                    }else{
                      var  kuan =  ( (elm.sign_num / elm.total_num) * 2.2).toFixed(2)
                      $(".bar-width-"+ index).css("width", 0+kuan + "rem")//试试
                      $(".city-name").css({"marginRight":"0.2rem"})
                      $(".left-top-li").css("width","100%")
                    }

                    if(elm.online){
                      if(elm.sign_num === elm.total_num){
                        $(".bar-width-" + index).css("backgroundColor","#16BADB"),
                        $(".txt-number-" + index).css("borderColor","#16BADB"),
                        $(".bar-number-" + index).css("borderColor","#16BADB")
                      } 
                    } else{
                      $(".txt-number-" + index).empty()
                      $(".txt-number-" + index).html('未接入')
                      $(".txt-number-" + index).css("borderColor","#434343"),
                      $(".bar-number-" + index).css("borderColor","#434343")
                    }                    
                  });
                  
              }
          })
    },

    left_middleecharts:function(map_change){
      $.ajax({
        type: 'get',
        url: `${baseUrl}/alarmDistribution`,
        data:map_change,
        success: function (res){
            let data1 =  res[0];
            let name1 = '设备告警';
            let color1 = "#fac301";
            let data2 = res[1];
            let name2 = '设备故障';
            let color2 = "#ff0000";
            var img1 = 'data:image/png;base64,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';
            var img2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADGBAMAAAB7teJuAAAAJFBMVEVHcEz/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD+4uyVAAAAC3RSTlMA9BG3dp/WTmYpN0FgapYAAATRSURBVHja7VzPTxNBFB63pdieLIoicynBqpELmpiIe6mGmBAurSaa2Etj9KC9gImnXkRv9oKRcPFCMBoTTsOyFHj/nLsthe0y251fb7zsd9xO9tuZ770305l5jxAR3HlR4zzNP/xITOHeSwAuB8BbMyzOV8oSOYA9quhT3HWDN01/4/72twFAvS+6FJ8owNWVxJ+37gddeaU3Ts/CV4wbDSf8iLca41VsBp1IU/VO0BV/U5Wi5Ap9YthZb0eNYjKgeC3U8heFwx3FXrAVwbZbVKknxYDiqXDrWwGJvCYNGYrAHymblrWuDSpFEfaEzchR/AB4LvlVVaBLMu2DSPRYenR/8aNakt5tmFGwxA04FNe9C75KdHBcuCbadh7YmprXUngg6Hxl0ZacrxP09ydKYgwlORBpNiGjHMda6gLCtZVH6nS00s1lW6y3Y0b6Q6rgVNGmzm2Lpcm+Du81VwDb0Ev7Cg3BzwT9nOLhD4gu5uFo3M+XwTOw6nPHxsauiHULeNjRuG74RpavzTGKdKQnJj5ycCPZqDxiBi4k+ch3WDTEkYObSYYtEGpEfYTxX3Vb28Wj7+L7WZNtGuMoUp9vuD1iDh2uH+7JrFwEVk+zHJnKHjEJl6N6Dt4Y5bjNLjpC16DiA9WPBB5pogvxjy4Y8/HzwW/FnqyyimEOhx7Eh6pHTKMTUzhnZHKKT1WLMauqGOdwRs3IMW5VFz98grYQOAq0PjI7bSJwFEdmKtcnGGhGQmAJplA45iLTes5oWI8G+MWIt1RQOJyIZ7sHBAerHrYchFw6EwRLjqgge0hyhIKcDM0YS45AEH9IdozG8RMqp4NWR+OYOJW6ADtoHKXTCbdzSPDQ7mFLPhTdQfPAQVis9NfSi4gcuf5fwxysIXJM9nuwgOblA+fbD2d2n2CiGa5G3B4qRycM73QKlWOBDUXBNKy1YGlVQ+UIo2EBZWkVWWSxFlk4JLgo7w90RzXeHmkcIXME/uceI3PseWS5hsyRXyYZMmTIkCFDhgwZMmTIkCFDhv8PG3sA7gkyx5432FPERNcnHR+Zo9nr7ymigu7j7/VBi+QB17DyrG5l79VB3kOeC/W2sRduY0/fxtmEjTMWG2dFuIY1N1DCwtmdlTNIG2epNs6EHcA/27ZxRm/lroGNOxMluILlgWcm6+DdYbl+HuOx7uKUe5HAVUOWA+8yzkI0gli440W+o4Ss0kgAmWAtBI4Cq4/4I/7dQRTrdehMbNo1H9/jdzlR7qTGV+sW7tZauSOMcNf54gVt83e2DzhdM3z3nDP4TtvwHfoyx4jW8XMBDOc0JHyxhdyMIExOGVScH8iN5sokvcpkzs9s0v8qc7lLyfl9HUMdqY4xURu5ZKRrpCPVscl9eYqf22cjRzHMtaxo+0ZKrqWBnNE/qXHPRu6rdg7vqsBAFF0t2asiuchhK/UYL5ZTrZcb3gWx5U2prZHjXt4RbYmeqx+OlqfiiU5TYpRt1E4IYiN6DQjFWhawJNtvkK3JIT2+TgNYTY5CvjaFZI2UtkqNFKlaL1WqWLVGvGbNbwae4owwKVF7Z1d5M6IhWENoWmMrxHlCsWshkX55oLSaTvBKd5mRVpsK9GtT9WtsQVKNLWamxlZoXy9pUh2vd7vEFPRqnv0D37C4lFfbrMEAAAAASUVORK5CYII='
            echart.left_middle(document.getElementById("left-middle"),{
              data:data1,
              name:name1,
              color:color1,
              img:img1
            },params => {});

            if(alarmTime){
              clearInterval(alarmTime)
              };
            if(earlyTime1){
              clearTimeout(earlyTime1)
            };

            earlyTime1 = setTimeout(() => {
              echart.left_middle(document.getElementById("left-middle"),{
                data:data2,
                name:name2,
                color:color2,
                img:img2
              },params => {})
            }, 5000);

          alarmTime = setInterval(function(){
            let earlyTime2 = setTimeout(() => {
              echart.left_middle(document.getElementById("left-middle"),{
              data:data1,
              name:name1,
              color:color1,
              img:img1
            },params => {})
            }, 0);

            let earlyTime1 = setTimeout(() => {
              echart.left_middle(document.getElementById("left-middle"),{
                data:data2,
                name:name2,
                color:color2,
                img:img2,
              },params => {})
            }, 5000);
            },10000)
        }
      })
      },

    rander_table:function(map_change){
        let _self= this 
      $.ajax({
        type: 'get',
        url: `${baseUrl}/alarmToday`,
        data:map_change,
        success: function (res){
          $(".table_height").empty(); 
          $(".table-contain .table_height").removeClass("rowup");
          let tempstr = '' 
          res.forEach((elm,index) => {
          tempstr = `<tr class="tr-${index}">
            <td class="table table${index}"> 
            <span>${elm.name}</span></td>
            <td class="table">${elm.alarm_content}</td>
            <td class="table">${elm.date}</td>
          </tr>`
            $('.table_height').append(tempstr)
            if(elm.alarm_type === 1 && elm.alarm_level === 1){
              let img = `<img
              class="thunder-1"
                src="./images/thunder-yellow.png"
                style="width: .25rem; height: .25rem;"
              />`
              $(".table"+ index).prepend(img)
              $('.tr-'+ index).css("color","#FFFF00")
              };
            if(elm.alarm_type === 1 && elm.alarm_level === 2){
              let img = `<img
                class="thunder-1"
                  src="./images/thunder-orange.png"
                  style="width: .25rem; height: .25rem;"
                />`
                $(".table"+ index).prepend(img)
                $('.tr-'+ index).css("color","#FF6917")
            };
            if(elm.alarm_type ===1 && elm.alarm_level === 3){

              let img = `<img
              class="thunder-1"
                src="./images/thunder-red.png"
                style="width: .25rem; height: .25rem;"
              />`
              $(".table"+ index).prepend(img)//试试看
              $('.tr-'+ index).css("color","#FF0000")
            };
            if(elm.alarm_type === 3){
              let img = `<img
              class="thunder-1"
                src="./images/safety.png"
                style="width: .25rem; height: .25rem;"
              />`
              $(".table"+ index).prepend(img)
              $('.tr-'+ index).css("color","#FF6917")
            };
            if( elm.alarm_type === 2){
              let img = `<img
              class="thunder-1"
                src="./images/fire.png"
                style="width: .25rem; height: .25rem;"
              />`
              $(".table"+ index).prepend(img)
            } 
            if(elm.alarm_type === 4){
              let img = `<img
              class="thunder-1"
                src="./images/fault.png"
                style="width: .25rem; height: .25rem;"
              />`
              $(".table"+ index).prepend(img)
              $('.tr-'+ index).css("color","#FFFFFF")
            }
           
          })
         
          _self.change()
        },
      })
    
    },

    rander_rightTop:function(map_change){
      let _self = this
      $.ajax({
        type: 'get',
        url: `${baseUrl}/systemAccess`,
        data:map_change,
        success: function (res){
          $(".contain-ul .right-top-detail").removeClass('rowup')
          $(".right-top-detail").empty();
          $(".number-top").empty();
          let tempstr2 = `<span>${res.access}</span><span class="number-top-2">/${res.total}</span>`
          $(".number-top").append(tempstr2),

          res.list.forEach(elm => {
            let tempstr =`<li class="right-top-li"> <span class="right-cityName">${elm.name}</span> <span class="insert">已接入：${elm.access}个</span> <span class="not-line">未上线：${elm.offline}个</span></li>`
            $(".right-top-detail").append(tempstr)
          })
         
          _self.change()
        }
      })
     
    },
    change: function () {
      let containHeight = $(".table-contain").height()
      let tableHeigth = $(".table-contain>table").height()
      
      let contain_ul = $('.contain-ul').height()
      let right_top_detail = $('.right-top-detail').height()
      // console.log("contain_ul ",contain_ul,"right_top_detail",right_top_detail)
      if( containHeight < tableHeigth){
        let html = document.querySelector('.table_height').innerHTML
          document.querySelector('.table_height').innerHTML = html+html 
          this.scrool_table()
        }
      if( contain_ul < right_top_detail){

        let html = document.querySelector('.right-top-detail').innerHTML
        document.querySelector('.right-top-detail').innerHTML = html+html 
        this.scrool_system()
        }
      },
    right_middleecharts: function(map_change){
      $.ajax({
        type: 'get',
        url: `${baseUrl}/deviceOverview`,
        data:map_change,
        success: function (res){
          let yAirs= []
              fire = []
              safety = []
              thunder = [];
          res.forEach(elm =>{
            yAirs.push(elm.name),
            fire.push(elm.fire_device),
            safety.push(elm.safe_device),
            thunder.push(elm.thunder_device)
          })
          
          var fireGroup = [];
          var safetyGroup = [];
          var thunderGroup = [];
          var yAirsGroup = [];

          for (var i = 0; i < fire.length; i += 5) {//数据按个数分组存储
            fireGroup.push(fire.slice(i, i + 5));
            safetyGroup.push(safety.slice(i, i+5));
            thunderGroup.push(thunder.slice(i, i+5));
            yAirsGroup.push(yAirs.slice(i, i+5));
        };

        clearInterval(barTime);
        $(".liNumber").empty();
        var pages = Math.ceil(yAirs.length / 5);
        console.log("fireGcccccccccccccroup",fireGroup,pages);
          echart.right_middle(document.getElementById('right-middle-echarts'),{
            yAirs:yAirsGroup[0],
            fire:fireGroup[0],
            safety:safetyGroup[0],
            thunder:thunderGroup[0]
          },params => {});
         
        if ( pages > 1) {
          let tempstr = '';
          yAirsGroup.forEach( (item,index) => {
            tempstr +=  `<li class="list list-${index}"></li>`
          })
          $(".liNumber").append(tempstr);
          $(".list-0").css("backgroundColor","#FF2121")
          var index = 1;

           barTime = setInterval(() => {
           if( index === pages ) { 
             index = 0
             $('.list-' + Number(pages-1) ).css("backgroundColor","rgba(255,255,255,0.4)")
             $('.list-' + index).css("backgroundColor","#FF2121")
             echart.right_middle(document.getElementById('right-middle-echarts'),{
               yAirs:yAirsGroup[index],
               fire:fireGroup[index],
               safety:safetyGroup[index],
               thunder:thunderGroup[index]
             },params => {});
             index ++;
            } else {
              console.log("查看类名",'.list-' + Number(index-1),index)
              $('.list-' + Number(index-1) ).css("backgroundColor","rgba(255,255,255,0.4)")
              $('.list-' + index).css("backgroundColor","#FF2121")
              echart.right_middle(document.getElementById('right-middle-echarts'),{
                yAirs:yAirsGroup[index],
                fire:fireGroup[index],
                safety:safetyGroup[index],
                thunder:thunderGroup[index]
              },params => {});
                index ++;
            }
          }, 5000);
          };
        }
      })
    },
    right_bottomecharts: function (map_change) {
      $.ajax({
        type: 'get',
        url: `${baseUrl}/alarmHandleRate`,
        data:map_change,
        success: function (res){
          let name = []
              val = [];
            res.forEach(elm => {
              name.push({text:elm.name,max:100})
              val.push(elm.value)
            })
          echart.right_bottom(document.getElementById('right-bottom-echarts'),{
            name:name,
            val:val
          },params => {})
        }
      })
     
    },
    map_bottomecharts: function (map_change){
      $.ajax({
        type: 'get',
        url: `${baseUrl}/inspectionRecord`,
        data:map_change,
        success: function (res){
          let daily = []
              xAxis = []
              device= []
              cultural_relic=[]
              fire = [];
            res.forEach(elm => {
              daily.push(elm.daily)
              xAxis.push(elm.name)
              device.push(elm.device)
              cultural_relic.push(elm.cultural_relic)
              fire.push(elm.fire)
            })
            clearInterval(tiem)
            console.log('duoxinaxianshi',daily,xAxis,device,cultural_relic,fire)
            echart.map_bottom(document.getElementById('map-bottom'),{
              daily:daily,
              xAxis:xAxis,
              device:device,
              cultural_relic:cultural_relic,
              fire:fire
            },params => {})
        }
      })
      
    },
    scrool_table:function(){
      let height_table = ((document.querySelector(' .table-contain .table_height').offsetHeight)/2);
      this.addKeyFrames( '-'+height_table +'px' ); // 设置keyframes
     
     $(' .table-contain .table_height').addClass('rowup') ; // 添加 rowup
     
      $('.rowup').css("animationDuration", (height_table/5) + 's');
    },
    scrool_system:function(){
      let height_li = ((document.querySelector('.contain-ul .right-top-detail').offsetHeight)/2);
      // console.log(height_li,"rowup")
      this.addKeyFrames( '-'+ height_li + 'px' ); // 设置keyframes
      $(".contain-ul .right-top-detail").addClass('rowup') // 添加 rowup
      $('.rowup').css("animationDuration", ( height_li/5) + 's');
    },

  }
})
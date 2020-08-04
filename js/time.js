function getDate()
{
  var d,s,t;
  d=new Date();
  s=d.getFullYear().toString(10)+"/";
  t=d.getMonth()+1;
  s+=(t>9?"":"0")+t+"/";
  t=d.getDate();
  s+=(t>9?"":"0")+t+'\xa0\xa0\xa0';
  s+=new Array (" 星期日", " 星期一", " 星期二", " 星期三", " 星期四", " 星期五", " 星期六")[d.getDay()];
  return s;
 }
function showDate()
 {	  
  document.all.now.innerHTML=getDate();
 }
function showDate()
{	  
  document.all.now.innerHTML=getDate();
}



showDate();
setInterval("showDate()",86400000);

function getTime () {
  var b, f, m;
  b=new Date();
  f=b.getHours();
  m=(f>9?"":"0")+f+":";
  f=b.getMinutes();
  m+=(f>9?"":"0")+f+":";
  f=b.getSeconds();
  m+=(f>9?"":"0")+f; 
  return m;
  
}

function showTime()
{	 
  var time = document.getElementById('time') 
  time.innerHTML= getTime();
}
setInterval("showTime()",1000);

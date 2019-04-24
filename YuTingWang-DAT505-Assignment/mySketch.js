var numberOfBalls = 200;
var size = 40; //  external size of balls
var bounce = 30; // size of non overlapping part 
var xcoord = 300; // where first set of balls arrive
var ycoord = 300; // where first set of balls arrive
var colour = 128; // first colour 
var ballArray = [];//文字块临时存储
var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";//颜色值基础定义
var colorArray = colorValue.split(",");//将颜色值基础数据转为数组

//开始执行创建画布入口
function setup() {
	//创建画布
	createCanvas(800, 800);
}

//鼠标释放执行事件入口
function mouseReleased() {
	noLoop();//停止绘画
}

//鼠标开始触发准备执行重新绘画
function mousePressed() {
	loop();//重新执行绘画
}

//p5 js 开始执行绘画
function draw() {
	//判断鼠标已经按下时执行添加文字块
	if (mouseIsPressed) {
		xcoord = mouseX;//获取X坐标
		ycoord = mouseY;//获取Y坐标
		ballArray.push(new ball());//累加文字块到临时数组
	}

	//循环文字块内容，动态显示到计算出的坐标位置
	for (var i = 0; i < ballArray.length; i++) {
		for (var j = 0; j < i; j++) {
			var distance = dist(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y);//根据每个文字块的坐标值计算得出两点之前的距离
			
			//当两点之间距离小于定义的基础尺寸时，重新给文字块计算坐标位置并赋值
			if (distance < bounce) {
				var dx = ballArray[i].x - ballArray[j].x;
				var dy = ballArray[i].y - ballArray[j].y;
				dx /= distance;
				dy /= distance;
				ballArray[j].x -= dx / 2;
				ballArray[j].y -= dy / 2;
				ballArray[i].x += dx / 2;
				ballArray[i].y += dy / 2;
			}
		}
	}

	//循环取出文字块内容并显示
	for (var i = 0; i < ballArray.length; i++) {
		ballArray[i].display();
	}
}


//创建文字块内容函数
function ball() {

	//计算随机坐标位置
	this.x = xcoord + random(1, 2);
	this.y = ycoord + random(1, 2);

	this.display = function () {
		//	var colorShift = 100*mag(this.fsumx, this.fsumy);
		textSize(20);//设置文字大小
		var color = getColor();//获取随机颜色值
		fill(color);//填充文字颜色
		text('opinion', this.x, this.y);//创建文字内容到画图上
		//ellipse(this.x, this.y, size, size);
	};
}

//生成随机颜色值
function getColor() {
	//定义字符串变量colorValue存放可以构成十六进制颜色值的值
	var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
	//以","为分隔符，将colorValue字符串分割为字符数组["0","1",...,"f"]
	var colorArray = colorValue.split(",");
	var color = "#"; //定义一个存放十六进制颜色值的字符串变量，先将#存放进去
	//使用for循环语句生成剩余的六位十六进制值
	for (var i = 0; i < 6; i++) {
		//colorArray[Math.floor(Math.random()*16)]随机取出
		// 由16个元素组成的colorArray的某一个值，然后将其加在color中，
		//字符串相加后，得出的仍是字符串
		color += colorArray[Math.floor(Math.random() * 16)];
	}
	return color;
}
# 十字消方块（Cross Elimination Squares）

同济大学 软件学院 1850952 梁荣嘉

[toc]

## 1 简介

这是2020年，大二下学期“web系统与技术”课程期末作业，一款纯前端游戏。

该游戏灵感源于3366小游戏中的彩色方块游戏，实现其基础功能，包括按规则消除方块、统计剩余方块数目等，另外增加了撤销操作、编辑游戏设定的功能，可以自定义棋盘和彩色方块数目。

### 1.1 开发技术和环境

 * 代码编辑：HbuilderX
 * 技术框架：Vue

### 1.2 运行方法

使用浏览器打开项目中的”index.html“文件即可运行项目，无需服务器。

项目仅保证在Microsoft Edge浏览器下正确运行，理论上在Chromium内核浏览器上也都能正确运行。

## 2 游戏介绍

### 2.1 游戏目标

将棋盘上的彩色方块全部消除。

消除彩色方块的方法为：找到一个非彩色方块，其上下左右四个方向（十字线）离它最近的彩色方块若有相同颜色的，相同颜色的方块将被消除。

### 2.2 功能点

#### 2.2.1 游戏基础功能

游戏基础功能包括如下内容：

1. 点击非彩色方块，向上下左右四个方向搜索方块，相同颜色的消除。

#### 2.2.1 实时显示当前状态

当前状态包括如下内容：

1. 消除次数
   含义是累计点击次数中，产生了消除现象的次数
2. 消除方块数
   含义是累计消除的方块数。每次点击会消耗2到4个方块。
3. 剩余方块数
   含义是当前棋盘上剩余的彩色方块数
4. 各个颜色方块的剩余数量

#### 2.2.2 撤销

游戏在每次消除之后都会立即保存游戏状态，加入历史记录。当点击撤销按钮时，游戏状态会还原到本次消除前的状态。

#### 2.2.3 重玩本局

点击”重玩本局“，游戏会抽取第一条历史记录，还原到当前状态中，并清空历史记录，即本局重新开始。

#### 2.2.4 新开一局

点击”新开一局“，游戏将重新随机生成彩色方块，重新开局。

#### 2.2.5 编辑设定

点击”编辑设定“按钮，玩家可以在设定一些游戏参数：宽边方块数量、高边方块数量、生产彩色方块的数量。注意，生产彩色方块的数量必须小于等于棋盘总方块数的1/3，否则会产生alert()警告，不能开局，重新设置参数即可解决。

#### 2.2.6 欢迎页面

初次打开游戏，会显示欢迎页面，点击开始游戏按钮，即可开局。

#### 2.2.7 胜利页面

当某次消除达成消除全部方块的目的时，游戏将显示胜利页面，点击再来一局按钮，即可开始新一局。

## 3 实现

### 3.1 HTML部分

鉴于该项目是小型项目，故”index.html“构建了整个项目的页面结构，未使用Vue的组件化技术，主要利用的是Vue的列表渲染、条件渲染、数据双向绑定等特性。

以下项目列表简要示意了HTML的标签结构：

* 应用（app）
  * 容器（container）
    * 棋盘卡片（board-card）
      * 棋盘（board）
        * 行（row）
          * 方块（square）
    * 右边栏（right-aside）
      * 游戏控制区卡片（control-card）
      * 游戏设定区卡片（settings-card）
      * 状态显示区卡片（status-card）
  * 欢迎界面（条件渲染）（greet）
  * 胜利界面（条件渲染）（win）

js中建立的Vue实例作用在”#app“上，接管游戏中所有的渲染。

### 3.2 CSS部分

将CSS分布在三个文件中：”app.css“，”board-card.css“，”right-aside.css“。

以下抽取一些部分介绍。

#### 3.2.1 使用弹性盒子布局

##### 3.2.1.1 实现屏幕居中

在欢迎界面和胜利界面中，需要两个div元素作为组合居中在屏幕中央。这样的居中使用传统方式比较困难，如使用另一个div将两者包裹起来，容易达到水平居中，但难以达到垂直居中，而且复杂化HTML结构；使用 `display:inline-block;` 布局也难以达到垂直居中。

最终选用的是弹性盒子（ `display: flex;` ）布局。

1. 设置父元素为弹性盒 `display:flex;` ；
2. 设置主轴方向为垂直向 `flex-direction: colume;` ；
3. 设置侧轴上居中，即实现水平居中 `align-items: center; ` ；
4. 设置主轴上居中，即实现垂直居中 `justify-content: center;` 。

如此实现了两个div居中在屏幕中央。

##### 3.2.1.2 实现两元素分列两端

在卡片游戏设定卡片（settings-card）和状态显示卡片（status-card）中，列表每一项要实现项目名靠左端，项目值靠右端。这种效果传统方法难以实现，故使用弹性盒子布局。

1. 设置父元素为弹性盒 `display:flex;` ；
2. 设置主轴分布方式 `justify-content: space-between` 。

实现了完美的分列两端效果。

#### 3.2.2 使用inline-block布局

##### 3.2.2.1 实现水平居中

游戏页面由棋盘卡片（board-card）和右边栏（right-aside）组成，将两项水平居中有一定难度。使用弹性盒子布局的话在浏览器缩小时会出现奇奇怪怪的压缩问题，不优雅。

故在用container将两个元素包裹起来，使用inline-block水平居中。

##### 3.2.2.2 实现响应式布局

棋盘卡片（board-card）和右边栏（right-aside）在标准状态下是左右并列。现需要当浏览器宽度变窄时（仍宽于棋盘卡片），右边栏转移到棋盘卡片下方，不出现水平滚动条。此需求使用inline-block布局解决，但要注意垂直方向的对齐： `vertical-align: top;` 。

这样，当浏览器变窄时，右边栏会转移到棋盘卡片的下方，并且都能够做到完美的水平居中。

#### 3.2.3 使用box-shadow属性

##### 3.2.3.1 实现立体感

使用内阴影实现方块的立体感。方块的左边缘和上边缘有白色半透明内阴影，作为高光，右边缘和下边缘有黑色半透明内阴影，作为阴影，从而实现了方块的立体感。

```css
box-shadow: inset -2px -2px 0px 0px rgba(0,0,0,0.1), inset 2px 2px 0px 0px rgba(255,255,255,0.5);
```

使用外阴影实现卡片的立体感。淡淡的外阴影使得卡片有悬浮感，显得更高级。
```css
box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
```
##### 3.2.3.2 实现边框

游戏控制区卡片（control-card）里的按钮需要边框，但是传统边框（border）时占用宽度的，用起来需要将按钮长宽减去边框宽度才能按设计正确显示，不优雅。

这里使用了无扩散的内阴影作为边框，十分优雅。

```css
box-shadow: inset 0px 0px 0px 1px rgba(0,0,0,0.3);
```

#### 3.2.4 使用transition属性实现过渡动画

方块消除时，如果没有过度，消失得太快，会让人反应不过来。故加入了消失的过渡动画。

```css
transition-property: all;
transition-duration: 200ms;
transition-timing-function: ease;
```

### 3.3 javascript部分

javascript代码放在app.js中。代码创建了一个Vue实例，并在其中绑定了元素、定义了数据、定义了方法，然后在全局执行其中的代一个方法，创建新游戏，作为欢迎界面的背景。

```javascript
var vm = new Vue{
    el: "#app",
    data: {...},
    methods: {...}
}
vm.newGame();
```

#### 3.3.1 data对象的结构

```javascript
data:{
    isGreet: true,		//标记
    settings: {...},	//关于游戏参数设置的数据
    status: {...},		//关于游戏状态的数据，用于实时显示和历史记录
    history :[...]		//历史记录数组
}
```

#### 3.3.2 methods方法

以下为清晰展示代码功能，精简了细节的内容。

```javascript
methods:{
		startGame(){					//开始游戏
			this.isGreet = false;			//隐藏欢迎界面
			this.newGame();					//启动新游戏
		},
		newGame(){						//新游戏
			this.initStatus();				//初始化状态数据
			this.produceSquare();			//生产有色方块
			this.history = [];				//初始化历史记录
			this.saveHistory();				//存档
		},
		initStatus(){					//初始化状态
			this.initBoard();				//初始化棋盘
			...								//初始化其他
		},
		initBoard(){					//初始化棋盘
			...								//创建所有格子，装入二维数组
		},
		produceSquare(){				//生产彩色方块
			...								//随机选择位置和颜色，生产足够多的彩色方块
		},
		clickSquare(row, col){			//点击方块
			...								//符合条件的进入消除
		},
		eliminate(baseRow, baseCol){	//消除
			...								//向四个方向搜寻方块		
            ...								//有相同颜色的消除
		},
		saveHistory(){					//存档
			...								//深拷贝status，放入历史数组
		},
		revoke(){						//撤销
			...								//如果有历史记录就回退
		},
		replay(){						//重玩本局
			...								//如果有历史记录，则回退到第一个记录
		},
		editSettings(){					//编辑游戏设定
			if(...){						//如果是编辑状态...
				...							//改变为非编辑状态
				this.newGame();				//新开一局游戏
			}
			else{							//如果是非编辑状态...
				this.initStatus();			//删除该局游戏，初始化状态
				...							//改变为编辑状态
			}
		},
		win(){							//胜利
			...								//标记胜利
		},
		playAgain(){					//再来一局
			if(...){						//如果是胜利状态...
				...							//改变为非胜利状态
				this.newGame();				//新开一局游戏
			}
			else{							//如果非胜利状态...
				...							//改变为编辑状态
			}
		}
	}
```

### 3.3 Vue特性部分

#### 3.3.1 v-for列表渲染

使用两层v-for列表渲染渲染了整个棋盘。先渲染二维数组的第一维，每一项中渲染二维数组的第二维。为了更清晰展示代码功能，以下代码精简了部分细节。

```html
<div id="board">
    <div v-for="(row, i_row) in status.board" >
        <div v-for="(thisSquare, i_col) in row" >
        </div>
    </div>
</div>
```

使用v-for列表渲染渲染了右下角每种颜色方块的剩余数量。为了更清晰展示代码功能，以下代码精简了部分细节。

```html
<div v-for="(item,index) in settings.color.colorValue">
    <div :style="{backgroundColor: settings.color.colorValue[index]}"></div>
    <div>{{status.leftSquare.eachColorCount[index]}}</div>
</div>
```

#### 3.3.2 v-if条件渲染

使用v-if条件渲染渲染了欢迎界面和胜利界面。以下代码经过精简。

```html
<div id="greet" v-if="isGreet">
    <div>十 字 消 方 块</div>
    <div>开始游戏</div>
</div>
<div id="win" v-if="status.isWin">
    <div>你 成 功 了 !</div>
    <div>再来一局</div>
</div>
```

使用v-if, v-else条件渲染渲染游戏设定卡片的数值显示和输入框。当处于非编辑模式时，显示数值，不显示输入框；当处于编辑模式时，显示输入框，不显示数值。以下代码经过精简。

```html
<div>
    <div>宽边方块数量</div>
    <div v-if="!settings.isEditting">{{settings.boardWidthN}}</div>
    <input v-else >
</div>
```

#### 3.3.3 v-on事件处理

按钮使用v-on监听DOM事件。以下代码做举例，代码经过精简。

```html
<div v-on:click="startGame">开始游戏</div>
```

#### 3.3.3 v-model表单输入绑定

使用v-model绑定用户输入，同步到游戏设定中。

```html
<input v-else type="number" v-model="settings.boardWidthN">
```
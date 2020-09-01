var vm = new Vue({
	el: "#app",
	data: {
		isGreet: true,
		settings:{								//设置信息，初始化用
			isEditting: false,					//是否在编辑设置
			boardWidthN: 30,					//棋盘宽多少个方块
			boardHeightN: 20,					//棋盘高多少个方块
			produceSquareNum: 300,				//生产多少个方块
			color: {							//颜色信息
				count: 5,														//颜色数量
				colorValue:["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff"]	//颜色值
			},
		},
		status:{								//状态信息，历史记录用
			eliminateTimes: 0,					//消除次数
			eliminateCount: 0,					//消除方块数
			board:[],							//所有方块存储在此数组
			leftSquare:{						//剩余方块信息
				count: 0,						//剩余数目
				eachColorCount: []				//分颜色计数
			},
			isWin: false,
		},
		history: []
	},
	methods:{
		startGame(){					//开始游戏
			this.isGreet = false;		//隐藏欢迎界面
			this.newGame();				//启动新游戏
		},
		newGame(){						//新游戏
			this.initStatus();			//初始化状态数据
			this.produceSquare();		//生产有色方块
			this.history = [];			//初始化历史记录
			this.saveHistory();			//存档
		},
		initStatus(){
			this.initBoard();					//初始化棋盘
			this.status.eliminateTimes = 0;		//初始化消除次数
			this.status.eliminateCount = 0;		//初始化消除方块数
			this.status.leftSquare.count = 0;	//初始化剩下方块数
			this.status.leftSquare.eachColorCount = new Array(this.settings.color.count);	//初始化分颜色计数
			for(var i = 0; i < this.status.leftSquare.eachColorCount.length; i++){
				this.status.leftSquare.eachColorCount[i] = 0;
			}
		},
		initBoard(){													//初始化棋盘
			this.status.board = [];										//确保清空棋盘
			for(var i = 0; i < this.settings.boardHeightN; i++){		//对每行...
				this.status.board.push(Array(0));						//嵌套一个行数组
				for(var j = 0; j < this.settings.boardWidthN; j++){		//对每列...
					var newSquare={										//设置方块属性
						isEmpty: true,
						color : -1,
						style:{
							backgroundColor: ""
						}
					};
					this.status.board[i].push(newSquare);				//把方块加入该行
				}
			}
		},
		produceSquare(){																//生产有色方块
			var boardSum = this.settings.boardWidthN * this.settings.boardHeightN;		//计算棋盘总格数
			var rate = this.settings.produceSquareNum * 1.0 / boardSum;					//计算有色块的占比
			if(rate > 2.0 / 3.0){
				alert("生产的有色方块数量超过总格数的2/3，不可生成，请重新调整设定。");
				return;
			}
			for(var i = 0; i < this.settings.produceSquareNum; i++){					//生产目标个数有色方块...
				var produceFailed = true;												//标记生产第n个是否成功
				while(produceFailed){													//若未成功，继续寻找别的地方
					var row = Math.floor(Math.random() * this.settings.boardHeightN);	//随机行
					var col = Math.floor(Math.random() * this.settings.boardWidthN);	//随机列
					var color = Math.floor(Math.random() * this.settings.color.count);	//随机颜色
					
					if(this.status.board[row][col].isEmpty == true){					//如果随机位置为空...
						this.status.board[row][col].isEmpty = false;					//标记该处不为空
						this.status.board[row][col].color = color;						//装载颜色
						this.status.leftSquare.eachColorCount[color]++;					//计数该颜色的现有数量
						produceFailed = false;											//标记生产成功
					}
				}
			}
			this.status.leftSquare.count = this.settings.produceSquareNum;				//剩余方块等于目标数量
		},
		clickSquare(row, col){										//点击方块
			if(this.status.board[row][col].isEmpty){				//如果位置是空的才...
				this.eliminate(row, col);							//进入消除
			}
		},
		eliminate(baseRow, baseCol){		//消除
			var canEliminate = false;		//标记该次点击是否能消除
			var fourSquare = [				//存四个方向上的方块
				{							//上
					row: baseRow,
					col: baseCol,
					color: -1				//默认无颜色，并且用此判断该方向是否有块
				},
				{							//右
					row: baseRow,
					col: baseCol,
					color: -1
				},
				{							//下
					row: baseRow,
					col: baseCol,
					color: -1
				},
				{							//左
					row: baseRow,
					col: baseCol,
					color: -1
				}
			];
																									//获取四个方向上的方块
			for(var currentRow = baseRow; currentRow >= 0; currentRow--){							//记录上方向的方块
				if(!this.status.board[currentRow][baseCol].isEmpty){
					fourSquare[0].row = currentRow;													//获取行
					fourSquare[0].color = this.status.board[currentRow][baseCol].color;				//获取颜色
					break;
				}
			}
			for(var currentCol = baseCol; currentCol < this.settings.boardWidthN; currentCol++){	//记录右方向的方块
				if(!this.status.board[baseRow][currentCol].isEmpty){
					fourSquare[1].col = currentCol;													//获取列
					fourSquare[1].color = this.status.board[baseRow][currentCol].color;				//获取颜色
					break;
				}
			}
			for(var currentRow = baseRow; currentRow < this.settings.boardHeightN; currentRow++){	//记录下方向的方块
				if(!this.status.board[currentRow][baseCol].isEmpty){
					fourSquare[2].row = currentRow;													//获取行
					fourSquare[2].color = this.status.board[currentRow][baseCol].color;				//获取颜色
					break;
				}
			}
			for(var currentCol = baseCol; currentCol >= 0; currentCol--){							//记录左方向的方块
				if(!this.status.board[baseRow][currentCol].isEmpty){
					fourSquare[3].col = currentCol;													//获取列
					fourSquare[3].color = this.status.board[baseRow][currentCol].color;				//获取颜色
					break;
				}
			}
																						//比较四个有没有相同的颜色以消除
			for(var i = 0; i < 4; i++){													//选择第一个方块...
				if(fourSquare[i].color != -1){											//没有颜色就不考虑
					for(var j = 0; j < 4; j++){											//选择第二个方块...
						if(i != j && fourSquare[i].color == fourSquare[j].color){		//排除自己，若有同颜色的...
							var iSquareNum = fourSquare[i].row * this.settings.boardWidthN + fourSquare[i].col;
							canEliminate = true;										//标记该次点击能够消除
							this.status.board[fourSquare[i].row][fourSquare[i].col].isEmpty = true;				//该方块置空
							this.status.board[fourSquare[i].row][fourSquare[i].col].color = -1;					//还原颜色，在内联样式中，数组越界但不报错
							this.status.leftSquare.eachColorCount[fourSquare[i].color]--;	//计该颜色的剩余数量
							this.status.eliminateCount++;									//计消除方块数
							this.status.leftSquare.count--;									//计消除方块数
							if(this.status.leftSquare.count == 0){
								this.win();
								return;
							}
							break;														//避免多个相同时重复计数
						}
					}
				}
			}
			
			if(canEliminate){					//如果能够消除...
				this.status.eliminateTimes++;	//记一次消除
				this.saveHistory();				//存档
			}
		},
		saveHistory(){														//存档
			this.history.push(JSON.parse(JSON.stringify(this.status)));		//深拷贝status，放入历史数组
		},
		revoke(){
			if(this.history.length <= 1){
				alert("无历史记录，无法撤销。");
			}
			else{
				this.history.pop();
				this.status = JSON.parse(JSON.stringify(this.history[this.history.length-1]));
			}
		},
		replay(){															//重玩本局
			if(this.history.length <= 1){									//若无历史记录...
				alert("您还未进行操作，现在就是本局的最初状态。");				//提示
			}
			else{															//否则
				this.status = JSON.parse(JSON.stringify(this.history[0]));	//恢复到第一个历史记录
				this.history = [];											//清空历史记录
				this.saveHistory();											//存当前档
			}
		},
		editSettings(){									//编辑设定
			if(this.settings.isEditting){				//如果是编辑状态...
				this.settings.isEditting = false;		//改变为非编辑状态
				this.newGame();							//新开一局游戏
			}
			else{										//如果是非编辑状态...
				this.initStatus();						//删除该局游戏，初始化状态
				this.settings.isEditting = true;		//改变为编辑状态
			}
		},
		win(){
			this.status.isWin = true;
		},
		playAgain(){									//再来一局
			if(this.status.isWin){						//如果是胜利状态...
				this.status.isWin = false;				//改变为非胜利状态
				this.newGame();							//新开一局游戏
			}
			else{										//如果非胜利状态...
				this.settings.isWin = true;		//改变为胜利状态
			}
		}
	}
});

vm.newGame();
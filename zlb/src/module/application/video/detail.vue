<template>
	<div class="container" ref="container" v-cloak>
		<div>
			<div class="summary" v-html="video.content"></div>
			<ul class="list" v-if="!smallView">
				<li class="list_item" v-for="(pic,index) in pices">
					<div class="list_main">
						<div class="assign_homework preview" @click="clientSwiper(pices,index)">
							<img :src="ios?imagedomain+pic.imgUrl+'?imageView2/0/w/375/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?imageView2/0/w/750/format/jpeg'" v-if="pic.type==1"/>
							<img :src="ios?imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/375/q/1/':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/750/'" v-if="pic.type==3"/>
							<div class="plusPlay" v-if="pic.type==3"></div>
						</div>
						<div class="handle_area" flex="cross:center main:justify">
							<div class="handle_left" flex-box="0" flex="cross:center">
								<span flex-box="0" class="doFavorite" :class="{'didFavorite':pic.praiseState==1,}" @click="praiseFuc(index,pic.tid)"></span>
								<span flex-box="0" class="share" @click="share(index,pic)"></span>
								<span flex-box="0" class="talk" @click="setComment(index,pic.tid,pic.vedioId)"></span>
							</div>
							<div class="handle_right" flex="cross:center main:right" flex-box="1">
								<span flex-box="0" flex="cross:center main:center" class="doClaim" v-text="pic.claimState==1?noClaim:claim" :class="{'didClaim':pic.claimState==1}" @click="claimFuc(index,pic.tid)"></span>
							</div>
						</div>
						<div class="handle_num" flex="cross:center">
							<span flex-box="0" v-text="pic.claimCount"></span>
							<p>个认领;</p>
							<span flex-box="0" v-text="pic.praiseCount"></span>
							<p>个点赞;</p>
						</div>
					</div>
					<comment :commentObj="pic" :index="index" :type="'APP_VEDIO'" @toParentComponents="getInfo" ref="commentMethod"></comment>
				</li>
			</ul>
			<ul class="smallList" v-if="smallView">
				<li class="smallList_item" v-for="(pic,index) in pices" :style="index%2!=0?borderLeft:''">
					<div class="smallList_main">
						<div class="assign_homework preview" @click="clientSwiper(pices,index)">
							<img :src="ios?imagedomain+pic.imgUrl+'?imageView2/0/w/375/q/1/format/jpeg':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?imageView2/0/w/750/format/jpeg'" v-if="pic.type==1"/>
							<img :src="ios?imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/375/q/1/':loadUrl"  :data-echo="imagedomain+pic.imgUrl+'?vframe/jpeg/offset/1/w/750/'" v-if="pic.type==3"/>
							<div class="plusPlay" v-if="pic.type==3"></div>
						</div>
						<div class="handle_area" flex="cross:center main:justify">
							<div class="handle_left" flex-box="0" flex="cross:center">
								<img src="./images/smallComment.png"/>
								<span flex-box="0" class="doFavorite" v-text="pic.commentList.length"></span>条评论
							</div>
							<div class="handle_right" flex="cross:center main:right" flex-box="1">
								<span flex-box="0" flex="cross:center main:center" class="doClaim" v-text="pic.claimState==1?noClaim:claim" :class="{'didClaim':pic.claimState==1}" @click="claimFuc(index,pic.tid)"></span>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<mu-toast  v-if="toast" :message="msg" @close="hideToast" />
	</div>
</template>
<script type="text/babel">
    import {imagedomain} from '../../../api/api.js'
	import comment from '../../../components/comment/commentList.vue'
    import api from '../../../api/api.js'
	import BScroll from 'better-scroll'
    const API =new api();
    export default{
        data () {
            return {
                shareClassName:'',
                pices:[],
                page:1,
                classId:this.$route.query.classId,
                tid:this.$route.query.tid,
                imagedomain:imagedomain,
                msg:'',
                video:'',
                toast:false,
				scroll:'',
				ios:util.browser.versions.ios,
				loadUrl:require('../../../assets/imgLoad.png'),
				claim:'认领',
				noClaim:'已认领',
				smallView:false,
				borderLeft: {borderLeft: '0.03rem solid #EFF3F6'}
            }
        },
        mounted () {
			util.jsBridgeCallBack('jsRightAction',this.changeView);
			this.scroll = new BScroll(this.$refs.container, {
				probeType: 3,
				bounce:true,
				preventDefault:false
			})
			echo.init({
				offset: 0,
				throttle: 0,
				unload: false,
			});
			this.scroll.on('scroll', () => {
				echo.render();
			})
			this.$nextTick(function () {
				this.refresh();
			});
        },
		components:{
			comment
		},
        methods: {
            handleClose: function () {
                this.blackShow = false;
            },
            closeDialog(){
                this.dialog=false;
            },
            openDialog(workId,index){
                this.workId=workId;
                this.index=index;
                this.dialog=true;
            },
            claimFuc(index,tid){
            	let param={
            			classId:this.classId,
            			picId:tid
            		};
	            	API.setVideoclaim(param).then(res=>{
		                    let {code,rs}=res;
		                    if(code==200){
		                    	if(this.pices[index].claimState==0){
            						this.pices[index].claimState=1;
		            				this.pices[index].claimCount++;
			                        this.msg = '照片已认领,请到我的档案查看';
		                        	this.showToast();
	            				}
		                    }else{
		                        this.msg = res.msg;
		                        this.showToast();
		                }
	                });
            	
            },
            praiseFuc(index,tid){
            	let param={
            			classId:this.classId,
            			picId:tid,
            			state:this.pices[index].praiseState
            		};
            		API.setVideopraise(param).then(res=>{
	                    let {code,rs}=res;
	                    if(code==200){

	                    }else{
	                        this.msg = res.msg;
	                        this.showToast();
	                    }
                    });
            	if(this.pices[index].praiseState==1){
                    this.pices[index].praiseState=0;
            		this.pices[index].praiseCount--
            	}else{
            		this.pices[index].praiseState=1;
            		this.pices[index].praiseCount++
            	}
            },
            /*
             * @description: 客户端头部初始化
             *
             * @update: cxy (2017-03-07)
             */
            propsTitle(){
                //TODO:客户端读取标题信息
                util.JsBridge('propsTitle',{
					title:util.toUniCode('学员风采'),
                    color: '#67a5ff',
					titleRight:'视图切换',
                },(res)=>{})
            },
            /*
             * @description: 客户端浏览文件
             *
             * @update: cxy (2017-03-09)
             */
            clientSwiper(pices,index){
				let arr = Array.prototype.toString.call(pices) === '[object String]' ? JSON.parse(JSON.stringify(JSON.parse(pices))) : JSON.parse(JSON.stringify(pices))
                arr.forEach(function(e){
                    e.imgUrl=imagedomain+e.imgUrl;
					if(e.type==3){
						e.coverUrl=imagedomain+ e.imgUrl+'?vframe/jpeg/offset/1';
					}
                })
                //TODO:客户端浏览文件
                util.JsBridge('picesSwiper',{
                    picesList: arr,
                    picesIndex:index
                },(res)=>{})
            },
            /*
             * @description: 下拉刷新
             *
             * @update: lwq (2017-03-06)
             */
            refresh () {
                let param={
                    page:1,
                    classId:this.classId,
                    tid:this.tid
                };
                API.getVideoDetail(param).then(res=>{
                    let {code,rs}=res;
                    if(code==200){
                        if(rs.className){
                            this.shareClassName=rs.className;
                        };
						if (rs.pager.pageList) {
							rs.pager.pageList.forEach((el) => {
								el.isSlide = false;
							})
							this.pices = rs.pager.pageList
						} else {
							rs.pager.pageList = [];
						}
                        if(rs.vedio){
                        	this.video=rs.vedio;
                        }
                        this.pices=rs.pager.pageList;
						this.shareUrl=rs.shareUrl;
                    }else{
                        this.msg = res.msg;
                        this.showToast();
                    }
					this.$nextTick(function(){
						this.scroll.refresh();
						echo.render()
						this.propsTitle();
					})
                });
            },
            /*
             * @description: 显示保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            showToast () {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 2000)
            },
            /*
             * @description: 隐藏保存结果信息
             *
             * @update: cxy (2017-03-07)
             */
            hideToast () {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            /*
             * @description: 跳转客户端分享
             *
             * @update: cxy (2017-03-16)
             */
			share(index,object){
				//TODO:分享页面跳转
				let obj={};
				obj.tid=object.tid+'_'+this.classId;
				obj.type=object.type;
				obj.title='宝贝精彩瞬间，想与你分享';
				obj.content='指学针'
				if(object.type!=3){
					obj.imgUrl=imagedomain+this.pices[index].imgUrl;
					obj.shareUrl=this.shareUrl;
				}else{
					obj.shareUrl=this.shareUrl+'&imgUrl='+this.pices[index].imgUrl+'&isVideo=1&tid='+obj.tid;
				}
				util.JsBridge('share',obj,(result)=>{})
			},
			setComment(index,secId,appId){
				util.JsBridge('setComment',{
					limit:100,
					placeHolder:'请输入100字以内评论',
					noJSONParse:true
				},(result)=>{
					let data = {};
					if (result.indexOf('type') == -1) {
						data.type = 1;
						data.content = util.utf16toEntities(result)
					} else {
						result = JSON.parse(result);
						data.type=result.type;
						if(data.type==2){
							data.time=result.time;
						}
						data.content = util.utf16toEntities(result.content);
					}
					const param = {
						classId:this.classId,
						type:data.type,
						appId: appId,
						secId:secId,
						content:data.content,
						appCode:'APP_VEDIO'
					}
					if(result.type==2){
						param.time=result.time;
					}
					API.setComment(param).then((res)=>{
						let {code,rs}=res;
						if(code==200){
							try{
								this.$refs.commentMethod[index].sonSetComment(rs);
								this.$nextTick(function(){
									this.refreshScroll();
								})
							}catch(e){
								alert(JSON.stringify(e.message))
							}
						}else{
							this.msg = res.msg;
							this.showToast();
						}
					})
				})
			},
			/*
			 * @description: 刷新滚动区域
			 *
			 * @update: cxy (2017-04-17)
			 */
			refreshScroll(){
				this.$nextTick(function(){
					this.scroll.refresh();
				})
			},
			/*
			 * @description: 获取子组件传递信息
			 *
			 * @update: cxy (2017-04-17)
			 */
			getInfo(res){
				if(res=='refresh'){
					this.refreshScroll()
				}
			},
			changeView(){
				if(!this.smallView){
					this.smallView=true;
					this.refreshScroll()
					this.scroll.scrollTo(0, 0)
					this.$nextTick(function(){
						echo.render();
					})
				}else{
					this.smallView=false;
					this.refreshScroll();
					this.scroll.scrollTo(0, 0)
					this.$nextTick(function(){
						echo.render();
					})
				}
			}
        }
    }
</script>
<style scoped>
	.play {
		height: 0.34rem;
		width: 0.34rem;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
		background: url('./images/play.png') no-repeat center center;
		background-size: contain;
		z-index: 1;
	}
	
	.plusPlay {
		height: 0.6rem;
		width: 0.6rem;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
		background: url('./images/detailPlay.png') no-repeat center center;
		background-size: contain;
		z-index: 1;
	}
	.container {
		position: absolute;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	
	.container .summary {
		font-size: 0.15rem;
		color: #fff;
		line-height: 0.22rem;
		padding: 0.12rem 0.16rem;
		background: #67a5ff;
	}

	.container .list {
		padding: 0!important;
	}
	
	.container .list .list_item {
		border-top: 0.12rem solid #EFF3F6;
	}
	
	.container .list .list_item .list_main {}
	/*布置作业附件*/
	
	.container .list .list_item .list_main .assign_homework {
		height: 3.75rem;
		width:3.75rem;
		overflow: hidden;
		position: relative;
	}
	
	.container .list .list_item .list_main .assign_homework img {
		display: block;
		height: 100%;
		width: 100%;
		object-fit: cover;
		-o-object-fit: cover;
	}
	
	.container .list .list_item .list_main .assign_homework .num {
		background: rgba(0, 0, 0, 0.40);
		border: 1px solid #979797;
		border-radius: 0.72rem;
		width: 0.39rem;
		height: 0.27rem;
		color: #fff;
		font-size: 0.14rem;
		position: absolute;
		z-index: 1;
		bottom: 0.06rem;
		right: 0.16rem;
	}
	/*操作区域*/
	
	.container .list .list_item .list_main .handle_area {
		height: 0.5rem;
		padding-right: 0.12rem;
	}
	
	.container .list .list_item .list_main .handle_area .handle_left {
		height: 100%;
	}
	
	.container .list .list_item .list_main .handle_area .handle_right {
		height: 100%;
	}
	
	.container .list .list_item .list_main .handle_area .doFavorite {
		height: 100%;
		width: 0.41rem;
		background: url("./images/xin.png") no-repeat center center;
		background-size: 0.19rem 0.18rem;
	}
	.container .list .list_item .list_main .handle_area .didFavorite{
		background: url("./images/praiseBlue.png") no-repeat center center;
		background-size: 0.19rem 0.18rem;
	}
	.container .list .list_item .list_main .handle_area .doClaim {
		background:#67a5ff;
		border-radius:1rem;
		width:0.62rem;
		height:0.3rem;
		font-size:0.14rem;
		color:#ffffff;
	}
	.container .list .list_item .list_main .handle_area .didClaim {
		background:#a1a6b1;
		border-radius:1rem;
		width:0.62rem;
		height:0.3rem;
		font-size:0.14rem;
		color:#ffffff;
	}
	.container .list .list_item .list_main .handle_area .share {
		height: 100%;
		width: 0.42rem;
		background: url("./images/fenxiang.png") no-repeat center center;
		background-size: 0.18rem 0.18rem;
	}
	
	.container .list .list_item .list_main .handle_area .talk {
		height: 100%;
		width: 0.43rem;
		background: url("./images/notice.png") no-repeat center center;
		background-size: 0.19rem 0.18rem;
	}
	
	.container .list .list_item .list_main .handle_num {
		font-size: 0.14rem;
		color: #42454c;
		padding: 0 0.12rem;
		padding-bottom: 0.1rem;
	}
	.container .list .list_item .list_main .handle_num p{
		margin-right:0.08rem;
	}
	/*下拉区域*/
	
	.slide_area {
		padding: 0 0.12rem;
	}
	
	.slide_area .reply_item {
		position: relative;
		padding: 0.02rem 0;
	}
	.slide_area .reply_item:active{
		background:#f7f8fa;
	}
	.slide_area .reply_wrapper {
		height: 100%;
		font-size: 0;
		text-align: justify;
		position: relative;
	}

	.slide_area .reply_wrapper span {
		margin-right: 0.05rem;
		color: #67a5ff;
		font-size: 0.14rem;
	}
	
	.slide_area .reply_wrapper .reply_content {
		margin-right: 0;
		color: #6C7381;
	}
	
	.slide_area .reply_wrapper .reply_span {
		color: #6C7381;
		font-size: 0.14rem;
	}
	
	.slide_area .reply_slide {
		padding: 0.08rem 0;
	}
	
	.slide_area .reply_slide .span {
		font-size: 0.14rem;
		color: #a1a6b1;
		margin-right: 0.06rem;
	}
	
	.slide_area .reply_slide .slideIcon {
		height: 0.06rem;
		width: 0.08rem;
		background: url("./images/slideSmall.png") no-repeat center center;
		background-size: 100% 100%;
	}
	
	.slideIconTop {
		height: 0.06rem;
		width: 0.08rem;
		background: url("./images/slideSmall.png") no-repeat center center;
		background-size: 100% 100%;
		-webkit-transform: rotate(180deg) !important;
		-moz-transform: rotate(180deg) !important;
		-ms-transform: rotate(180deg) !important;
		-o-transform: rotate(180deg) !important;
	}
	
	
	.mu-circular-progress {
		margin: 0.1rem 0;
	}

	
	.delWrapper {
		height: 0.44rem;
		width: 0.97rem;
		position: absolute;
		top: -0.44rem;
		right: 0;
		z-index: 1;
	}
	
	.delWrapper .delInner {
		height: 0.34rem;
		width: 100%;
		background: #2b292a;
		border-radius: 0.06rem;
	}
	
	.delWrapper .delInner .copyBtn {
		height: 100%;
		color: #fff;
		font-size: 0.15rem;
	}
	
	.delWrapper .delInner .white_line {
		background: rgba(255, 255, 255, 0.30);
		width:  0.01rem;
		height: 0.24rem;
	}
	
	.delWrapper .triangle {
		margin: 0 auto;
		width: 0;
		height: 0;
		border-top: 0.1rem solid #2b292a;
		border-left: 0.08rem solid transparent;
		border-right: 0.08rem solid transparent;
	}
	.container .smallList {
		padding: 0!important;
		border-top: 0.12rem solid #EFF3F6;
		overflow: hidden;
	}

	.container .smallList .smallList_item {
		width:1.86rem;
		height:2.21rem;
		float: left;
		box-sizing: initial;
		border-bottom:0.03rem solid #EFF3F6;
	}

	/*布置作业附件*/

	.container .smallList .smallList_item .smallList_main .assign_homework {
		height: 1.86rem;
		width:1.86rem;
		overflow: hidden;
		position: relative;
	}

	.container .smallList .smallList_item .smallList_main .assign_homework img {
		display: block;
		height: 100%;
		width: 100%;
		object-fit: cover;
		-o-object-fit: cover;
	}

	.container .smallList .smallList_item .smallList_main .assign_homework .num {
		background: rgba(0, 0, 0, 0.40);
		border: 1px solid #979797;
		border-radius: 0.72rem;
		width: 0.39rem;
		height: 0.27rem;
		color: #fff;
		font-size: 0.14rem;
		position: absolute;
		z-index: 1;
		bottom: 0.06rem;
		right: 0.16rem;
	}
	/*操作区域*/

	.container .smallList .smallList_item .smallList_main .handle_area {
		height: 0.35rem;
	}

	.container .smallList .smallList_item .smallList_main .handle_area .handle_left {
		height: 100%;
		font-size:0.14rem;
		color:#6c7381;
	}
	.container .smallList .smallList_item .smallList_main .handle_area .handle_left img{
		width:0.12rem;
		height:0.11rem;
		margin-left:0.11rem;
		margin-right:0.08rem;
	}

	.container .smallList .smallList_item .smallList_main .handle_area .handle_right {
		height: 0.35rem;
	}

	.container .smallList .smallList_item .smallList_main .handle_area .doClaim {
		background:#67a5ff;
		width:0.6rem;
		height:0.35rem;
		font-size:0.14rem;
		color:#ffffff;
	}
	.container .smallList .smallList_item .smallList_main .handle_area .didClaim {
		background:#a1a6b1;
		width:0.6rem;
		height:0.35rem;
		font-size:0.14rem;
		color:#ffffff;
	}


	.container .smallList .smallList_item .smallList_main .handle_num {
		font-size: 0.14rem;
		color: #42454c;
		padding: 0 0.12rem;
		padding-bottom: 0.1rem;
	}
	.container .smallList .smallList_item .smallList_main .handle_num p{
		margin-right:0.08rem;
	}
</style>
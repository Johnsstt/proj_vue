<template>
    <div class="audioWrap" flex="cross:center main:justify" @click.stop="play(url,audioId)">
        <div>
            <img :src="playUrl" name="audioPlayerItem" v-if="!playState"/>
            <img :src="playingUrl" name="audioPlayerItem" v-if="playState"/>
        </div>
        <div class="time" v-text="seconds"></div>
    </div>
</template>
<script type="text/babel">
    import {imagedomain} from '../api/api.js'
    export default{
        data(){
            return{
                playUrl:require('./images/smallAudioPlay.png'),
                playingUrl:require('./images/smallAudioPlaying.gif'),
                imagedomain:imagedomain,
            }
        },
        mounted(){
            util.jsBridgeCallBack('closeAudio',this.closeAudio);
            this.$store.dispatch('getAudioId','');
        },
        computed: {
            seconds: function() {
                return new Date(this.time*1000).Time('m\'s\"')
            },
            playState:function () {
                return this.audioId==this.$store.state.audioId
            }
        },
        methods:{
            play(url,audioId){
                if(audioId==this.$store.state.audioId){
                    this.closeAudio();
                }else{
                    util.audio.src=imagedomain+url;
                    util.audio.play();
                    this.$store.dispatch('getAudioId',audioId);
                }
                util.audio.addEventListener('ended',()=>{
                    this.closeAudio();
                }, false);

            },
            closeAudio(){
                if(util.audio.currentTime){
                    util.audio.currentTime = 0;
                }
                util.audio.pause();
                this.$store.dispatch('getAudioId','');
            }

        },
        props:['url','time','audioId']
    }
</script>
<style scoped>
    .audioWrap{
        background:#deefff;
        border-radius:0.04rem;
        height:0.3rem;
        width:0.84rem;
        position: relative;
        display: -webkit-inline-flex;
        display: inline-flex;
    }
    .audioWrap img{
        height:0.16rem;
        margin-left:0.07rem;
    }
    .audioWrap .time{
        margin-right: 0.07rem;
        font-size:0.14rem;
        color:#666666;
    }
    .audioInner{
        position: absolute;
        width:100%;
        height:100%;
    }
</style>

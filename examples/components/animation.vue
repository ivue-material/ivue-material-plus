<template>
    <div>
        <div class="card">
            <ivue-button @click="anim1 = !anim1">显示动画</ivue-button>
            <transition name="fade">
                <div v-show="anim1" class="transition-box">渐显/隐</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim2 = !anim2">显示动画</ivue-button>
            <transition name="zoom">
                <div v-show="anim2" class="transition-box">缩放</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim3 = !anim3">显示动画</ivue-button>
            <transition name="move-up">
                <div v-show="anim3" class="transition-box">向上</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim4 = !anim4">显示动画</ivue-button>
            <transition name="move-down">
                <div v-show="anim4" class="transition-box">向下</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim5 = !anim5">显示动画</ivue-button>
            <transition name="move-left">
                <div v-show="anim5" class="transition-box">向左</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim6 = !anim6">显示动画</ivue-button>
            <transition name="move-right">
                <div v-show="anim6" class="transition-box">向右</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim7 = !anim7">显示动画</ivue-button>
            <transition name="slide-middle">
                <div v-show="anim7" class="transition-box">居中折叠</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim8 = !anim8">显示动画</ivue-button>
            <transition name="slide-up">
                <div v-show="anim8" class="transition-box">向上折叠</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim9 = !anim9">显示动画</ivue-button>
            <transition name="slide-down">
                <div v-show="anim9" class="transition-box">向下折叠</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim10 = !anim10">显示动画</ivue-button>
            <transition name="slide-left">
                <div v-show="anim10" class="transition-box">向左折叠</div>
            </transition>
        </div>
        <div  class="card">
            <ivue-button @click="anim11 = !anim11">显示动画</ivue-button>
            <transition name="slide-right">
                <div v-show="anim11" class="transition-box">向右折叠</div>
            </transition>
        </div>
         <div  class="card">
           循环
            <ivue-icon class="ivue-animation-loop" >menu</ivue-icon>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            anim1: true,
            anim2: true,
            anim3: true,
            anim4: true,
            anim5: true,
            anim6: true,
            anim7: true,
            anim8: true,
            anim9: true,
            anim10: true,
            anim11: true,
        };
    },
};
</script>

<style lang="scss" scoped>
.transition-box {
    margin-top: 32px;
    width: 100%;
    border-radius: 4px;
    background-color: #409eff;
    text-align: center;
    color: #fff;
    padding: 24px 0;
}

.card{
  height: 500px;
  width: 500px;
}
</style>

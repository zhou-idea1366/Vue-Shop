<template>

  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul  ref="leftUl">
          <li class="menu-item " v-for="(good, index) in goods"
              :key="index"  :class="{current: index===currentIndex}" @click="clickItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" v-if="good.icon" :src="good.icon">
              {{good.name}}</span>
          </li>

        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="RightUl">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index">
                <div class="icon">
                  <img width="57" height="57"
                       :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    CartControl组件
                  </div>
                </div>
              </li>

            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
  /*
   1. 滑动右侧列表, 左侧的当前分类可能需要变化
   计算当前分类的下标: currentIndex
   右侧列表Y轴方向滑动的位置: scrollY, 在右侧滑动过程中不断变化
   右侧所有分类li标签的top值: tops, 一旦列表数据显示之后就不会再变化
   在列表显示之后, 统计并更新tops
   监视右侧列表的滑动, 并在回调函数中更新scrollY
   2. 点击左侧分类项, 右侧列表滑动到对应位置
   给左侧列表项绑定点击监听
   根据下标得到目标位置的坐标, 滑动到对应的位置
   3. 让当前分类始终可见
   一旦当前分类发生改变, 让当前分类项滑动到最上面(不一定能到指定位置, 但至少保证在可视范围内)

   */
  import BScroll from 'better-scroll'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        scrollY: 0, // 右侧列表Y轴方向滑动的位置
        tops: [], // 右侧所有分类li标签的top值
      }
    },
    mounted () {
      this.$store.dispatch('getShopGoods', () => { // goods数据更新
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
      // 创建左侧列表滑动对象
      /*this.leftScroll = new BScroll('.menu-wrapper', {

      }),*/
      // 创建右侧列表滑动对象
      /*this.rightScroll = new BScroll('.foods-wrapper', {

      })*/
    },
    computed :{
      ...mapState(['goods']),

      // 当前分类的下标
      currentIndex () {
        const {scrollY, tops} = this
        // 计算出最新的下标
        const index = tops.findIndex((top, index) => {
          // scrollY大于或等于当前top && 小于下一个top
          return scrollY>=top && scrollY<tops[index+1]
        })
        // 如果下标变化了
        if(this.index!==index && this.leftScroll) {
          this.index = index
          // 将index对应的左侧li滚动到最上面(尽量)
          const li = this.$refs.leftUl.children[index]
          this.leftScroll.scrollToElement(li, 300)
        }

        return index
      }
    },
    methods: {
      // 初始化滚动对象
      _initScroll () {
        // 创建左侧列表滑动对象
        this.leftScroll = new BScroll('.menu-wrapper', {
          click: true, // 由库来分发click事件
        })
        // 创建右侧列表滑动对象
        this.rightScroll = new BScroll('.foods-wrapper', {
          // probeType: 0 // 即不派发 scroll 事件
          probeType: 1, // 非实时(每隔一定时间才分发), 只有触摸时才分发
          click: true, // 由库来分发click事件
        })

        // 绑定scroll事件监听
        this.rightScroll.on('scroll', ({x, y}) => {
          console.log('scroll', x, y)
          this.scrollY = Math.abs(y)
        })

        // 绑定滚动结束的监听
        this.rightScroll.on('scrollEnd', ({x, y}) => {
          console.log('scrollEnd', x, y)
          this.scrollY = Math.abs(y)
        })
      },

      // 初始化tops
      _initTops () {
        const tops = []
        let top = 0
        tops.push(top)
        const lis = this.$refs.RightUl.getElementsByClassName('food-list-hook')
        Array.prototype.slice.call(lis).forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
        // 更新tops状态
        this.tops = tops
        console.log('tops', tops)
      },

      clickItem (index) {
        // 得到目标位置的滚动坐标
        const y = -this.tops[index]

        // 更新scrollY为目标值
        this.scrollY = -y

        // 让右侧列表平滑滚动到目标位置
        this.rightScroll.scrollTo(0, y, 500)
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 225px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>

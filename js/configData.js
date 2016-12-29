var configData = {
    //首页配置
    indexPage:{
        //背景图片-配置成需要的时候显示，不需要的时候隐藏，或者为空
        turntableBg:{
            isShow:true,
            tableBg:"http://i2.letvimg.com/lc07_pay/201612/19/16/21/images/images/turntable-bg.png"
        },
        //转盘图片
        turntableImg: "http://i3.letvimg.com/lc07_pay/201612/21/14/43/turnTable-bg3.png",
        //转盘指针图片-带文字
        turnPointerImg:"http://i2.letvimg.com/lc07_pay/201612/19/16/21/images/images/pointer.png",
        //旋转时间控制旋转速度
        duration: 7000,
        angels:1800,//点击抽奖转盘旋转度数
        //剩余抽奖次数文案 （文案可配置，如果参与资格为0则不显示）
        lotteryText:"剩余抽奖机会",
        //奖品细分种类UI图片需要等比分配每个奖项  奖品填写顺序：抽奖指针默认状态下左边开始逆时旋转
        //如果是空奖giftName用空字符串表示即可""
        giftType: [
             {
                giftId:1,//礼品ID
                giftName:"",//奖品对应名称
                //弹窗奖品对应的图片
                dialogGift:"images/prize-none.png"
            },//奖品ID  奖品名称-用于中奖弹窗提示
            {
                giftId:2,
                giftName:"第二种",
                //弹窗奖品图片
                dialogGift:"http://i1.letvimg.com/lc04_pay/201612/20/13/43/jiangpin.png"
            },
            {
                giftId:3,
                giftName:"第三种",
                //弹窗奖品图片
                dialogGift:"http://i1.letvimg.com/lc04_pay/201612/20/13/43/jiangpin.png"
            },
            {
                giftId:4,
                giftName:"第四种",
                //弹窗奖品图片
                dialogGift:"http://i1.letvimg.com/lc04_pay/201612/20/13/43/jiangpin.png"
            },
            {
                giftId:5,
                giftName:"第五种",
                //弹窗奖品图片
                dialogGift:"http://i1.letvimg.com/lc04_pay/201612/20/13/43/jiangpin.png"
            },
            {
                giftId:6,
                giftName:"第六种",
                //弹窗奖品图片
                dialogGift:"http://i1.letvimg.com/lc04_pay/201612/20/13/43/jiangpin.png"
            }
        ]
    },
    //弹窗配置
    dialog:{
        isShow:true,
        //弹窗背景色/背景图片 background的属性值
        dialogImg:"http://i2.letvimg.com/lc07_pay/201612/19/16/21/images/images/turntable-bg.png",
        dialogBg:"rgba(0, 0, 0, 0.5)",
        //弹窗按钮文案-如果是图片的话这项为空字符 ""
        dialogButtonText:"领取奖品",
        //弹窗按钮颜色-如果是图片的话这项为空字符串""
        dialogButtonBg:"#33D92A",
        //弹窗按钮图片-如果有的话自带文案
        dialogButtonImg:" ",
        //弹窗关闭图片
        closeDialogImg:'http://i1.letvimg.com/lc07_pay/201612/19/16/21/images/images/close.png'
    },
    //中奖名单展示
    showList:{
        //中奖列表盒子的高度
        showListHeight:'6rem',
        //中奖名单每一条的高度
        perInfoHeight:'1rem'
    },
    reFreshTime:120000 //中奖列表刷新时间间隔
}
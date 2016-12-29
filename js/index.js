$((function () {
    document.documentElement.style.fontSize = (document.documentElement.clientWidth > 640 ? 100 : document.documentElement.clientWidth * 100 / 640) + 'px';
    var bRotate = false;
    var drawChanceLeft = null; //初始剩余抽奖次数
    var timer = 0;
    var blockNumber = configData.indexPage.giftType.length;//圆盘的块数
    var emptyPrizeId = null;//空奖的ID
    var perDegrees = 360 / blockNumber;
    var giftNumber = null;//礼品的顺序
    var giftId = null;//礼品ID
    var giftText = '';//奖品名字
    var isLoad = false;
    var scrolH = 0;//滚动高度
    var scrollTimer = null;//中奖名单滚动定时器
    //获取空奖的Id
    $(configData.indexPage.giftType).each(function (i, item) {
        if (item.giftName.length == 0) {
            emptyPrizeId = item.giftId;
        }
    });
    var main = {
        init: function () {
            //if (LEPass && LEPass.isLogin()) {
            if (true) {
                main.getGiftInfo();//这个需要放到main.pageInit()前执行，因为需要获取剩余抽奖次数
            } else {
                $('.my-gift-list').html(' <li>您还没有登录</li>');
            }
            main.pageInit();
            main.clickButton();
            main.showList();
            //main.getWinnerList();
            main.closeDialog();
        },
        //页面配置
        pageInit: function () {
            //配置背景
            if (configData.indexPage.turntableBg.isShow) {
                $('.turntable-game').css({
                    'background-image': 'url(' + configData.indexPage.turntableBg.tableBg + ')'
                    //'background-size': '16rem 100%;'
                });
            }
            //配置转盘图片
            $('#rotate').attr('src', configData.indexPage.turntableImg);
            //按钮指针图片
            $('.pointer-img').attr("src", configData.indexPage.turnPointerImg);

            //弹窗是否需要
            if (configData.dialog.isShow) {
                //弹窗背景图片或者背景色
                if (configData.dialog.dialogImg) {
                    $('.drawResult').css('background-image', 'url(' + configData.dialog.dialogImg + ')');
                } else {
                    $('.drawResult').css('background', configData.dialog.dialogBg);
                }
                //弹窗关闭按钮
                $('.colseJiangPin').attr('src', configData.dialog.closeDialogImg);
                //弹窗按钮-分两种情况：1：文案和颜色 2：图片自带文字
                if ((configData.dialog.dialogButtonText) && (configData.dialog.dialogButtonBg)) {
                    $('.btn_Get_box').html('<input class="btn_Get" value="' + configData.dialog.dialogButtonText + '" type="button" >');
                    $('.btn_Get').css('background', configData.dialog.dialogButtonBg);
                } else if (configData.dialog.dialogButtonImg) {
                    $('.btn_Get_box').html('<img class="btn_Get" src="' + configData.dialog.dialogButtonImg + '" alt=""/>');
                }
                window.setTimeout(function () {
                    $('.drawResult').addClass('myactive');
                }, 200);
            } else {

            }
            //中奖名单列表
            $('.winner-list').css('height', configData.showList.showListHeight);
            $('.my-gift').css('height', configData.showList.showListHeight);
        },
        //点击抽奖
        clickButton: function () {
            $('.pointer').click(function () {
                //if (verifyUserLoginStatus()) {
                if (true) {
                    if (bRotate)return;
                    main.isQualifications();
                    //main.tools.rotateFn(0, perDegrees / 2 + (giftNumber - 1) * perDegrees, giftText);
                }
            });

        },
        //展示获奖信息列表区选项卡功能
        showList: function () {
            main.getWinnerList();
            $('.my-gift-title').on('click', function () {
                $('.winner-list').hide().siblings('.my-gift').show();
                $(this).addClass('list-show-on').siblings("li").removeClass('list-show-on');
            }).siblings("li").on('click', function () {
                $('.my-gift').hide().siblings('.winner-list').show();
                $(this).addClass('list-show-on').siblings("li").removeClass('list-show-on');
            });
        },
        //获取中奖名单
        getWinnerList: function () {
            var urlObj = {
                //url: "http://api.membership.levp.go.le.com/backend-act-engine/act/v1.0/prize/event",
                url: "json/winnerList.json",
                load: false,
                data: {
                    //vipcsrf: $.cookie("vipcsrf"),
                    //perPage: 50,
                    //inRecent: 3600,
                    //actId: 'e9f2dc7d786b4e0796590725d20ae4d8'

                },
                //每次更新数据将以前的覆盖掉
                success: function (data) {
                    var str = '';
                    if (data.head.ret == 0) {
                        isLoad = true;
                        var data = data.body.events;
                        if (data.length > 0) {
                            $(data).each(function (i, item) {
                                str += '<li>' + item.encryptedMobile + '</li>';
                            });
                            //每次更新数据都替换原来的
                            $('.luck-list').html(str);
                            //每次更新数据插入到原来的后边
                            //$('.luck-list').append(str);
                            if (!isLoad) {
                                $('.winner-show').find('li').css({
                                    'height': configData.showList.perInfoHeight,
                                    'line-height': configData.showList.perInfoHeight
                                });
                            }
                            if ($(".winner-list").height() < $(".luck-list").height()) {
                                clearInterval(scrollTimer);
                                scrollTimer = setInterval(function () {
                                    main.tools.scrollNews($(".winner-list"));
                                }, 80);
                            }
                        }
                    }
                }

            };
            ajaxRequestJsonP(urlObj);
        },
        //中奖弹窗关闭效果
        closeDialog: function () {
            $('.colseJiangPin').on('click', function () {
                $('.bg-mask').hide();
                $('.drawResult').hide();
                main.getGiftInfo();//弹窗关闭重新获取用户抽奖参与情况信息
            })
        },
        //获取用户抽奖资格及抽取奖品
        isQualifications: function () {
            var urlObj = {
                //url:"http://api.membership.levp.go.le.com/backend-act-engine/act/v1.0/prize/user/draw",
                url: "json/drawData.json",
                data: {
                    //vipcsrf: $.cookie("vipcsrf"),
                    //actId: 'e9f2dc7d786b4e0796590725d20ae4d8'
                },
                success: function (data) {
                    if (data.head.ret == 22) {
                        alert("对不起，您暂时没有资格抽奖");
                    } else if (data.head.ret == 27) {
                        alert("您的抽奖机会已经用完");
                    } else if (data.head.ret == 0) {
                        timer = setTimeout(function () {
                            //drawChanceLeft > 0 ? drawChanceLeft-- : drawChanceLeft = 0;
                            $('#num').text(drawChanceLeft + ' ');
                            $('.progress').animate({'width': drawChanceLeft + 'rem'});
                        }, configData.indexPage.duration);	//跟随转动时间duration；
                        giftId = data.body.drawAct.prizeId;//礼品ID
                        if (giftId != emptyPrizeId) {
                            $(configData.indexPage.giftType).each(function (i, item) {
                                if (configData.indexPage.giftType[i].giftId == giftId) {
                                    giftNumber = i;//礼品顺序
                                }
                            });
                            giftText = configData.indexPage.giftType[giftNumber].giftName;
                            $('.btn_Get').on('click', function () {
                                main.getGiftInfo();//点完弹窗按钮重新获取用户抽奖参与情况信息
                            });
                        } else if (giftId == emptyPrizeId) {
                            $(configData.indexPage.giftType).each(function (i, item) {
                                if (item.giftName.length == 0) {
                                    giftNumber = i;//对应配置文件里没中奖的礼品的索引
                                }
                            });
                            giftText = "谢谢参与";
                            $('.btn_Get').attr('value', "再玩一次");
                            $('.btn_Get').on('click', function () {
                                $('.bg-mask').hide();
                                $('.drawResult').hide();
                                main.getGiftInfo();//点完弹窗按钮重新获取用户抽奖参与情况信息
                            });
                        }
                        //弹窗奖品图片
                        $('.imgJiangPin').attr('src', configData.indexPage.giftType[giftNumber].dialogGift);
                        main.tools.rotateFn(perDegrees / 2 + (giftNumber) * perDegrees, giftText);

                    }
                }
            };
            ajaxRequestJsonP(urlObj);
        },
        //获取用户抽奖活动参与情况
        getGiftInfo: function () {
            var urlObj = {
                //url:"http://api.membership.levp.go.le.com/backend-act-engine/act/v1.0/prize/user/info",
                url: "json/userPrizeInfo.json",
                data: {
                    //vipcsrf: $.cookie("vipcsrf"),
                    //actId: 'e9f2dc7d786b4e0796590725d20ae4d8'
                },
                success: function (data) {
                    if (data.head.ret == 0) {
                        drawChanceLeft = data.body.drawChanceLeft;
                        drawInfo = data.body.drawActs;
                        var str = '';
                        //剩余抽奖机会
                        if (drawChanceLeft > 0) {
                            $('.remain').show();
                            $('.remain_txt').html(configData.indexPage.lotteryText + '<span id="num">' + drawChanceLeft + '</span>次');
                        } else {
                            $('.remain').hide();
                        }
                        $(drawInfo).each(function (i, item) {
                            var curPrizeId = item.prizeId;
                            $(configData.indexPage.giftType).each(function (i, item) {
                                if (configData.indexPage.giftType[i].giftId == curPrizeId) {
                                    curNumber = i;//礼品顺序
                                }
                            });
                            str += '<li>' + configData.indexPage.giftType[curNumber].giftName + '<i class="to-get" received="' + item.received + '">领取</i></li>';
                        });
                        $('.my-gift-list').html(str);
                        ($('.my-gift-list').find('.to-get').each(function (i, item) {
                            if ($(item).attr('received') == 'true') {
                                $(item).hide();
                            }
                        }));
                    }
                }
            };
            ajaxRequestJsonP(urlObj);
        },
        tools: {
            rotateFn: function (angles, txt) {	//奖项，角度
                bRotate = !bRotate;
                $('#rotate').stopRotate();
                $('#rotate').rotate({
                    angle: 0,//旋转的角度数  并且立即执行
                    animateTo: angles + configData.indexPage.angels,//可配置圈数 从当前角度值动画旋转到给定的角度值 （或给定的角度参数）
                    //animateTo: 30,//从当前角度值动画旋转到给定的角度值 （或给定的角度参数）
                    duration: configData.indexPage.duration,//配置转动时间
                    callback: function () {
                        if (configData.dialog.isShow) {
                            $('.gift-text').html(txt);
                            $('.drawResult').show();
                            $('.bg-mask').show();
                            main.getGiftInfo();//每次抽完奖需要重新获取用户抽奖参与情况
                        }
                        bRotate = !bRotate;
                    }
                });
            }
            ,
            rnd: function (n, m) {
                return Math.floor(Math.random() * (m - n + 1) + n)
            },
            scrollNews: function (obj) {
                var $self = obj.find(".luck-list");//中奖列表UL
                var lineHeight = $self.find("li:first").height();
                if ($('.luck-list>li').length <= parseInt($('.winner-list').height() / lineHeight)) {
                    clearInterval(scrollTimer);
                } else {
                    scrolH -= 1;
                    $('.luck-list').css('top', scrolH + 'px');
                    if (scrolH < -lineHeight) {
                        $('.luck-list>li:first-child').clone(true).appendTo($('.luck-list'));
                        $('.luck-list>li:first-child').remove();
                        $('.luck-list').css('top', '0px');
                        scrolH = 0;
                    }
                }
            }
        }
    };
    main.init();
    var updateTimer = setInterval(main.getWinnerList, configData.reFreshTime);

}));





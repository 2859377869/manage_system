//用于创建路由器
import VueRouter from "vue-router";

//引入组件
import MainPage from '@/pages/MainPage'
import LoginPage from '@/pages/LoginPage2'
import courseBasicInformation from '@/components/courseBasicInformation/courseBasicInformation'
import sudoCourseInformation from '@/components/courseBasicInformation/sudoCourseInformation'
import programObjective from '@/components/courseBasicInformation/programObjective'

import classInformation from '@/components/courseBasicInformation/classInformation'
import teachingPro from '@/components/courseBasicInformation/teachingPros/teachingPro'
import sudoTeachingPro from '@/components/courseBasicInformation/teachingPros/sudoTeachingPro'
import SuperTeachingPro from '@/components/courseBasicInformation/teachingPros/SuperTeachingPro'
import indexPoint from '@/components/courseBasicInformation/indexPoint'
import basicInformationTable from '@/components/courseExamMethods/basicInformationTable'

import welcome from '@/components/welcome'
import finalTable from '@/components/courseExamMethods/finalTable'
import usualPreformanceTable from '@/components/studentScoreManager/usualPreformanceTable'
import finalStatisticsTable from '@/components/studentScoreManager/finalStatisticsTable'
import finalComprehensiveTable from '@/components/studentScoreManager/finalComprehensiveTable'
import analysisTable from '@/components/analysePage/analysisTable'
import programTable from '@/components/analysePage/programTable'

import ChoicePage from '@/pages/ChoicePage'

import { Message } from "element-ui";
import cookie from "vue-cookies"
import store from "@/store";

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: LoginPage
        },
        {
            path: "/ChoicePage",
            component: ChoicePage
        },
        {
            path: "/MainPage",
            component: MainPage,
            children: [{
                path: 'analysisTable',
                component: analysisTable
            },
            {
                path: 'programTable',
                component: programTable
            },
            {
                path: 'finalStatisticsTable',
                component: finalStatisticsTable
            },

            {
                path: 'finalComprehensiveTable',
                component: finalComprehensiveTable
            },
            {
                path: 'finalTable',
                component: finalTable
            },
            {
                path: 'usualPreformanceTable',
                component: usualPreformanceTable
            },
            {
                path: 'basicInformationTable',
                component: basicInformationTable
            },
            {
                path: 'welcome', //  课程基本信息
                component: welcome
            },
            {
                path: 'courseBasicInformation', //  课程基本信息
                component: courseBasicInformation
            },
            {
                path: 'sudoCourseInformation', //  管理员课程基本信息
                component: sudoCourseInformation
            },
            {
                path: 'teachingPro', //教学大纲
                component: teachingPro
            },
            {
                path: 'sudoTeachingPro', //系主任教学大纲
                component: sudoTeachingPro,
                meta: {
                    isAdmin: 1 //此处仅作演示之用，可自行修改
                }
            },
            {
                path: 'SuperTeachingPro', //院长教学大纲
                component: SuperTeachingPro
            },
            {
                path: 'indexPoint', //毕业要求指标点
                component: indexPoint
            },
            {
                path: 'classInformation', //  课程详细基本信息
                component: classInformation,
            },
            {
                path: 'programObjective',  //课程目标设置
                component: programObjective
            }
            ]
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const token = cookie.get('satoken')

    if (token) {
        if (to.path === '/') {
            // 登录，跳转首页
            next({ path: '/MainPage/courseBasicInformation' })
        } else {
            try {
                /*
                    store.dispatch('user/getInfo')是 vuex 技术，可用于存储全局数据
                    具体代码在 /store 文件夹下
                    使用方法请见 /pages/MainPage.vue
                */
                let user = await store.dispatch('user/getInfo')
                //此处可做权限验证           
                if (!to.meta.isAdmin) {
                    next()
                } else {
                    if (user.isAdmin === to.meta.isAdmin) {
                        next()
                    } else {
                        Message.warning('对不起您没有权限访问此页面')
                        next('/MainPage/courseBasicInformation')
                    }
                }
            } catch (e) {
                Message.error(e)
                cookie.remove('satoken')
                next('/')
            }
        }
    } else {
        if (to.path === '/') {
            next()
        } else {
            next('/')
        }
    }
})

export default router
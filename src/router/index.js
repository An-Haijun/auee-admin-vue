import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/articleCreate',
                    component: resolve => require(['../components/page/article/ArticleCreate.vue'], resolve),
                    meta: {
                        title: '写文章'
                    }
                },
                {
                    path: '/article',
                    component: resolve => require(['../components/page/article/Article.vue'], resolve),
                    meta: {
                        title: '文章列表'
                    }
                },
                {
                    path: '/articleType',
                    component: resolve => require(['../components/page/article/ArticleType.vue'], resolve),
                    meta: {
                        title: '文章类型'
                    }
                },
                {
                    path: '/articleClass',
                    component: resolve => require(['../components/page/article/ArticleClass.vue'], resolve),
                    meta: {
                        title: '文章分类'
                    }
                },
                {
                    path: '/articleOpen',
                    component: resolve => require(['../components/page/article/ArticleOpen.vue'], resolve),
                    props: {articleId: null},
                    meta: {
                        title: '查看文章'
                    }
                },
                {
                    path: '/articleEdit',
                    component: resolve => require(['../components/page/article/ArticleEdit.vue'], resolve),
                    meta: {
                        title: '文章编辑'
                    }
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/user/User.vue'], resolve),
                    meta: {
                        title: '用户列表'
                    }
                },
                {
                    path: '/userCreate',
                    component: resolve => require(['../components/page/user/UserCreate.vue'], resolve),
                    meta: {
                        title: '添加用户'
                    }
                },
                {
                    path: '/userEdit',
                    component: resolve => require(['../components/page/user/UserEdit.vue'], resolve),
                    meta: {
                        title: '编辑用户'
                    }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: {
                        title: '基础表格'
                    }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: {
                        title: 'tab选项卡'
                    }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {
                        title: '基本表单'
                    }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {
                        title: '富文本编辑器'
                    }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {
                        title: 'markdown编辑器'
                    }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {
                        title: 'schart图表'
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {
                        title: '拖拽列表'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})

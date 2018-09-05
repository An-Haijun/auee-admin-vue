<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: "el-icon-setting",
                    index: "dashboard",
                    title: "系统首页"
                },
                {
                    icon: "el-icon-tickets",
                    index: "5",
                    title: "文章管理",
                    subs: [
                        {
                            index: "articleCreate",
                            title: "写文章"
                        },
                        {
                            index: "article",
                            title: "文章列表"
                        },
                        {
                            index: "articleType",
                            title: "文章类型"
                        },
                        {
                            index: "articleClass",
                            title: "文章分类"
                        }
                    ]
                },
                {
                    icon: "el-icon-tickets",
                    index: "6",
                    title: "用户管理",
                    subs: [
                        {
                            index: "userCreate",
                            title: "添加用户"
                        },
                        {
                            index: "user",
                            title: "用户列表"
                        }
                    ]
                },
                {
                    icon: "el-icon-tickets",
                    index: "7",
                    title: "权限管理",
                    subs: [
                        {
                            index: "",
                            title: "用户权限"
                        },
                        {
                            index: "",
                            title: "管理员权限"
                        },
                        {
                            index: "",
                            title: "菜单树"
                        }
                    ]
                },
                {
                    icon: "el-icon-tickets",
                    index: "8",
                    title: "功能模板",
                    subs: [
                        {
                            index: "table",
                            title: "基础表格"
                        },
                        {
                            index: "tabs",
                            title: "tab选项卡"
                        },
                        {
                            index: "upload",
                            title: "文件上传"
                        },
                        {
                            index: "drag",
                            title: "拖拽列表"
                        },
                        {
                            index: "form",
                            title: "基本表单"
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on("collapse", msg => {
            this.collapse = msg;
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 230px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu-item {
}
</style>

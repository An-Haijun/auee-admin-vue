<template>
    <div class="aue-content">
        <div class="container">
            <el-row class="article-content" :gutter="50">
                <el-col :span="18">
                    <div class="article-header">
                        <span>{{articleDetails.title}}</span>
                    </div>
                    <div class="article-header">
                        <el-row type="flex" class="full-info">
                            <el-col :span="3">状态: {{articleDetails.article_state_name}}</el-col>
                            <el-col :span="3" class="like">点赞: {{articleDetails.like_number}}</el-col>
                            <el-col :span="3" class="comment">评论: {{articleDetails.comment_number}}</el-col>
                            <el-col :span="4" class="type">类型: {{articleDetails.type_content}}</el-col>
                            <el-col :span="4" class="class">分类: {{articleDetails.class_content}}</el-col>

                            <el-col :span="7" class="btn">
                                <!-- <el-button type="primary">编辑</el-button> -->
                                <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit"></el-button>
                            </el-col>
                        </el-row>
                        <el-row class="full-info">
                            <el-col :span="6">创建时间: {{articleDetails.create_at}}</el-col>
                            <el-col :span="6" v-if="articleDetails.update_at && articleDetails.create_at != articleDetails.update_at">上次修改: {{articleDetails.update_at}}</el-col>
                        </el-row>
                    </div>
                    <div v-html="articleDetails.markdown_content" class="aue-markdown-ui" ref="articleCatalog"></div>
                </el-col>
                <el-col :span="6">
                    <div class="aue-catalog-content">
                        <div class="aue-catalog-ui">
                            <ul>
                                <li class="catalog-header">
                                    目录
                                </li>
                                <li v-if="caralogLists.length > 0" :class="item.nodeClass" v-for="(item, index) in caralogLists" :key="index">
                                    <a :href="item.aId">=> {{item.content}}</a>
                                </li>
                                <li v-if="caralogLists.length == 0" class="catalog-tip">
                                    <p>没有目录 ...</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- <div v-html="catalogContent" class="aue-catalog-ui"></div> -->

                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { getArticleById } from "../../fetch/article";
export default {
    data() {
        return {
            articleId: "",
            catalogContent: "",
            articleDetails: {},
            caralogLists: []
        };
    },
    // props: ['articleId'],
    created() {
        this.changeRoute();
    },
    watch: {
        "$route.query.articleId": function(val, oldVal) {
            console.log("new: %s, old: %s", val, oldVal);
            if (val) {
                this.changeRoute();
            }
        }
    },
    methods: {
        changeRoute() {
            this.articleId = this.$route.query.articleId;
            this.getArticleDetails();
        },
        getArticleDetails() {
            let params = {
                article_id: this.articleId,
                user_id: JSON.parse(localStorage.getItem("userInfo")).id
            };
            getArticleById(params)
                .then(res => {
                    if (res.row.success) {
                        console.log(res.data);
                        this.articleDetails = res.data;
                        this.setCatalog();
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        setCatalog() {
            setTimeout(() => {
                let articleCatalog = this.$refs.articleCatalog;
                let childrenLists = articleCatalog.children;
                let len = articleCatalog.children.length;
                let catalogContent = "";
                for (let i = 0; i < len; i++) {
                    let domNode = childrenLists[i];
                    let tagName = domNode.tagName;
                    if (tagName.substr(0, 1).toUpperCase() == "H") {
                        let content = domNode.outerText,
                            nodeA = domNode.children[0],
                            aId = nodeA.id;
                        // catalogContent = catalogContent + `<${tagName}><a href="#${aId}" @click="catalogScroll()">${content}</a></${tagName}>`;
                        this.caralogLists.push({
                            content: content,
                            aId: `#${aId}`,
                            nodeClass: `aue-catalog-${tagName.toUpperCase()}`
                        });
                    }
                }
            }, 500);
        },
        handleEdit(index, row) {
            this.idx = index;
            this.$router.push({
                path: "/articleEdit",
                query: { articleId: this.articleDetails.id }
            });
        }
    }
};
</script>
<style scoped>
.container {
    height: 90%;
    overflow-y: scroll;
}

.article-header {
    margin: 5px 0;
}

.article-header span {
    letter-spacing: 2px;
    font-size: 18px;
}

.full-info {
    font-size: 12px;
    align-items: center;
}

.full-info .like {
    color: #ff3030;
}

.full-info .comment {
    color: #1874cd;
}

.full-info .type {
    color: #eeb422;
}

.full-info .class {
    color: #00ff7f;
}

.full-info .btn {
    text-align: right;
}

.aue-content {
    width: 100%;
    padding: 20px 40px 20px 40px;
}

/* markdown-html style */

.aue-markdown-ui {
    box-sizing: border-box;
    padding: 10px 0 !important;
    border-top: #eee solid 1px;
    /* overflow-y: scroll; */
    /* height: 80%; */
    /* margin-right: 50px; */
}

.aue-markdown-ui >>> ul {
    list-style: none;
}

.aue-markdown-ui >>> h1 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> h2 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> h3 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> h4 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> h5 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> h6 {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> p {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> li {
    margin: 10px 0 !important;
}

.aue-markdown-ui >>> pre {
    margin: 10px 0 !important;
    background: #eee;
    box-sizing: border-box;
    padding: 20px 10px;
}

/* 目录 catalog style */
.aue-catalog-content {
    position: relative;
    height: 100%;
    width: 100%;
}
.aue-catalog-ui {
    position: fixed;
    box-sizing: border-box;
    padding: 10px 30px !important;
    color: #333;
    border: #eee solid 1px;
    border-radius: 6px;
    box-shadow: 0px 1px 1px 0.5px #eee;
    max-height: 460px;
    overflow-y: scroll;
    width: 16%;
}

.aue-catalog-ui ul {
    list-style: none;
}

.aue-catalog-ui .catalog-header {
    text-align: center;
    color: #555;
    font-size: 14px;
    margin: 0;
    padding: 0;
}

.aue-catalog-ui .catalog-tip {
    color: #666;
    font-weight: 500;
    font-size: 13px;
    text-align: center;
    margin: 20px 0;
    color: #999;
}

.aue-catalog-ui .aue-catalog-H1 {
    margin: 8px 0 !important;
    font-size: 13px;
}

.aue-catalog-ui .aue-catalog-H2 {
    margin: 8px 0 !important;
    font-size: 13px;
}

.aue-catalog-ui .aue-catalog-H3 {
    margin: 8px 0 !important;
    padding-left: 8px;
    font-size: 12px;
}

.aue-catalog-ui .aue-catalog-H4 {
    margin: 8px 0 !important;
    padding-left: 8px;
    font-size: 12px;
}

.aue-catalog-ui .aue-catalog-H5 {
    margin: 8px 0 !important;
    padding-left: 8px;
    font-size: 12px;
}

.aue-catalog-ui .aue-catalog-H6 {
    margin: 8px 0 !important;
    padding-left: 8px;
    font-size: 12px;
}

.aue-catalog-ui a {
    color: #888;
    font-weight: 500;
    /* font-size: 13px; */
}
</style>



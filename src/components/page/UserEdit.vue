<template>
    <div>
        <div class="container">
            <div class="form-box">
                <el-form ref="userForm" status-icon :rules="rules" :model="userForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="userForm.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input :type="isShowPassword?'text':'password'" placeholder="请输入密码" v-model="userForm.password">
                            <i class="el-icon-view el-input__icon" :class="isShowPassword? 'show-password' : ''" slot="suffix" @click="isShowPassword = !isShowPassword">
                            </i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="identityId" label="用户身份">
                        <el-select v-model="userForm.identityId" placeholder="请选择用户身份">
                            <el-option v-for="(item, index) in userIdentityLists" :key="index" :label="`${item.content}`" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="name" label="姓名">
                        <el-input v-model="userForm.name" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="userForm.mobile" maxlength="11" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="userForm.email" placeholder="请输入邮箱" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户简介">
                        <el-input type="textarea" rows="5" v-model="userForm.intro" placeholder="请输入用户简介" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
import { getUserById, getUserIdentity, updateUser } from "../../fetch/user";

export default {
    data() {
        return {
            userForm: {
                username: "",
                password: "",
                identityId: "",
                name: "",
                mobile: "",
                email: "",
                intro: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ]
            },
            userId: "",
            userMap: [],
            userIdentityLists: [],
            isShowPassword: false
        };
    },
    created() {
        this.changeRoute();
    },
    methods: {
        changeRoute() {
            this.userId = this.$route.query.userId;
            this.getUserIdentityFun();
            this.getUserByIdFun();
        },
        getUserIdentityFun() {
            getUserIdentity()
                .then(res => {
                    if (res.row.success) {
                        this.userIdentityLists = res.data;
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        getUserByIdFun() {
            let params = {
                user_id: this.userId
            };
            getUserById(params)
                .then(res => {
                    if (res.row.success) {
                        this.userMap = res.data;
                        console.log(this.userMap);
                        this.userForm.username = this.userMap.user_name;
                        this.userForm.password = this.userMap.password;
                        this.userForm.identityId = this.userMap.user_identity_id;
                        this.userForm.name = this.userMap.name;
                        this.userForm.mobile = this.userMap.mobile;
                        this.userForm.email = this.userMap.email;
                        this.userForm.intro = this.userMap.intro;
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        },
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.updateUserFun();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        updateUserFun() {
            let params = {
                user_id: this.userMap.id,
                name: this.userForm.name,
                user_name: this.userForm.username,
                password: this.userForm.password,
                mobile: this.userForm.mobile,
                email: this.userForm.email,
                intro: this.userForm.intro,
                user_identity_id: this.userForm.identityId
            };
            updateUser(params)
                .then(res => {
                    if (res.row.success) {
                        this.$router.go(-1);
                        this.$message.success("修改成功！");
                    } else {
                        this.$message.error(res.row.error_msg);
                    }
                })
                .catch(error => {
                    this.$message.error(`系统异常-${error}`);
                });
        }
    }
};
</script>
<style scoped>
.show-password {
    text-decoration: line-through;
}
</style>

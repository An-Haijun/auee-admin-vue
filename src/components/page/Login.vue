<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :type="isShowPassword?'text':'password'" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <i class="el-icon-view el-input__icon" :class="isShowPassword? 'show-password' : ''" slot="suffix" @click="isShowPassword = !isShowPassword">
                        </i>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from "../../fetch/user";
export default {
    data() {
        return {
            isShowPassword: false,
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {
                        user_name: this.ruleForm.username,
                        password: this.ruleForm.password
                    };
                    login(params).then(res => {
                        console.log(res);
                        if (res.row.success) {
                            let loginTimeMap = {
                                timestamp: res.row.timestamp,
                                usedtime: res.row.usedtime
                            }
                            localStorage.setItem(
                                "loginTimeMap",
                                JSON.stringify(loginTimeMap)
                            );
                            localStorage.setItem(
                                "userInfo",
                                JSON.stringify(res.data)
                            );
                            this.$message.success(
                                `欢迎登录，${this.ruleForm.username}`
                            );
                            this.$router.push("/");
                        } else {
                            console.log(res.row.error_msg);
                            this.$message.error(res.row.error_msg);
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.show-password {
    text-decoration: line-through;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
}
</style>
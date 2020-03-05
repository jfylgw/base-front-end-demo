export default {
    methods: {
        validateNull(rule, value, callback) {
            if (value) {
                callback();
            } else {
                callback(new Error('不能为空'));
            }
        },
        validateChar(rule, value, callback) {
            // 0-9，大小写字母，下划线
            let reg = /^[0-9a-zA-Z_]{1,}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('只能输入字母、数字或者下划线'));
            }
        },
        validateCharAndZh(rule, value, callback) {
            // 0-9，大小写字母，下划线，中文
            let reg = /^[0-9a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D]{1,}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('只能输入字母、中文、数字或者下划线'));
            }
        },
        validateNum(rule, value, callback) {
            // 范围0~9999小数点后1~2位
            let reg = /^-?\d{1,4}(?:\.\d{1,2})?$/; 
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('只能输入字母、数字或者下划线'));
            }
        },
        validatePhone(rule, value, callback) {
            // 11位手机号
            let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('手机号格式不正确'));
            }
        },
        validateIdCard(rule, value, callback) {
            // 18位从1900到2099年中间的范围验证
            let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('身份证格式不正确'));
            }
        },
        validateEmail(rule, value, callback) {
            let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('邮箱格式不正确'));
            }
        },
        // 校验数字范围
        validateNumRange(rule, value, callback) {
            if (value < 3 || value > 16) {
                callback(new Error('必须在3-16之间'));
            } else {
                callback();
            }
        },
        // 校验字符串长度
        validateLength(rule, value, callback) {
            if (value.length<0 || value.length>20) {
                callback(new Error('长度必须在0-20之间'));
            } else {
                callback();
            }
        }
    }
}
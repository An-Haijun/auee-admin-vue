const FormatData = function (options) {
    const typeMap = {
        date: _formatDate,
        calculation: _formatCalculation,
    }
    typeMap[options.type](options.data);
    if (typeMap[options.type](options.data)) {
        return typeMap[options.type](options.data);
    }
    
}

let _formatDate = function (data) {
    let date = new Date(data.value);
    let fmt = data.format;
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        let str = o[k] + '';
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }

    function padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
    return fmt;
};

let _formatCalculation = function (data) {

}

let arr = ['date', 'calculation'];

arr.forEach(type => {
    FormatData[type] = options => {
        let params = {};
        params.type = type;
        params.data = options;
        return FormatData(params);
    };
});

export default FormatData;
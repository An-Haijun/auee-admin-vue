import FormatData from './FormatData';

const components = [
    FormatData
]

const install = function (Vue, opts = {}) {
    components.map(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$format = FormatData;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {install};
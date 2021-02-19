import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/es5/util/colors';


Vue.use(Vuetify, {
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        primary: colors.indigo.base,
        secondary: colors.purple.base,
        accent: colors.cyan.base,
        error: colors.red.base,
        warning: colors.orange.base,
        info: colors.lightBlue.base,
        success: colors.green.base,
    },
});

export default new Vuetify({
    theme: {
        themes: {
            light: {
                background: "#F4F5F7"
            }
        }
    }
});

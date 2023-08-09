import React from 'react'

import {appWithTranslation} from 'next-i18next'

import 'antd/lib/style/default.less';
import 'antd/lib/table/style/index.less';
import 'antd/lib/pagination/style/index.less';
import 'antd/lib/alert/style/index.less';
import 'antd/lib/tooltip/style/index.less';
import 'antd/lib/spin/style/index.less';
import 'antd/lib/back-top/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/select/style/index.less';
import 'antd/lib/layout/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/modal/style/index.less';
import 'antd/lib/skeleton/style/index.less';
import 'antd/lib/config-provider/style/index.less';


import '../assets/global.less'
import '../assets/index.less'
import '../assets/world.less'
import '../components/Layout/index.less';
import '../components/World/SenkaDetail/index.less';

const MyApp = ({Component, pageProps}) => (
    <Component {...pageProps} />
)

export default appWithTranslation(MyApp)

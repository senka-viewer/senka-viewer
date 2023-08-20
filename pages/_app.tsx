import React from 'react'
import {AppProps} from "next/app"

import {appWithTranslation} from 'next-i18next'
import 'antd/lib/style/reset.css'
import '../assets/global.less'
import '../assets/index.less'
import '../assets/world.less'
import '../components/Layout/index.less'
import '../components/World/SenkaDetail/index.less'

const MyApp: React.FC<AppProps> = ({Component, pageProps}) => (
    <Component {...pageProps} />
)

export default appWithTranslation(MyApp)

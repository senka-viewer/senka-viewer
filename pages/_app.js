import React from 'react'
import App from 'next/app'

import { appWithTranslation } from '../i18n'

import '../assets/global.less'

export default appWithTranslation(class extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <Component {...pageProps} />
        )
    }
})

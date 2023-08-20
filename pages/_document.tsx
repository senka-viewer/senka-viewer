import React from 'react'

import Document, {Html, Head, Main, NextScript} from 'next/document'

import i18nextConfig from '../next-i18next.config'

export default class extends Document {
    render() {
        const currentLocale =
            this.props.__NEXT_DATA__.locale ??
            i18nextConfig.i18n.defaultLocale
        return (
            <Html lang={currentLocale}>
                <Head/>
                <body>
                <Main/>
                <NextScript/>
                {
                    process.env.NODE_ENV === 'production' ? (
                        <>
                            <script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'/>
                            <script async src='https://www.googletagmanager.com/gtag/js?id=UA-112661782-1'/>
                            <script dangerouslySetInnerHTML={{
                                __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","UA-112661782-1");`
                            }}/>
                        </>
                    ) : null
                }
                </body>
            </Html>
        )
    }
}

import React from 'react'

import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class extends Document {
    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                    {
                        process.env.NODE_ENV === 'production' ? (
                            <>
                                <script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' />
                                <script async src='https://www.googletagmanager.com/gtag/js?id=UA-112661782-1' />
                                <script dangerouslySetInnerHTML={{
                                    __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","UA-112661782-1");`
                                }} />
                            </>
                        ): null
                    }
                </body>
            </Html>
        )
    }
}

import React, {useState} from 'react'

import {ExportOutlined} from '@ant-design/icons'

import Head from 'next/head'
import {useRouter} from 'next/router'

import {FloatButton, Row, Col, Select, Layout as XLayout, ConfigProvider} from 'antd'

import {i18n, useTranslation} from 'next-i18next';

import {languages, lngSource, version, commit, defaultLngSource, footerLinkList} from './config'

const {Option} = Select;
const {Header, Footer, Content} = XLayout;

interface LayoutProps {
    title: string;
    children: JSX.Element | JSX.Element[]
}

export const Layout: React.FC<LayoutProps> = props => {
    const [locale, _setLocale] = useState(lngSource[i18n.language] || defaultLngSource);

    const setLocale = async (lng: string) => {
        await router.replace({
            pathname: router.pathname,
            query: router.query
        }, null, {locale: lng});
        _setLocale(lngSource[lng]);
    };

    const {t} = useTranslation('common');

    const router = useRouter();

    const {title, children} = props;
    return (
        <XLayout>
            <Head>
                <meta charSet='utf-8'/>
                <title>{`Senka Viewer - ${title}`}</title>
                <meta name='keywords' content='舰队收藏,艦隊これくしょん,艦これ,戦果,KanColle,Rank'/>
                <meta name='description' content={t('description')}/>
                <meta name='viewport' content='width=device-width, initial-scale=1'/>
                <link rel='icon' href='/static/favicon.ico'/>
            </Head>
            <ConfigProvider locale={locale} theme={{
                token: {
                    colorPrimary: '#2f54eb'
                }
            }}>
                <FloatButton.BackTop/>
                <div id="d2F0ZXJtYXJrCg"/>
                <Header className='page-header'>
                    <a href='/'><span className='page-title'>Senka Viewer</span></a>
                    <div className='language'>
                        <span className='lng'>{t('select-language')}</span>
                        <Select style={{width: '120px'}} onChange={setLocale} defaultValue={i18n.language}>
                            {languages.map(({value, label}) => (
                                <Option key={value} value={value}>{label}</Option>))}
                        </Select>
                    </div>
                </Header>
                <Content className='page-content'>{children}</Content>
                <Footer className='page-footer'>
                    <div className='nav-list'>
                        <Row>
                            {footerLinkList.map(item => (
                                <Col className='nav' span={6} key={item.title}>
                                    <div className='nav-title'>{t(item.title)}</div>
                                    <ul className='nav-links'>{(item.links || []).map(link => (
                                        <li className='nav-link' key={link.title}>
                                            <a rel='noopener' target={link.external ? '_blank' : null}
                                               href={link.to}>
                                                <span className='nav-text'>{link.title}</span>
                                                {link.external ? <ExportOutlined className='nav-icon'/> : null}
                                            </a>
                                        </li>
                                    ))}</ul>
                                </Col>
                            ))}
                            <Col style={{textAlign: 'right'}} span={6}>
                                <div className="version">
                                    <span>{`v${version}`}</span>
                                    <span>({commit.slice(0, 7)})</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div
                        className='copyright'>{`Copyright © ${(new Date()).getFullYear()} Advanced Research Lab.`}</div>
                    <div className='mail'>
                        <span className='contact'>{t('contact-with-email')}</span>
                        <a className='mail-link' href='mailto:dev@senka.com.ru'>dev@senka.com.ru</a>
                    </div>
                </Footer>
            </ConfigProvider>
        </XLayout>
    );
}

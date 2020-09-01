import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { LoadingOutlined, ExportOutlined } from '@ant-design/icons'

import Head from 'next/head'
import Router from 'next/router'

import './index.less'

import { Spin, BackTop, Row, Col, Select, Layout, ConfigProvider } from 'antd'

import { i18n, Link, withTranslation } from '../../i18n'

import { languages, lngSource, version, commit, defaultLngSource, footerLinkList } from './config'

const { Option } = Select;
const { Header, Footer, Content } = Layout;

export default withTranslation('common')(class extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            locale: lngSource[i18n.language] || defaultLngSource
        }
    }

    setLocale(lng) {
        i18n.changeLanguage(lng)
            .then(() => this.setState({ locale: lngSource[lng] }));
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', () => this.setState({ loading: true }));
        Router.events.on('routeChangeComplete', () => this.setState({ loading: false }));
        Router.events.on('routeChangeError', () => this.setState({ loading: false }));
    }

    render() {
        const { locale, loading } = this.state;
        const { t, title, children } = this.props;
        return (
            <Layout>
                <Head>
                    <meta charSet='utf-8' />
                    <title>{`Senka Viewer - ${title}`}</title>
                    <meta name='keywords' content='舰队收藏,艦隊これくしょん,艦これ,戦果,KanColle,Rank' />
                    <meta name='description' content={t('description')} />
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <link rel='icon' href='/static/favicon.ico' />
                </Head>
                <ConfigProvider locale={locale}>
                    <BackTop />
                    <Spin spinning={loading} tip={t('loading')} indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }>
                        <div id="d2F0ZXJtYXJrCg" />
                        <Header className='page-header'>
                            <Link href='/'><span className='page-title'>Senka Viewer</span></Link>
                            <div className='language'>
                                <span className='lng'>{t('select-language')}</span>
                                <Select style={{ width: '120px' }} onChange={this.setLocale.bind(this)} defaultValue={i18n.language}>
                                    {languages.map(({ value, label }) => (<Option key={value} value={value}>{label}</Option>))}
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
                                                    <a rel='noopener' target={link.external ? '_blank' : null} href={link.to}>
                                                        <span className='nav-text'>{link.title}</span>
                                                        {link.external ? <ExportOutlined className='nav-icon' /> : null}
                                                    </a>
                                                </li>
                                            ))}</ul>
                                        </Col>
                                    ))}
                                    <Col style={{ textAlign: 'right' }} span={6}>
                                        <div className="version">
                                            <span>{`v${version}`}</span>
                                            <span>(<a rel='noopener' target='_blank' href={`https://github.com/senka-viewer/senka-viewer/commit/${commit}`}>{commit.slice(0, 7)}</a>)</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='copyright'>{`Copyright © ${(new Date()).getFullYear()} Advanced Research Lab.`}</div>
                            <div className='mail'>
                                <span className='contact'>{t('contact-with-email')}</span>
                                <a className='mail-link' href='mailto:dev@senka.com.ru'>dev@senka.com.ru</a>
                            </div>
                        </Footer>
                    </Spin>
                </ConfigProvider>
            </Layout>
        );
    }
})

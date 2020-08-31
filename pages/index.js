import _ from 'lodash'

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import '../assets/index.less'

import { Alert } from 'antd'

import Ajax from '../libs/ajax'
import Layout from '../components/Layout'
import { withTranslation } from '../i18n'

import ServerList from '../components/Index/ServerList'
import ServerRanking from '../components/Index/SeverRanking'

class PageIndex extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired
    };

    static async getInitialProps() {
        const res = (await Ajax.get('/server/list')).data;
        if (_.get(res, 'code') !== 2) {
            throw new Error('数据获取失败');
        }
        const server_list = _.get(res, 'data', []);
        return {
            server_list,
            namespacesRequired: ['server', 'common', 'page-index'],
            status: server_list.length ? 'success' : 'empty',
        };
    }

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render() {
        const now = Date.now();
        const { t, server_list } = this.props;
        return (
            <Layout title={t('page-index')}>
                <Alert
                    showIcon
                    type='info'
                    message={t('notice-message')}
                    description={
                        <div dangerouslySetInnerHTML={{ __html: t('notice-description') }} />
                    } />
                <ServerList now={now} server_list={server_list} />
                <ins className='adsbygoogle'
                     style={{display:'block'}}
                     data-ad-client='ca-pub-9398663705489027'
                     data-ad-slot='3547888536'
                     data-ad-format='auto'
                     data-full-width-responsive='true'
                />
                <ServerRanking now={now} server_list={server_list} />
            </Layout>
        )
    }
}

export default withTranslation('page-index')(PageIndex)

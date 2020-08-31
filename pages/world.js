import _ from 'lodash'
import clz from 'classnames'
import Router from 'next/router'

import { format } from 'date-fns'
import React, { PureComponent } from 'react'
import { Button, Tooltip, Row, Col } from 'antd'

import { ArrowLeftOutlined } from '@ant-design/icons'

import '../assets/world.less'

import Ajax from '../libs/ajax'
import { withTranslation } from '../i18n'
import { needUpdate } from '../libs/utils'

import Layout from '../components/Layout'

import OverviewTable from '../components/World/OverviewTable'
import OverviewGraph from '../components/World/OverviewGraph'
import SenkaRankTable from '../components/World/SenkaRankTable'

class PageWorld extends PureComponent {
    static async getInitialProps({ query }) {
        const world_id = +query.num;
        const res = (await Ajax.get(`/server/${world_id}`)).data;
        if (_.get(res, 'code') !== 2) {
            throw new Error('数据获取失败');
        }
        return {
            world_id,
            namespacesRequired: ['common', 'server', 'page-world'],
            ..._.get(res, 'data', {}),
            players: _.get(res, 'data.players', []).map(player => {
                player.senka.sort((sa, sb) => sb.timestamp - sa.timestamp)
                return {
                    ...player,
                    senka_val: player.senka.length > 0 ? player.senka[0].senka : 0,
                    senka_delta: player.senka.length > 1 ? player.senka[0].senka - player.senka[1].senka : 0
                }
            })
        };
    }

    goBack() {
        Router.back();
    }

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render() {
        const { t, world_id, lastmodifided, cutoff, cutofflist, prediction, players } = this.props;
        const update_time = format(lastmodifided, 'yyyy/MM/dd HH:mm:ss');
        const notUpdate = needUpdate(lastmodifided, Date.now());
        return (
            <Layout title={t(`server:${world_id}`)}>
                <div className="page-world">
                    <Button icon={<ArrowLeftOutlined />} onClick={this.goBack.bind(this)}>{t('page-world:go-back')}</Button>
                    <div className='world-info'>
                        <h1 className='world-name'>{t(`server:${world_id}`)}</h1>
                        <div className='update-time'>
                            <time dateTime={update_time}>{`${t('server:update-at')}${update_time}`}</time>
                            <Tooltip title={notUpdate ? t('server:not-updated') : t('server:has-updated')}>
                                <span className={clz(['status', { 'not-update': notUpdate }])} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className='title'>
                        <div className='main'>{t('page-world:overview-title')}</div>
                        <div className='description'>{t('page-world:overview-description')}</div>
                    </div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <OverviewTable cutoff={cutoff} prediction={prediction} />
                        </Col>
                        <Col span={16}>
                            <OverviewGraph cutofflist={cutofflist} />
                        </Col>
                    </Row>
                    <ins className='adsbygoogle'
                         style={{display:'block'}}
                         data-ad-client='ca-pub-9398663705489027'
                         data-ad-slot='3547888536'
                         data-ad-format='auto'
                         data-full-width-responsive='true'
                    />
                    <div className='title'>
                        <div className='main'>{t('page-world:rank-title')}</div>
                        <div className='description'>{t('page-world:rank-description')}</div>
                    </div>
                    <SenkaRankTable players={players} />
                </div>
            </Layout>
        );
    }
}

export default withTranslation(['server', 'page-world'])(PageWorld)

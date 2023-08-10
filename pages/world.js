import _ from 'lodash'
import qs from 'qs'
import clz from 'classnames'
import * as base64 from 'js-base64'

import {format} from 'date-fns'
import React, {useEffect} from 'react'
import {Button, Tooltip, Row, Col} from 'antd'

import {ArrowLeftOutlined} from '@ant-design/icons'

import Ajax from '../libs/ajax'
import {needUpdate} from '../libs/utils'

import {Layout} from '../components/Layout'

import {OverviewTable} from '../components/World/OverviewTable'
import {OverviewGraph} from '../components/World/OverviewGraph'
import {SenkaRankTable} from '../components/World/SenkaRankTable'
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

const PageWorld = props => {

    const {t} = useTranslation(['server', 'page-world']);

    const router = useRouter();

    const goBack = () => {
        router.push('/');
    }

    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    const {b64data} = props;
    const data = JSON.parse(base64.decode(b64data));
    const {lastmodifided, cutoff, cutofflist, prediction, players} = data;
    const {world_id} = props;
    const update_time = format(lastmodifided, 'yyyy/MM/dd HH:mm:ss');
    const notUpdate = needUpdate(lastmodifided, Date.now());
    return (
        <Layout title={t(`server:${world_id}`)}>
            <div className="page-world">
                <Button icon={<ArrowLeftOutlined/>}
                        onClick={goBack}>{t('page-world:go-back')}</Button>
                <div className='world-info'>
                    <h1 className='world-name'>{t(`server:${world_id}`)}</h1>
                    <div className='update-time'>
                        <time dateTime={update_time}>{`${t('server:update-at')}${update_time}`}</time>
                        <Tooltip title={notUpdate ? t('server:not-updated') : t('server:has-updated')}>
                            <span className={clz(['status', {'not-update': notUpdate}])}/>
                        </Tooltip>
                    </div>
                </div>
                <div className='title'>
                    <div className='main'>{t('page-world:overview-title')}</div>
                    <div className='description'>{t('page-world:overview-description')}</div>
                </div>
                <Row gutter={16}>
                    <Col span={8}>
                        <OverviewTable cutoff={cutoff} prediction={prediction}/>
                    </Col>
                    <Col span={16}>
                        <OverviewGraph cutofflist={cutofflist}/>
                    </Col>
                </Row>
                <ins className='adsbygoogle'
                     style={{display: 'block'}}
                     data-ad-client='ca-pub-9398663705489027'
                     data-ad-slot='3547888536'
                     data-ad-format='auto'
                     data-full-width-responsive='true'
                />
                <div className='title'>
                    <div className='main'>{t('page-world:rank-title')}</div>
                    <div className='description'>{t('page-world:rank-description')}</div>
                </div>
                <SenkaRankTable players={players}/>
            </div>
        </Layout>
    );
}

export const getServerSideProps = async ({req, locale}) => {
    const query = qs.parse(req.url.split('?')[1]);
    const world_id = +query.num;
    const res = (await Ajax.get(`/server/${world_id}`)).data;
    if (_.get(res, 'code') !== 2) {
        throw new Error('数据获取失败');
    }
    const data = {
        ..._.get(res, 'data', {}),
        players: _.get(res, 'data.players', []).map(player => {
            player.senka.sort((sa, sb) => sb.timestamp - sa.timestamp)
            return {
                ...player,
                senka_val: player.senka.length > 0 ? player.senka[0].senka : 0,
                senka_delta: player.senka.length > 1 ? player.senka[0].senka - player.senka[1].senka : 0
            }
        }),
    }
    return {
        props: {
            world_id,
            b64data: base64.encode(JSON.stringify(data)),
            ...(await serverSideTranslations(locale || 'ja', [
                'common', 'server', 'page-world'
            ])),
        }
    }
}

export default PageWorld;
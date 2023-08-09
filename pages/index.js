import _ from 'lodash'

import React, {useEffect} from 'react'

import {Alert} from 'antd'

import Ajax from '../libs/ajax'
import {Layout} from '../components/Layout'

import {ServerList} from '../components/Index/ServerList'
import {ServerRanking} from '../components/Index/SeverRanking'
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const PageIndex = (props) => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    const now = Date.now();
    const {server_list} = props;

    const {t} = useTranslation('page-index');

    return (
        <Layout title={t('page-index')}>
            <Alert
                showIcon
                type='info'
                message={t('notice-message')}
                description={
                    <div dangerouslySetInnerHTML={{__html: t('notice-description')}}/>
                }/>
            <ServerList now={now} server_list={server_list}/>
            <ins className='adsbygoogle'
                 style={{display: 'block'}}
                 data-ad-client='ca-pub-9398663705489027'
                 data-ad-slot='3547888536'
                 data-ad-format='auto'
                 data-full-width-responsive='true'
            />
            <ServerRanking now={now} server_list={server_list}/>
        </Layout>
    )
}

export const getStaticProps = async ({locale}) => {
    const res = (await Ajax.get('/server/list')).data;
    if (_.get(res, 'code') !== 2) {
        throw new Error('数据获取失败');
    }
    const server_list = _.get(res, 'data', []);
    return {
        props: {
            server_list,
            status: server_list.length ? 'success' : 'empty',
            ...(await serverSideTranslations(locale ?? 'ja', [
                'page-index',
                'common',
                'server'
            ])),
        }
    };
}

export default PageIndex;

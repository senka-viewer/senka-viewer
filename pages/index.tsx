import _ from 'lodash'
import * as base64 from 'js-base64'
import React, {useEffect} from 'react'
import {GetServerSideProps} from "next"
import {useTranslation} from "next-i18next"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"

import {Alert} from 'antd'

import Ajax from '../libs/ajax'
import {Layout} from '../components/Layout'

import {ServerList} from '../components/Index/ServerList'
import {ServerRanking} from '../components/Index/SeverRanking'

interface PageIndexProps {
    b64data: string;
}

const PageIndex: React.FC<PageIndexProps> = props => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    const now = Date.now();
    const {b64data} = props;
    const data: { server_list: ServerCutOff[] } = JSON.parse(base64.decode(b64data));
    const {server_list} = data;

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

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
    const res = (await Ajax.get<ServerListResponse>('/server/list')).data;
    if (_.get(res, 'code') !== 2) {
        throw new Error('数据获取失败');
    }
    const server_list = res.data || [];
    return {
        props: {
            b64data: base64.encode(JSON.stringify({server_list})),
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

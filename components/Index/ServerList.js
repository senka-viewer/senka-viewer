import _ from 'lodash'
import React from 'react'
import clz from 'classnames'

import {format} from 'date-fns'
import {Table, Tooltip} from 'antd'

import {needUpdate} from '../../libs/utils'

import {useTranslation} from "next-i18next";
import Link from 'next/link';

const CHUNK_SIZE = 2;

function ServerStatus({t, server, now}) {
    const notUpdate = needUpdate(server.lastmodifided, now);
    return (
        <Tooltip title={notUpdate ? t('not-updated', {ns: 'server'}) : t('has-updated', {ns: 'server'})}>
            <span
                className={clz('server-status', notUpdate ? 'text-warning' : 'text-success')}>{format(server.lastmodifided, 'HH:mm:ss')}</span>
        </Tooltip>
    )
}

export const ServerList = (props) => {
    const { server_list, now } = props;
    const {t} = useTranslation(['page-index', 'server']);
    return (
        <Table
            bordered
            rowKey='key'
            pagination={false}
            className='server-list'
            dataSource={
                _.chunk(server_list, CHUNK_SIZE)
                    .map((chunk, index) => {
                        const ret = {key: index};
                        (chunk || []).forEach((item, idx) => ret[`server${idx}`] = item);
                        return ret;
                    })
            }
            columns={[
                {
                    title: t('server-list', {ns: 'page-index'}),
                    children: (new Array(CHUNK_SIZE))
                        .join(',')
                        .split(',')
                        .map((__, index) => ({
                            title: '--',
                            key: `server${index}`,
                            width: `${100 / CHUNK_SIZE}%`,
                            render(item) {
                                const server = _.get(item, `server${index}`);
                                if (!server) {
                                    return null;
                                }
                                const servernum = _.get(item, `server${index}.servernum`);
                                return (
                                    <div className='server clearfix'>
                                        <Link href={`/world?num=${servernum}`} legacyBehavior={true}>
                                            <a href={`/world?num=${servernum}`}>{`[${_.padStart(servernum, 2, '0')}] ${t(`server:${servernum}`)}`}</a>
                                        </Link>
                                        <ServerStatus t={t} now={now} server={server} />
                                    </div>
                                )
                            }
                        }))
                }
            ]}/>
    )
}

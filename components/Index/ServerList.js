import _ from 'lodash'
import React from 'react'
import clz from 'classnames'

import { format } from 'date-fns'
import { Table, Tooltip } from 'antd'

import { needUpdate } from '../../libs/utils'

import { withTranslation, Link } from '../../i18n'

const CHUNK_SIZE = 2;

function ServerStatus({ t, server, now }) {
    const notUpdate = needUpdate(server.lastmodifided, now);
    return (
        <Tooltip title={notUpdate ? t('server:not-updated') : t('server:has-updated')}>
            <span className={clz('server-status', notUpdate ? 'text-warning' : 'text-success')}>{format(server.lastmodifided, 'HH:mm:ss')}</span>
        </Tooltip>
    )
}

export default withTranslation(['page-index', 'server'])(function ({ t, now, server_list = [] }) {
    return (
        <Table
            bordered
            rowKey='key'
            pagination={false}
            className='server-list'
            dataSource={
                _.chunk(server_list, CHUNK_SIZE)
                    .map((chunk, index) => {
                        const ret = { key: index };
                        (chunk || []).forEach((item, idx) => ret[`server${idx}`] = item);
                        return ret;
                    })
            }
            columns={[
                {
                    title: t('server-list'),
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
                                        <Link href={`/world?num=${servernum}`}>
                                            <a href={`/world?num=${servernum}`}>{`[${_.padStart(servernum, 2, '0')}] ${t(`server:${servernum}`)}`}</a>
                                        </Link>
                                        <ServerStatus t={t} now={now} server={server} />
                                    </div>
                                )
                            }
                        }))
                }
            ]} />
    )
})

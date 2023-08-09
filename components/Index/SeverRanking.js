import _ from 'lodash'
import clz from 'classnames'

import {Table} from 'antd'
import React from 'react'

import {RANKS, needUpdate} from '../../libs/utils'
import {useTranslation} from "next-i18next";

export const ServerRanking = (props) => {
    const {t} = useTranslation(['page-index', 'server']);
    const {now, server_list = []} = props;
    const cpSeverList = [...server_list];
    const topTops = {};
    const bottomTops = {};
    RANKS.forEach(num => {
        cpSeverList.sort((cs1, cs2) => cs1.cutoff[num] - cs2.cutoff[num]);
        topTops[num] = cpSeverList.slice(0, 3).map(d => d.servernum);
        cpSeverList.reverse();
        bottomTops[num] = cpSeverList.slice(0, 3).map(d => d.servernum);
    });
    return (
        <Table
            bordered
            pagination={false}
            rowKey='servernum'
            className='server-ranking'
            dataSource={server_list}
            style={{marginBottom: '50px'}}
            columns={[{
                title: t('server-ranking', {ns: 'page-index'}),
                align: 'center',
                children: [
                    {
                        ellipsis: true,
                        key: 'servernum',
                        title: t('server', {ns: 'server'}),
                        width: `${100 / (RANKS.length + 1)}%`,
                        render(item) {
                            return (
                                <div
                                    className={clz(['cell', needUpdate(item.lastmodifided, now) ? 'text-warning' : 'text-success'])}>{t(`${item.servernum}`, {ns: 'server'})}</div>
                            )
                        }
                    },
                    ...RANKS.map(num => ({
                        key: `cutoff.${num}`,
                        align: 'center',
                        title: t(`top${num}`, {ns: 'server'}),
                        width: `${100 / (RANKS.length + 1)}%`,
                        render(item) {
                            return (
                                <div className={clz(['cell', 'val', {
                                    'bg-success': (topTops[num] || []).includes(item.servernum),
                                    'bg-danger': (bottomTops[num] || []).includes(item.servernum),
                                    'text-bold': (topTops[num] || [])[0] === item.servernum || (bottomTops[num] || [])[0] === item.servernum
                                }])}>{_.get(item, `cutoff.${num}`)}</div>
                            )
                        }
                    }))
                ]
            }]}/>
    );
}

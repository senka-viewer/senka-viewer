import _ from 'lodash'
import clz from 'classnames'
import PropTypes from 'prop-types'

import { Table } from 'antd'
import React, { PureComponent } from 'react'

import { withTranslation } from '../../i18n'
import { RANKS, needUpdate } from '../../libs/utils'

export default withTranslation(['server', 'page-index'])(class ServerRanking extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        now: PropTypes.number.isRequired,
        server_list: PropTypes.array.isRequired
    };

    render() {
        const { t, now, server_list = [] } = this.props;
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
                style={{ marginBottom: '50px' }}
                columns={[{
                    title: t('page-index:server-ranking'),
                    align: 'center',
                    children: [
                        {
                            ellipsis: true,
                            key: 'servernum',
                            title: t('server:server'),
                            width: `${100 / (RANKS.length + 1)}%`,
                            render(item) {
                                return (
                                    <div className={clz(['cell', needUpdate(item.lastmodifided, now) ? 'text-warning' : 'text-success'])}>{t(`server:${item.servernum}`)}</div>
                                )
                            }
                        },
                        ...RANKS.map(num => ({
                            key: `cutoff.${num}`,
                            align: 'center',
                            title: t(`server:top${num}`),
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
                }]} />
        );
    }
})

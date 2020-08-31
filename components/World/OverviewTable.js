import React from 'react'
import PropTypes from 'prop-types'

import { Table } from 'antd'

import { RANKS } from '../../libs/utils'
import { withTranslation } from '../../i18n'

function OverviewTable({ t, cutoff, prediction }) {
    return (
        <Table
            bordered
            pagination={false}
            rowKey='cutoffName'
            dataSource={RANKS.map(num => ({
                cutoffName: t(`server:top${num}`),
                cutoffValue: cutoff[num],
                predictValue: prediction && (prediction[num] && prediction[num][1] !== -1) ? prediction[num][1] : '--'
            }))}
            columns={[{
                width: '30%',
                align: 'center',
                dataIndex: 'cutoffName'
            }, {
                width: '30%',
                align: 'center',
                dataIndex: 'cutoffValue',
                title: t('page-world:senka')
            }, {
                width: '30%',
                align: 'center',
                dataIndex: 'predictValue',
                title: t('page-world:prediction')
            }]} />
    )
}

OverviewTable.propTypes = {
    t: PropTypes.func.isRequired,
    cutoff: PropTypes.object.isRequired,
    prediction: PropTypes.object
};

export default withTranslation(['server', 'page-world'])(OverviewTable)


import React from 'react'

import {Table} from 'antd'

import {RANKS} from '../../libs/utils'
import {useTranslation} from "next-i18next";

interface OverviewTableProps {
    cutoff: CutOff;
    prediction: Prediction;
}

export const OverviewTable: React.FC<OverviewTableProps> = ({cutoff, prediction}) => {
    const {t} = useTranslation('server');
    return (
        <Table
            bordered
            pagination={false}
            rowKey='cutoffName'
            dataSource={RANKS.map(num => ({
                cutoffName: t(`top${num}`),
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
            }]}/>
    )
}

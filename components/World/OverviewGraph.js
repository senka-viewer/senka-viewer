import _ from 'lodash'

import {Skeleton} from 'antd'
import {format} from 'date-fns'
import React, {useEffect, useState} from 'react'

import echarts from 'echarts/lib/echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'

import {dataZoomIcon, RANKS} from '../../libs/utils'
import {useTranslation} from "next-i18next";

export const OverviewGraph = props => {
    const {t} = useTranslation('server');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const getOptions = () => {
        const {cutofflist} = props;
        let minV = Infinity;
        let maxV = -Infinity;
        const cutoffLength = cutofflist.length;
        const dataList = [];
        const cutoffData = {
            1: [],
            5: [],
            20: [],
            100: [],
            500: []
        };
        for (let i = 0, len = cutofflist.length; i < len; i++) {
            const _cutoff = cutofflist[i];
            const {timestamp, cutoff} = _cutoff;
            Object.keys(cutoff).forEach(num => {
                const val = cutoff[num];
                maxV = Math.max(maxV, val);
                minV = Math.min(minV, val);
                cutoffData[num].push([timestamp, val]);
            })
        }
        Object.keys(cutoffData).forEach(num => {
            const data = cutoffData[num];
            const rankName = t(`server:top${num}`);
            dataList.push({
                name: rankName,
                type: 'line',
                data: data,
                lineStyle: {
                    type: 'dashed',
                    width: 1.5
                }
            })
        });
        let revealPercent = 0;
        if (cutoffLength > 10) {
            revealPercent = 30
        } else if (cutoffLength > 20) {
            revealPercent = 50
        } else if (cutoffLength > 30) {
            revealPercent = 70
        } else if (cutoffLength > 40) {
            revealPercent = 80
        }
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        formatter(param) {
                            if (!param.seriesData.length) {
                                return _.chunk(param.value.toFixed(0).split('').reverse(), 3).map(chunk => chunk.reverse().join('')).reverse().join(',')
                            }
                            return `${format(param.value, 'MM/dd')}\r\n${format(param.value, 'HH:mm')}`
                        }
                    }
                }
            },
            legend: {
                top: '15px',
                data: RANKS.map(num => t(`server:top${num}`))
            },
            grid: {
                top: '50px',
                left: '20px',
                right: '30px',
                bottom: '40px',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                start: revealPercent,
                end: 100
            }, {
                start: revealPercent,
                end: 100,
                handleIcon: dataZoomIcon,
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter(timestamp) {
                        return format(timestamp, 'MM/dd')
                    }
                }
            },
            yAxis: {
                type: 'value',
                max: maxV,
                min: minV
            },
            series: dataList
        }
    }

    const {cutofflist = []} = props;
    return (
        <Skeleton
            paragraph={{rows: 7}}
            className='overview-graph-skeleton'
            loading={loading || !cutofflist.length}>
            <ReactEchartsCore
                notMerge
                lazyUpdate
                echarts={echarts}
                option={getOptions()}
                style={{height: '325px'}}
                className='overview-graph'
            />
        </Skeleton>
    )
}

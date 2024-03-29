import _ from 'lodash'
import {format} from 'date-fns'
import {EChartsOption} from "echarts"
import {useTranslation} from "next-i18next"
import React, {useEffect, useRef, useState} from 'react'

import EChartsReact from 'echarts-for-react'

import {Button} from 'antd'
import {LineChartOutlined, BarChartOutlined} from '@ant-design/icons'

import {colorsMap} from '../../../libs/utils'


const ButtonGroup = Button.Group;

// 图表类型
const K_CHART_TYPE = {
    // 柱状图
    BAR_CHART: 1,
    // 折线图
    LINE_CHART: 2
};

const ChartTypes = {
    [K_CHART_TYPE.BAR_CHART]: 'bar-chart',
    [K_CHART_TYPE.LINE_CHART]: 'line-chart'
};

interface ChartProps {
    players: Player[]
}

export const Chart: React.FC<ChartProps> = props => {
    const {t} = useTranslation('page-world');
    const [chartType, setChartType] = useState(K_CHART_TYPE.LINE_CHART);
    const ref = useRef(null);

    const getBarChartOption = (): EChartsOption => {
        const {players} = props;
        const dataList = [];
        let maxV = -Infinity;
        let minV = Infinity;
        for (let i = 0, len = players.length; i < len; i++) {
            const playerName = players[i].name;
            const pSenka = players[i].senka;
            const pSLen = pSenka.length;
            const color = colorsMap[players[i].color];
            const pdata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let j = pSLen - 1; j >= 0; j--) {
                if (j !== pSLen - 1) {
                    const dv = pSenka[j].senka - pSenka[j + 1].senka;
                    const tsidx = Math.floor(dv / 40);
                    const sidx = tsidx > 10 ? 10 : tsidx;
                    pdata[sidx]++;
                    maxV = Math.max(maxV, pdata[sidx]);
                    minV = Math.min(minV, pdata[sidx]);
                }
            }
            dataList.push({
                name: playerName,
                type: 'bar',
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: color
                    }
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: color
                    }
                },
                data: pdata
            })
        }
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                top: '15px',
                left: '0%',
                right: '20px',
                bottom: '15px',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [
                    '0 ~ 39', '40 ~ 79', '80 ~ 119', '120 ~ 159', '160 ~ 199', '200 ~ 239',
                    '240 ~ 279', '280 ~ 319', '320 ~ 359', '360 ~ 399', '400 ~ ?'
                ]
            },
            yAxis: {
                type: 'value',
                max: maxV + 1
            },
            series: dataList
        }
    }

    const getLineChartOption = (): EChartsOption => {
        const {players} = props;
        const dateList = [];
        const dataList = [];
        let maxV = -Infinity;
        let minV = Infinity;
        for (let i = 0, len = players.length; i < len; i++) {
            for (let j = 0, lenj = players[i]['senka'].length; j < lenj; j++) {
                maxV = Math.max(maxV, players[i]['senka'][j].senka);
                minV = Math.min(minV, players[i]['senka'][j].senka);
                if (!dateList.includes(players[i]['senka'][j].timestamp)) {
                    dateList.push(players[i]['senka'][j].timestamp);
                }
            }
        }
        dateList.sort((da, db) => da - db);
        let revealPercent = 0;
        const senkaLength = players[0].senka.length;
        if (senkaLength > 10) {
            revealPercent = 30
        } else if (senkaLength > 20) {
            revealPercent = 50
        } else if (senkaLength > 30) {
            revealPercent = 70
        } else if (senkaLength > 40) {
            revealPercent = 80
        }
        for (let i = 0, len = players.length; i < len; i++) {
            const playerName = players[i].name;
            const pSenka = players[i].senka;
            const color = colorsMap[players[i].color];
            const data = dateList.reduce((dd, time) => {
                const dt = pSenka.find(ps => ps.timestamp === time);
                if (dt) {
                    dd.push([dt.timestamp, dt.senka])
                }
                return dd
            }, []);
            dataList.push({
                name: playerName,
                type: 'line',
                symbolSize: 8,
                itemStyle: {
                    normal: {
                        color: color
                    }
                },
                lineStyle: {
                    color: color
                },
                data: data
            })
        }
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        formatter(param) {
                            if (!param.seriesData.length) {
                                return _.chunk((param.value as number).toFixed(0).split('').reverse(), 3).map(chunk => chunk.reverse().join('')).reverse().join(',')
                            }
                            return `${format(param.value as number, 'MM/dd')}\r\n${format(param.value as number, 'HH:mm')}`
                        }
                    }
                }
            },
            grid: {
                top: '15px',
                left: '0%',
                right: '20px',
                bottom: '45px',
                containLabel: true
            },
            dataZoom: [{
                type: 'inside',
                start: revealPercent,
                end: 100
            }, {
                start: revealPercent,
                end: 100,
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
                max: maxV + 10,
                min: minV
            },
            series: dataList
        }
    }

    const getChartOption = () => {
        return chartType === K_CHART_TYPE.BAR_CHART ? getBarChartOption() : getLineChartOption();
    }

    useEffect(() => {
        ref.current?.getEchartsInstance().resize();
    }, []);

    return (
        <div className='player-chart'>
            <div className='header'>
                <div className="button-group">
                    <ButtonGroup>
                        <Button icon={<LineChartOutlined/>}
                                type={chartType === K_CHART_TYPE.LINE_CHART ? 'primary' : 'default'}
                                onClick={() => setChartType(K_CHART_TYPE.LINE_CHART)}/>
                        <Button icon={<BarChartOutlined/>}
                                type={chartType === K_CHART_TYPE.BAR_CHART ? 'primary' : 'default'}
                                onClick={() => setChartType(K_CHART_TYPE.BAR_CHART)}/>
                    </ButtonGroup>
                </div>
                <div className="description">{t(`${ChartTypes[chartType]}-description`)}</div>
            </div>
            <div className="content">
                <EChartsReact
                    notMerge
                    lazyUpdate
                    ref={ref}
                    style={{height: '100%', width: '100%'}}
                    opts={{height: 'auto', width: 'auto'}}
                    className='rank-graph'
                    option={getChartOption()}
                />
            </div>
        </div>
    );
}

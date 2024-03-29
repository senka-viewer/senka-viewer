import {format} from 'date-fns'
import {EChartsOption} from "echarts"
import React, {useState, useEffect, useRef} from 'react'

import {Modal, Button} from 'antd'
import {
    FastBackwardOutlined,
    StepBackwardOutlined,
    PauseOutlined,
    CaretRightOutlined,
    StepForwardOutlined,
    FastForwardOutlined
} from '@ant-design/icons'

import EChartsReact from 'echarts-for-react'

import {colorsMap} from '../../../libs/utils'

const ButtonGroup = Button.Group;

const ANIMATION_INTERVAL = 500;

let timer = null;

interface RacingProps {
    players: Player[];
    onClose: () => void
}

export const Racing: React.FC<RacingProps> = props => {
    const senkaHistory = {};
    const players = props.players.reduce((acc, player) => {
        acc[player.rankno] = {
            key: player.rankno,
            name: player.name,
            color: colorsMap[player.color]
        };
        player.senka.forEach(s => {
            if (!senkaHistory[s.timestamp]) {
                senkaHistory[s.timestamp] = []
            }
            senkaHistory[s.timestamp].push({
                key: player.rankno,
                val: s.senka,
            })
        });
        return acc
    }, {});
    Object.keys(senkaHistory)
        .forEach(time => senkaHistory[time]
            .sort((ha: { val: number }, hb: { val: number }) => hb.val - ha.val));
    const timeStamps = Object.keys(senkaHistory).map(ts => +ts);
    timeStamps.sort();

    const ref = useRef<EChartsReact>();
    const [idx, setIdx] = useState(0);
    const [play, setPlay] = useState(false);
    const [visible, setVisible] = useState(true);

    const onCancel = () => {
        clearTimer();
        setVisible(false);
    }

    const clearTimer = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null
        }
    }

    const handleSetCur = (i: number, s = false) => {
        if (i < 0 || i >= timeStamps.length) {
            return false
        }
        setIdx(i);
        if (s) {
            setPlay(false);
        }
        const item = document.getElementById(`racing-id-${i}`);
        if (item && item.parentElement && item.scrollTo) {
            item.parentElement.scrollTo({
                left: Math.max(0, item.offsetLeft - item.clientWidth * 5),
                behavior: 'smooth',
            })
        }
        return true
    }

    const handlePlay = (i: number) => {
        let ok = handleSetCur(i + 1);
        if (!ok) {
            setPlay(false);
            return
        }
        timer = setTimeout(() => {
            clearTimer();
            handlePlay(i + 1);
        }, ANIMATION_INTERVAL)
    }

    const handlePlayControl = () => {
        if (!play) {
            setPlay(true);
            handlePlay(idx);
        } else {
            setPlay(false);
        }
    }

    const renderHistoryLabels = () => {
        const cur = timeStamps[idx];
        return timeStamps.map((t, i) => (
            <Button
                key={t}
                id={`racing-id-${i}`}
                type={t === cur ? 'primary' : 'default'}
                onClick={() => handleSetCur(i)}
            >{format(t, 'MM/dd HH:00')}</Button>
        ))
    }

    useEffect(() => {
        if (!play && timer) {
            clearTimer();
        }
    }, [play]);

    useEffect(() => {
        if (!visible && timer) {
            clearTimer();
        }
    }, [visible]);

    useEffect(() => {
        ref.current?.getEchartsInstance().resize();
    }, []);

    const getOption = (): EChartsOption => {
        const cur = timeStamps[idx];
        const _history = senkaHistory[cur];
        if (!_history || !_history.length) {
            return {}
        }
        const minV = Math.floor(_history[_history.length - 1].val / 2);
        const maxV = _history[0].val + 10;
        return {
            grid: {
                top: '15px',
                left: '20px',
                right: '20px',
                bottom: '15px',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                min: minV,
                max: maxV,
            },
            yAxis: {
                type: 'category',
                data: ['']
            },
            series: _history.map((h: { key: string, val: number }) => ({
                name: players[h.key].name,
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: players[h.key].color
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight',
                        formatter(series: {
                            seriesName: string
                        }) {
                            return series.seriesName
                        }
                    }
                },
                data: [h.val]
            }))
        }
    }

    const option = getOption();
    return (
        <Modal
            width='90vw'
            className='senka-racing-modal'
            footer={null}
            open={visible}
            afterClose={props.onClose}
            onCancel={onCancel}>
            <div className="modal-wrapper">
                <div id="play-tools">
                    <ButtonGroup className="history-list">
                        <Button icon={<FastBackwardOutlined/>} onClick={() => handleSetCur(0, true)}/>
                        <Button icon={<StepBackwardOutlined/>} onClick={() => handleSetCur(idx - 1, true)}/>
                        <Button icon={play ? <PauseOutlined/> : <CaretRightOutlined/>}
                                onClick={() => handlePlayControl()}/>
                        <Button icon={<StepForwardOutlined/>} onClick={() => handleSetCur(idx + 1, true)}/>
                        <Button icon={<FastForwardOutlined/>}
                                onClick={() => handleSetCur(timeStamps.length - 1, true)}/>
                    </ButtonGroup>
                </div>
                <div id='history'>
                    <ButtonGroup className="history-list">
                        {renderHistoryLabels()}
                    </ButtonGroup>
                </div>
                <EChartsReact
                    className='history-graph'
                    option={option}
                    ref={ref}
                    style={{height: '100%', width: '100%'}}
                    opts={{height: 'auto', width: 'auto'}}
                    notMerge={true}
                    lazyUpdate={true}/>
            </div>
        </Modal>
    )
}

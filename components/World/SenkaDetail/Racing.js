import _ from 'lodash'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { Modal, Button } from 'antd'
import { FastBackwardOutlined, StepBackwardOutlined, PauseOutlined, CaretRightOutlined, StepForwardOutlined, FastForwardOutlined } from '@ant-design/icons'

import echarts from 'echarts/lib/echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'

import { colorsMap } from '../../../libs/utils'

const ButtonGroup = Button.Group;

const ANIMATION_INTERVAL = 500;

export default class extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        players: PropTypes.array.isRequired,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.senkaHistory = {};
        this.players = props.players.reduce((acc, player) => {
            acc[player.rankno] = {
                key: player.rankno,
                name: player.name,
                color: colorsMap[player.color]
            };
            player.senka.forEach(s => {
                if (!this.senkaHistory[s.timestamp]) {
                    this.senkaHistory[s.timestamp] = []
                }
                this.senkaHistory[s.timestamp].push({
                    key: player.rankno,
                    val: s.senka,
                })
            });
            return acc
        }, {});
        Object.keys(this.senkaHistory)
            .forEach(time => this.senkaHistory[time]
                .sort((ha, hb) => hb.val - ha.val));
        this.timeStamps = Object.keys(this.senkaHistory).map(ts => +ts);
        this.timeStamps.sort();
        this.timer = null;
        this.state = {
            idx: 0,
            play: false,
            visible: true,
        }
    }

    onCancel() {
        this.setState({ visible: false })
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null
        }
    }

    handleSetCur(i, s = false) {
        if (i < 0 || i >= this.timeStamps.length) {
            return false
        }
        const patch = {
            idx: i
        };
        if (s) {
            patch.play = false
        }
        this.setState(patch, () => {
            const item = document.getElementById(`racing-id-${i}`);
            if (item && item.parentElement && item.scrollTo) {
                item.parentElement.scrollTo({
                    left: Math.max(0, item.offsetLeft - item.clientWidth * 5),
                    behavior: 'smooth',
                })
            }
        });
        return true
    }

    handlePlay(i) {
        let ok = this.handleSetCur(i + 1);
        if (!ok) {
            this.setState({ play: false });
            return
        }
        this.timer = setTimeout(() => {
            this.clearTimer();
            this.handlePlay(i + 1)
        }, ANIMATION_INTERVAL)
    }

    handlePlayControl() {
        if (!this.state.play) {
            this.setState({
                play: true
            }, () => {
                this.handlePlay(this.state.idx)
            })
        } else {
            this.setState({
                play: false
            })
        }
    }

    renderHistoryLabels() {
        const { idx } = this.state;
        const cur = this.timeStamps[idx];
        return this.timeStamps.map((t, i) => (
            <Button
                key={t}
                id={`racing-id-${i}`}
                type={t === cur ? 'primary' : 'default'}
                onClick={this.handleSetCur.bind(this, i)}
            >{format(t, 'MM/dd HH:00')}</Button>
        ))
    }

    componentDidUpdate() {
        if (!this.state.play && this.timer) {
            this.clearTimer()
        }
    }

    componentWillUnmount() {
        this.clearTimer()
    }

    getOption() {
        const { idx } = this.state;
        const cur = this.timeStamps[idx];
        const _history = this.senkaHistory[cur];
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
            series: _history.map(h => ({
                name: this.players[h.key].name,
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: this.players[h.key].color
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight',
                        formatter(series) {
                            return series.seriesName
                        }
                    }
                },
                data: [h.val]
            }))
        }
    }

    render() {
        const { idx, play, visible } = this.state;
        const option = this.getOption();
        return (
            <Modal
                width='90vw'
                className='senka-racing-modal'
                footer={null}
                visible={visible}
                afterClose={this.props.onClose}
                onCancel={this.onCancel.bind(this)}>
                <div className="modal-wrapper">
                    <div id="play-tools">
                        <ButtonGroup className="history-list">
                            <Button icon={<FastBackwardOutlined />} onClick={this.handleSetCur.bind(this, 0, true)} />
                            <Button icon={<StepBackwardOutlined />} onClick={this.handleSetCur.bind(this, idx - 1, true)} />
                            <Button icon={play ? <PauseOutlined /> : <CaretRightOutlined />} onClick={this.handlePlayControl.bind(this)} />
                            <Button icon={<StepForwardOutlined />} onClick={this.handleSetCur.bind(this, idx + 1, true)} />
                            <Button icon={<FastForwardOutlined />} onClick={this.handleSetCur.bind(this, this.timeStamps.length - 1, true)} />
                        </ButtonGroup>
                    </div>
                    <div id='history'>
                        <ButtonGroup className="history-list">
                            {this.renderHistoryLabels()}
                        </ButtonGroup>
                    </div>
                    <ReactEchartsCore
                        className='history-graph'
                        echarts={echarts}
                        option={option}
                        notMerge={true}
                        lazyUpdate={true} />
                </div>
            </Modal>
        )
    }
}

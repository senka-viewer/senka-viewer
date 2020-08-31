import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { Modal, Row, Col, Button } from 'antd'
import { LineChartOutlined, RetweetOutlined, VerticalLeftOutlined, VerticalRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'

import './index.less'

import { withTranslation } from '../../../i18n'
import { colors, colorsMap } from '../../../libs/utils'

import Chart from './Chart'
import Racing from './Racing';

const PLAYER_PAGE_SIZE = 10;
const MAX_SELECT_LIMIT = colors.length - 1;

const ButtonGroup = Button.Group;

export default withTranslation('page-world')(class extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        players: PropTypes.array.isRequired,
        playerNo: PropTypes.number.isRequired,
        afterClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const colorIdx = 0;
        const playersMap = props.players.reduce((ret, player) => {
            ret[player.rankno] = player;
            return ret;
        }, {});
        this.state = {
            colorIdx,
            visible: true,
            showRacing: false,
            selectedPlayersMap: {},

            playersMap,
            selectedPlayer: {
                index: colorIdx,
                color: colors[colorIdx],
                ...playersMap[props.playerNo] || {}
            },

            totalPage: Math.ceil(props.players.length / PLAYER_PAGE_SIZE),
            currentPage: Math.ceil((props.players.findIndex(({ rankno }) => rankno === props.playerNo) + 1) / PLAYER_PAGE_SIZE)
        }
    }

    onCancel() {
        this.setState({ visible: false })
    }

    setRacing(showRacing) {
        this.setState({ showRacing })
    }

    setCurrentPage(page) {
        this.setState({ currentPage: page })
    }

    setPlayerSelectState({ rankno }) {
        let { playersMap, selectedPlayersMap, colorIdx } = this.state;
        if (selectedPlayersMap[rankno]) {
            colorIdx--;
            delete selectedPlayersMap[rankno]
        } else {
            colorIdx++;
            selectedPlayersMap[rankno] = {
                index: colorIdx,
                color: colors[colorIdx],
                ...playersMap[rankno],
            }
        }
        this.setState({ colorIdx, selectedPlayersMap: { ...selectedPlayersMap } })
    }

    clearPlayerSelectState() {
        this.setState({ colorIdx: 0, selectedPlayersMap: {} })
    }

    isPlayerSelected({ rankno }) {
        return this.props.playerNo === rankno || !!this.state.selectedPlayersMap[rankno];
    }

    isPlayerDisabled({ rankno }) {
        if (this.props.playerNo === rankno) {
            return true;
        }
        if (!!this.state.selectedPlayersMap[rankno]) {
            return false;
        }
        return Object.keys(this.state.selectedPlayersMap).length >= MAX_SELECT_LIMIT;
    }

    getPlayerColor({ rankno }) {
        if (this.props.playerNo === rankno) {
            return colorsMap[this.state.selectedPlayer.color];
        }
        if (this.state.selectedPlayersMap[rankno]) {
            return colorsMap[this.state.selectedPlayersMap[rankno].color];
        }
        return '#fff';
    }

    render() {
        const { t, players } = this.props;
        const { visible, showRacing, playersMap, selectedPlayer, selectedPlayersMap, currentPage, totalPage } = this.state;
        const allPlayers = [selectedPlayer].concat(Object.keys(selectedPlayersMap).map(rankno => playersMap[rankno]));
        return (
            <Modal
                centered
                width='90vw'
                className='senka-detail-modal'
                footer={null}
                visible={visible}
                afterClose={this.props.afterClose}
                onCancel={this.onCancel.bind(this)}
                title={
                    <>
                        <LineChartOutlined />
                        <span style={{ marginLeft: '10px' }}>{`${t('senka-detail')} - ${selectedPlayer.name || ''}`}</span>
                    </>
                }
            >
                <div className="modal-wrapper">
                    <Row gutter={10}>
                        <Col span={16}>
                            <Chart players={allPlayers} />
                        </Col>
                        <Col span={8}>
                            <div className='player-info'>
                                <div className="title">{t('senka-select-others')}</div>
                                <div className="description">
                                    <span>{`${t('senka-select-others-description')}(${Object.keys(selectedPlayersMap).length}/${MAX_SELECT_LIMIT})`}</span>
                                    <span className='btn-clear text-danger' onClick={this.clearPlayerSelectState.bind(this)}>[{t('clear')}]</span>
                                </div>
                            </div>
                            <div style={{ margin: '0.5em 0' }}>
                                <ButtonGroup>
                                    <Button disabled={currentPage <= 1} icon={<VerticalLeftOutlined />} onClick={this.setCurrentPage.bind(this, 1)} />
                                    <Button disabled={currentPage <= 1} icon={<LeftOutlined />} onClick={this.setCurrentPage.bind(this, currentPage - 1)} />
                                    <Button>{`${_.padStart(currentPage, 2, 0)}/${_.padStart(totalPage, 2, 0)}`}</Button>
                                    <Button disabled={currentPage >= totalPage} icon={<RightOutlined />} onClick={this.setCurrentPage.bind(this, currentPage + 1)} />
                                    <Button disabled={currentPage >= totalPage} icon={<VerticalRightOutlined />} onClick={this.setCurrentPage.bind(this, totalPage)} />
                                </ButtonGroup>
                                {Object.keys(selectedPlayersMap).length > 0 ? <Button style={{ marginLeft: '0.5em' }} onClick={this.setRacing.bind(this, true)} icon={<RetweetOutlined />} /> : null}
                                {showRacing ? <Racing visible={showRacing} players={allPlayers} onClose={this.setRacing.bind(this, false)} /> : null}
                            </div>
                            <div className="player-list">
                                {players
                                    .slice((currentPage - 1) * PLAYER_PAGE_SIZE, currentPage * PLAYER_PAGE_SIZE)
                                    .map(player => (
                                        <Button
                                            block
                                            className='button'
                                            key={player.rankno}
                                            disabled={this.isPlayerDisabled(player)}
                                            type={this.isPlayerSelected(player) ? 'default' : 'dashed'}
                                            onClick={() => this.setPlayerSelectState(player)}
                                        >
                                            <span className='checked' style={{ backgroundColor: this.getPlayerColor(player) }} />
                                            <span>{`${t('tetoku')}: ${player.name}, ${t('senka')}: ${player.senka_val}`}</span>
                                        </Button>
                                    ))}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
})

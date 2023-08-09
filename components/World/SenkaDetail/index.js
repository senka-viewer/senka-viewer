import _ from 'lodash'
import React, {useState} from 'react'

import { Modal, Row, Col, Button } from 'antd'
import { LineChartOutlined, RetweetOutlined, VerticalLeftOutlined, VerticalRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'

import { colors, colorsMap } from '../../../libs/utils'

import {Chart} from './Chart'
import {Racing} from './Racing';
import {useTranslation} from "next-i18next";

const PLAYER_PAGE_SIZE = 10;
const MAX_SELECT_LIMIT = colors.length - 1;

const ButtonGroup = Button.Group;

export const SenkaDetail = props => {
    const {t} = useTranslation('page-world');

    const _colorIdx = 0;
    const _playersMap = props.players.reduce((ret, player) => {
        ret[player.rankno] = player;
        return ret;
    }, {});

    const [colorIdx, setColorIdx] = useState(_colorIdx);
    const [visible, setVisible] = useState(true);
    const [showRacing, setRacing] = useState(false);
    const [selectedPlayersMap, setSelectedPlayersMap] = useState({});
    const [playersMap, setPlayersMap] = useState(_playersMap);
    const [selectedPlayer, setSelectedPlayer] = useState({
        index: _colorIdx,
        color: colors[_colorIdx],
        ...playersMap[props.playerNo] || {}
    })
    const [totalPage, setTotalPage] = useState(Math.ceil(props.players.length / PLAYER_PAGE_SIZE));
    const [currentPage, setCurrentPage] = useState(Math.ceil((props.players.findIndex(({ rankno }) => rankno === props.playerNo) + 1) / PLAYER_PAGE_SIZE));

    const onCancel = () => {
        setVisible(false);
    }

    const setPlayerSelectState = ({ rankno }) => {
        if (selectedPlayersMap[rankno]) {
            setColorIdx(colorIdx - 1);
            delete selectedPlayersMap[rankno]
        } else {
            const cid = colorIdx + 1;
            setColorIdx(cid);
            selectedPlayersMap[rankno] = {
                index: cid,
                color: colors[cid],
                ...playersMap[rankno],
            }
        }
        setSelectedPlayersMap({ ...selectedPlayersMap });
    }

    const clearPlayerSelectState = () => {
        setColorIdx(0);
        setSelectedPlayersMap({});
    }

    const isPlayerSelected = ({ rankno }) => {
        return props.playerNo === rankno || !!selectedPlayersMap[rankno];
    }

    const isPlayerDisabled = ({ rankno }) => {
        if (props.playerNo === rankno) {
            return true;
        }
        if (!!selectedPlayersMap[rankno]) {
            return false;
        }
        return Object.keys(selectedPlayersMap).length >= MAX_SELECT_LIMIT;
    }

    const getPlayerColor = ({ rankno }) => {
        if (props.playerNo === rankno) {
            return colorsMap[selectedPlayer.color];
        }
        if (selectedPlayersMap[rankno]) {
            return colorsMap[selectedPlayersMap[rankno].color];
        }
        return '#fff';
    }

    const allPlayers = [selectedPlayer].concat(Object.keys(selectedPlayersMap).map(rankno => playersMap[rankno]));
    return (
        <Modal
            centered
            width='90vw'
            className='senka-detail-modal'
            footer={null}
            open={visible}
            afterClose={props.afterClose}
            onCancel={onCancel}
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
                                <span className='btn-clear text-danger' onClick={clearPlayerSelectState}>[{t('clear')}]</span>
                            </div>
                        </div>
                        <div style={{ margin: '0.5em 0' }}>
                            <ButtonGroup>
                                <Button disabled={currentPage <= 1} icon={<VerticalLeftOutlined />} onClick={() => setCurrentPage(1)} />
                                <Button disabled={currentPage <= 1} icon={<LeftOutlined />} onClick={() => setCurrentPage(currentPage - 1)} />
                                <Button>{`${_.padStart(currentPage, 2, 0)}/${_.padStart(totalPage, 2, 0)}`}</Button>
                                <Button disabled={currentPage >= totalPage} icon={<RightOutlined />} onClick={() => setCurrentPage.bind(currentPage + 1)} />
                                <Button disabled={currentPage >= totalPage} icon={<VerticalRightOutlined />} onClick={() => setCurrentPage(totalPage)} />
                            </ButtonGroup>
                            {Object.keys(selectedPlayersMap).length > 0 ? <Button style={{ marginLeft: '0.5em' }} onClick={() => setRacing(true)} icon={<RetweetOutlined />} /> : null}
                            {showRacing ? <Racing visible={showRacing} players={allPlayers} onClose={() => setRacing(false)} /> : null}
                        </div>
                        <div className="player-list">
                            {props.players
                                .slice((currentPage - 1) * PLAYER_PAGE_SIZE, currentPage * PLAYER_PAGE_SIZE)
                                .map(player => (
                                    <Button
                                        block
                                        className='button'
                                        key={player.rankno}
                                        disabled={isPlayerDisabled(player)}
                                        type={isPlayerSelected(player) ? 'default' : 'dashed'}
                                        onClick={() => setPlayerSelectState(player)}
                                    >
                                        <span className='checked' style={{ backgroundColor: getPlayerColor(player) }} />
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


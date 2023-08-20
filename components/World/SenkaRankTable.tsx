import _ from 'lodash'
import clz from 'classnames'
import React, {useState} from 'react'
import {useTranslation} from "next-i18next";

import {Table, Select} from 'antd'

import {SenkaDetail} from './SenkaDetail'


const {Option} = Select;

interface SenkaRankTableProps {
    players: Player[];
}

export const SenkaRankTable: React.FC<SenkaRankTableProps> = props => {
    const {players} = props;
    const {t} = useTranslation('page-world');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRow, _setSelectedRow] = useState(-1);
    const [highlightNotes, _setHighlightNotes] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPlayerNo, setModalPlayerNo] = useState(-1);
    const openDetail = (playerNo: number) => {
        setModalVisible(true);
        setModalPlayerNo(playerNo);
    }

    const closeDetail = () => {
        setModalVisible(false);
        setModalPlayerNo(-1);
    }

    const setHighLightNotes = (...notes: string[]) => {
        _setHighlightNotes(notes || []);
    }

    const setSelectedRow = (value: number | undefined) => {
        _setSelectedRow(value);
        const element = document.querySelector(`[data-row-key="${value}"]`);
        if (element && element.scrollIntoView) {
            element.scrollIntoView();
        }
        if (typeof value !== 'undefined') {
            setCurrentPage(Math.ceil((_.findIndex(props.players, player => player.rankno === value) + 1) / 20));
        }

    }

    return (
        <>
            {modalVisible ? <SenkaDetail players={players} playerNo={modalPlayerNo}
                                         afterClose={closeDetail}/> : null}
            <Table
                bordered
                rowKey='rankno'
                dataSource={players}
                className='senka-ranking'
                rowClassName={item => selectedRow === item.rankno ? 'highlight' : ''}
                pagination={{
                    pageSize: 20,
                    position: 'top' as any,
                    current: currentPage,
                    onChange: current => setCurrentPage(current)
                }}
                title={() => (
                    <>
                        <Select
                            showSearch
                            allowClear
                            onChange={value => setSelectedRow(value)}
                            style={{marginRight: '10px', width: '250px'}}
                            placeholder={t('page-world:search-placeholder')}
                            filterOption={(input, option) => option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {players.map(player => (
                                <Option key={player.rankno} label={player.name} value={player.rankno}>
                                    <span style={{marginRight: '5px'}}>{player.name}</span>
                                    <sup className='text-info'>{`(No. ${player.rankno})`}</sup>
                                </Option>
                            ))}
                        </Select>
                    </>
                )}
                footer={() => {
                    const _highlightNotes = (highlightNotes || [])
                        .reduce((ret, item) => {
                            ret[item] = true;
                            return ret;
                        }, {});
                    return (
                        <div className='footer'>
                            <p className={clz({highlight: _highlightNotes['note1']})}>
                                    <span id='note1'
                                          className={clz('text-danger', {'note-icon': _highlightNotes['note1']})}
                                          onClick={() => setHighLightNotes()}>※<sup>[1]</sup></span>
                                <span> {t('page-world:senka-rank-note1')}</span>
                            </p>
                        </div>
                    )
                }}
                columns={_.compact([{
                    align: 'center',
                    dataIndex: 'rankno',
                    title: t('page-world:rankno')
                }, {
                    align: 'center',
                    dataIndex: 'name',
                    title: t('page-world:tetoku')
                }, {
                    align: 'center',
                    title: () => (
                        <>
                            <span>{t('page-world:senka')}</span>
                            <a onClick={() => setHighLightNotes('note1')} href='#note1'>
                                <sup className='text-danger'>※[1]</sup>
                            </a>
                        </>
                    ),
                    render: item => {
                        let delta = item.senka_delta.toString();
                        if (item.senka_delta > 0) {
                            delta = '+' + delta
                        }
                        return (
                            <span onClick={() => openDetail(item.rankno)}
                                  className={clz(['senka-value', {
                                      'text-danger': item.senka_delta > 100,
                                      'text-warning': item.senka_delta > 50,
                                      'text-success': item.senka_delta > 0
                                  }])}>
                                    <span className='text text-bold'>{item.senka_val}</span>
                                    <sup>{`(${delta})`}</sup>
                                </span>
                        )
                    }
                }, {
                    align: 'center',
                    dataIndex: 'curMedal',
                    title: t('page-world:medal')
                }, {
                    align: 'center',
                    dataIndex: 'comment',
                    title: t('page-world:comment'),
                    render(text) {
                        return text || '--';
                    }
                }])}/>
        </>
    );
}

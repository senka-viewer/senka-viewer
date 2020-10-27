import _ from 'lodash'
import clz from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

import { Table, Switch, Select } from 'antd'

import SenkaDetail from './SenkaDetail'

import { withTranslation } from '../../i18n'

const { Option } = Select;

export default withTranslation('page-world')(class extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        players: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            selectedRow: -1,
            highlightNotes: [],
            showPrediction: false,
            modalVisible: false,
            modalPlayerNo: -1,
        };
    }

    setCurrentPage(current) {
        this.setState({ currentPage: current })
    }

    openDetail(playerNo) {
        this.setState({
            modalVisible: true,
            modalPlayerNo: playerNo
        })
    }

    closeDetail() {
        this.setState({
            modalVisible: false,
            modalPlayerNo: -1
        })
    }

    switchShowPrediction(checked) {
        this.setState({ showPrediction: checked });
        this.setHighLightNotes();
    }

    setSelectedRow(value) {
        this.setState({ selectedRow: value }, () => {
            const element = findDOMNode(this).querySelector(`[data-row-key="${value}"]`);
            if (element && element.scrollIntoView) {
                element.scrollIntoView();
            }
        });
        if (typeof value !== 'undefined') {
            this.setCurrentPage(Math.ceil((_.findIndex(this.props.players, player => player.rankno === value) + 1) / 20));
        }
    }

    setHighLightNotes(...notes) {
        this.setState({ highlightNotes: notes || [] })
    }

    render() {
        const { t, players } = this.props;
        const { showPrediction, currentPage, selectedRow, modalVisible, modalPlayerNo } = this.state;
        return (
            <>
                {modalVisible ? <SenkaDetail players={players} playerNo={modalPlayerNo} afterClose={this.closeDetail.bind(this)} /> : null}
                <Table
                    bordered
                    rowKey='rankno'
                    dataSource={players}
                    className='senka-ranking'
                    rowClassName={item => selectedRow === item.rankno ? 'highlight' : ''}
                    pagination={{
                        pageSize: 20,
                        position: 'top',
                        current: currentPage,
                        onChange: current => this.setCurrentPage(current)
                    }}
                    title={() => (
                        <>
                            <Select
                                showSearch
                                allowClear
                                onChange={value => this.setSelectedRow(value)}
                                style={{ marginRight: '10px', width: '250px' }}
                                placeholder={t('page-world:search-placeholder')}
                                filterOption={(input, option) => option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {players.map(player => (
                                    <Option key={player.rankno} label={player.name} value={player.rankno}>
                                        <span style={{ marginRight: '5px' }}>{player.name}</span>
                                        <sup className='text-info'>{`(No. ${player.rankno})`}</sup>
                                    </Option>
                                ))}
                            </Select>
                            <Switch checked={showPrediction} style={{ marginRight: '10px' }}
                                onChange={this.switchShowPrediction.bind(this)} />
                            <span>{t(`page-world:${showPrediction ? 'prediction-on' : 'prediction-off'}`)}</span>
                        </>
                    )}
                    footer={() => {
                        const highlightNotes = (this.state.highlightNotes || [])
                            .reduce((ret, item) => {
                                ret[item] = true;
                                return ret;
                            }, {});
                        return (
                            <div className='footer'>
                                <p className={clz({ highlight: highlightNotes['note1'] })}>
                                    <span id='note1'
                                        className={clz('text-danger', { 'note-icon': highlightNotes['note1'] })}
                                        onClick={() => this.setHighLightNotes()}>※<sup>[1]</sup></span>
                                    <span> {t('page-world:senka-rank-note1')}</span>
                                </p>
                                {
                                    showPrediction ? (
                                        <>
                                            <p className={clz({ highlight: highlightNotes['note2'] })}>
                                                <span id='note2'
                                                    className={clz('text-danger', { 'note-icon': highlightNotes['note2'] })}
                                                    onClick={() => this.setHighLightNotes()}>※<sup>[2]</sup></span>
                                                <span> {t('page-world:senka-rank-note2')}</span>
                                            </p>
                                            <p className={clz({ highlight: highlightNotes['note3'] })}>
                                                <span id='note3'
                                                    className={clz('text-danger', { 'note-icon': highlightNotes['note3'] })}
                                                    onClick={() => this.setHighLightNotes()}>※<sup>[3]</sup></span>
                                                <span> {t('page-world:senka-rank-note3')}</span>
                                            </p>
                                            <p className={clz({ highlight: highlightNotes['note23'] })}>
                                                <span id='note23'
                                                    className={clz('text-danger', { 'note-icon': highlightNotes['note23'] })}
                                                    onClick={() => this.setHighLightNotes()}>※<sup>[2,3]</sup></span>
                                                <span> {t('page-world:senka-rank-note23')}</span>
                                            </p>
                                        </>
                                    ) : null
                                }
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
                                <a onClick={() => this.setHighLightNotes('note1')} href='#note1'>
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
                                <span onClick={() => this.openDetail(item.rankno)}
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
                    }, showPrediction ? {
                        title: () => (
                            <>
                                <span>{t('page-world:prediction-pt')}</span>
                                <a onClick={() => this.setHighLightNotes('note2', 'note23')} href='#note2'>
                                    <sup className='text-danger'>※[2]</sup>
                                </a>
                            </>
                        ),
                        align: 'center',
                        dataIndex: 'predicteo',
                        render(val) {
                            return val === -1 ? '--' : val
                        }
                    } : null, showPrediction ? {
                        title: () => (
                            <>
                                <span>{t('page-world:prediction-st')}</span>
                                <a onClick={() => this.setHighLightNotes('note3', 'note23')} href='#note3'>
                                    <sup className='text-danger'>※[3]</sup>
                                </a>
                            </>
                        ),
                        align: 'center',
                        dataIndex: 'predicteo_special',
                        render(val) {
                            return val === -1 ? '--' : val
                        }
                    } : null, {
                        align: 'center',
                        dataIndex: 'comment',
                        title: t('page-world:comment'),
                        render(text) {
                            return text || '--';
                        }
                    }])} />
            </>
        );
    }
})

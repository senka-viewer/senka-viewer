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
        const { currentPage, selectedRow, modalVisible, modalPlayerNo } = this.state;
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
                    }, {
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

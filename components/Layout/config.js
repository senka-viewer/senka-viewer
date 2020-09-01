import jaJP from 'antd/lib/locale/ja_JP'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'

export const version = process.env.APP_VERSION;

export const commit = process.env.APP_COMMIT;

export const languages = [
    {
        value: 'ja',
        label: '日本語',
        source: jaJP
    },
    {
        value: 'zh',
        label: '中文',
        source: zhCN
    },
    {
        value: 'en',
        label: 'English',
        source: enUS
    }
];

export const lngSource = languages.reduce((ret, item) => {
    ret[item.value] = item.source;
    return ret;
}, {});

export const defaultLngSource = jaJP;

export const footerLinkList = [
    {
        title: 'contact',
        links: [
            {
                title: 'Discord',
                to: 'https://discordapp.com/invite/nMuqbju',
                external: true
            }
        ]
    },
    {
        title: 'follow',
        links: [
            {
                title: 'Twitter',
                to: 'https://twitter.com/Senka_Viewer',
                external: true
            },
            {
                title: 'Weibo',
                to: 'https://weibo.com/hitooi',
                external: true
            }
        ]
    },
    {
        title: 'links',
        links: [
            {
                title: 'OOI.MOE',
                to: 'http://ooi.moe',
                external: true
            }, {
                title: 'Kcwiki(舰娘百科)',
                to: 'https://zh.kcwiki.org',
                external: true
            },
            {
                title: 'Kancolle Wiki',
                to: 'http://kancolle.wikia.com/wiki/Kancolle_Wiki',
                external: true
            },
            {
                title: '艦これ攻略Wiki',
                to: 'https://wikiwiki.jp/kancolle',
                external: true
            }
        ]
    }
];

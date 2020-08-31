import React from 'react'
import { Alert } from 'antd'

import Layout from '../components/Layout';

function PageError({ statusCode }) {
    return (
        <Layout title='Error'>
            <Alert showIcon type='error' message={statusCode ? `An error occurred on server` : 'An error occurred on client'} />
        </Layout>
    )
}

PageError.getInitialProps = ({ res, err }) => {
    return {
        statusCode: res ? res.statusCode : err ? err.statusCode : 404,
        namespacesRequired: ['common'],
    };
};

export default PageError

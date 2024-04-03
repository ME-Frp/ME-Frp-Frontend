import React from 'react';
import Layout from './Layout';

const withLayout = (Component: React.ElementType) => {
  return function WithLayoutComponent(props: any) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
};

export default withLayout;
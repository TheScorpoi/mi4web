import React from 'react';
import PropTypes from 'prop-types';

import { TabComponents } from '@ohif/ui';

// Tabs
import './Login.styl';
import { InterfaceLogin } from './InterfaceLogin';
import { SignUp } from './SignUp';

const tabs = [
  {
    name: 'Login',
    Component: InterfaceLogin,
    customProps: {},
  },
  {
    name: 'Sign Up',
    Component: SignUp,
    customProps: {},
  },
];

function Login({ hide }) {
  const customProps = {
    onClose: hide,
  };
  return <TabComponents tabs={tabs} customProps={customProps} />;
}

Login.propTypes = {
  hide: PropTypes.func,
};

export { Login };

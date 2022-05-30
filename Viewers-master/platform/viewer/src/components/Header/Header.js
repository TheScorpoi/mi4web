import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, useSearchParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, withModal } from '@ohif/ui';
//
import { UserPreferences } from './../UserPreferences';
import OHIFLogo from '../OHIFLogo/OHIFLogo.js';
import './Header.css';

import api from '../Admin/Dashboard/pages/ApiConnections/apiManageAccess';

function Header(props) {
  const {
    t,
    user,
    userManager,
    modal: { show },
    useLargeLogo,
    linkPath,
    linkText,
    location,
    children,
  } = props;

  const [options, setOptions] = useState([]);
  const hasLink = linkText && linkPath;



  const token = props.location.search;

  if (token) {
    const id = token.split('=')[1];
    console.log('id: ' + id);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
      api.get(`/get_user_from_token/${id}`).then(res => {
        setData(res.data);
        console.log(res.data);
      });
    }, []);

    localStorage.setItem('user', JSON.stringify(data.map(d => d.fullname)));
    localStorage.setItem('type_user', JSON.stringify(data.map(d => d.type_user)));
  }
  

  useEffect(() => {
    const optionsValue = [
      {
        title: t('Preferences'),
        icon: {
          name: 'user',
        },
        onClick: () =>
          show({
            content: UserPreferences,
            title: t('User Preferences'),
          }),
      },
    ];

    if (user && userManager) {
      optionsValue.push({
        title: t('Logout'),
        icon: { name: 'power-off' },
        onClick: () => userManager.signoutRedirect(),
      });
    }

    setOptions(optionsValue);
  }, [setOptions, show, t, user, userManager]);

  const signIn = useRef(false);

  if (localStorage.getItem('user') == null) {
    signIn.current = false;
  } else {
    signIn.current = true;
  }

  function putNameOnHeader() {
    //if (signIn.current) {
      return localStorage.getItem('user').replace("[", "").replace("]", "").replace("\"", "").replace("\"", "");
    //} else {
    //  return "marta é";
    //}
  }


  return (
    <>
      <div className="notification-bar">{t('INVESTIGATIONAL USE ONLY')}</div>
      <div
        className={classNames('entry-header', { 'header-big': useLargeLogo })}
      >
        <div className="header-left-box">
          {location && location.studyLink && (
            <Link
              to={location.studyLink}
              className="header-btn header-viewerLink"
            >
              {t('Back to Viewer')}
            </Link>
          )}

          {children}

          {hasLink && (
            <Link
              className="header-btn header-studyListLinkSection"
              to={{
                pathname: linkPath,
                state: { studyLink: location.pathname },
              }}
            >
              {t(linkText)}
            </Link>
          )}
        </div>

        <div className="header-menu">
          <span className="research-use">{putNameOnHeader()}</span>
          <Dropdown title={t('Options')} list={options} align="right" />
          
          {!signIn.current ? (
            <button
              className="button"
              onClick={e => {
                e.preventDefault();
                window.location.href = 'http://localhost:9874/show_login';
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="button"
              onClick={e => {
                e.preventDefault();
                window.location.href = 'http://localhost:3000';
                localStorage.removeItem('user');
                localStorage.removeItem('type_user');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

Header.propTypes = {
  // Study list, /
  linkText: PropTypes.string,
  linkPath: PropTypes.string,
  useLargeLogo: PropTypes.bool,
  //
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
  t: PropTypes.func.isRequired,
  userManager: PropTypes.object,
  user: PropTypes.object,
  modal: PropTypes.object,
};

Header.defaultProps = {
  useLargeLogo: false,
  children: OHIFLogo(),
};

export default withTranslation(['Header', 'AboutModal'])(
  withRouter(withModal(Header))
);

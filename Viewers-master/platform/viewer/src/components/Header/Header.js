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
import PersonIcon from '@material-ui/icons/Person';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
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

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
      api.get(`/get_user_from_token/${id}`).then(res => {
        setData(res.data);
      });
    }, []);

    localStorage.setItem('user', JSON.stringify(data.map(d => d.fullname)));
    localStorage.setItem(
      'type_user',
      JSON.stringify(data.map(d => d.type_user))
    );
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

  const logged = localStorage.getItem('user');

  useEffect(() => {
    if (logged == null) {
      signIn.current = false;
    } else {
      if (logged == '["José  Trancoso"]') {
        window.location.href = '/dashboard';
      }

      signIn.current = true;
    }
  }, [logged]);

  function putNameOnHeader() {
    if (signIn.current) {
      return localStorage
        .getItem('user')
        .replace('[', '')
        .replace(']', '')
        .replace('"', '')
        .replace('"', '');
    } else {
      return '';
    }
  }

  return (
    <>
      <div className="notification-bar">{putNameOnHeader()}</div>
      <div
        className={classNames('entry-header', { 'header-big': useLargeLogo })}
      >
        <div className="header-left-box">
          <a href="/">
            <img
              src="https://scontent.xx.fbcdn.net/v/t1.15752-9/285323151_734512571117616_2759111543071222783_n.png?_nc_cat=109&ccb=1-7&_nc_sid=aee45a&_nc_ohc=RlTg9FtPwQEAX_XPdCP&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AVKHnScEZ7dKrUhBrF22UfiJyHhZNB62T1yoG3XrIb35MA&oe=62C12CDF"
              alt="MI4WEB"
              width={'150px'}
              height={'39px'}
            />
          </a>
        </div>

        <div className="header-menu" style={{ 'margin-top': '4%' }}>
          <div className="icon-css">
            {!signIn.current ? <span></span> : <PersonIcon fontSize="small" />}
          </div>
          <div className="research-use">
            <span>{putNameOnHeader()}</span>
          </div>
          <div className="dropdown-css">
            <Dropdown title={t('Options')} list={options} align="right" />
          </div>

          {!signIn.current ? (
            <button
              className="button-3"
              onClick={e => {
                e.preventDefault();
                window.location.href = 'http://localhost:9874/show_login';
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="button-3"
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

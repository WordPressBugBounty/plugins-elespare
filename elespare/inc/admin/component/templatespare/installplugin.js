const { __ } = wp.i18n;

import React from 'react';
import { useState, useEffect } from 'react';
import Templatesparedemo from './templatespare.js';
const Installplugin = ({
  templatespare_install,
  templatespare_active,
  page,
  message,
  currentTheme,
  pluginversion,
  ispro,
}) => {
  let classwrap = 'aft-bulk-active-plugin-installer';
  if (pluginversion !== 'false') {
    classwrap = 'aft-bulk-update-plugin-installer';
  }
  const [navState, setNavState] = useState('home');

  return (
    <div id="ele-templates-demo-lists" className="ele-templates-demo-lists">
      <div className="ele-templates-demo-lists-inner ele-container">
        <div className="ele-templates-demo-lists-header ele-row">
          <div className="ele-library-templates-header">
            <div className="ele-logo-area">
              <div className="brand-logo">
                <img
                  className="elespare-logo"
                  src={`${ELELibrary.logo}`}
                  height="100"
                  width="100"
                />
                {/* <span className="logo-subheading">LIBRARY</span> */}
              </div>
            </div>
            <div className="ele-menu-area">
              <div className="ele-templates-demo-lists-header-top-tabs">
                <>
                  <ul>
                    <li
                      className={`navbar-item settings ${navState == 'home' ? 'active' : 'inactive'}`}
                      onClick={(e) => handleNavStateChange('home')}
                    >
                      <a>{__('Homepage', 'elespare')}</a>
                    </li>
                    <li
                      className={`navbar-item settings ${navState == 'header' ? 'active' : 'inactive'}`}
                      onClick={(e) => handleNavStateChange('header')}
                    >
                      <a>{__('Header', 'elespare')}</a>
                    </li>
                    <li
                      className={`navbar-item settings ${navState == 'footer' ? 'active' : 'inactive'}`}
                      onClick={(e) => handleNavStateChange('footer')}
                    >
                      <a>{__('Footer', 'elespare')}</a>
                    </li>
                    <li
                      className={`navbar-item settings ${navState == 'blocks' ? 'active' : 'inactive'}`}
                      onClick={(e) => handleNavStateChange('blocks')}
                    >
                      <a>{__('Blocks', 'elespare')}</a>
                    </li>
                    <li
                      className={`navbar-item settings ${navState == 'themes' ? 'active' : 'inactive'}`}
                      onClick={(e) => handleNavStateChange('themes')}
                    >
                      <a>{__('Themes', 'elespare')}</a>
                    </li>
                  </ul>
                </>
              </div>
            </div>
          </div>
          <div className="ele-upgrade">
            <a
              href={`${ELELibrary.pricingURL}`}
              className="ele-upgrade"
              target="_blank"
            >
              {__('Upgrade', 'elspare')}
            </a>
            <a
              href="https://afthemes.com/free-wordpress-themes/"
              className="ele-all-themes-plan"
              target="_blank"
            >
              {__('Free WordPress Themes', 'elspare')}
            </a>
          </div>
        </div>

        <div className="ele-templates-demo-lists-body">
          <div className="ele-library-templates">
            <div className={`aft-general-info-link ${classwrap}`}>
              <Templatesparedemo
                templatespare_install={templatespare_install}
                templatespare_active={templatespare_active}
                page={page}
                message={message}
                currentTheme={currentTheme}
                pluginversion={pluginversion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Installplugin;

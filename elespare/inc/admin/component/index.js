import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './dashboard';
import Installplugin from './templatespare/installplugin';

document.addEventListener('DOMContentLoaded', () => {
  const templatespareEl = document.getElementById(
    'templatespare-plugin-install-activate'
  );

  if (templatespareEl) {
    const installAttribute = templatespareEl.getAttribute('install');
    const activateAttribute = templatespareEl.getAttribute('activate');
    const page = templatespareEl.getAttribute('data-plugin-page');
    const message = templatespareEl.getAttribute('message');
    const currentTheme = templatespareEl.getAttribute('current-theme');
    const pluginversion = templatespareEl.getAttribute('data-class');
    const ispro = templatespareEl.getAttribute('ispro');

    const root = createRoot(templatespareEl);
    root.render(
      <Installplugin
        templatespare_install={installAttribute}
        templatespare_active={activateAttribute}
        page={page}
        message={message}
        currentTheme={currentTheme}
        pluginversion={pluginversion}
        ispro={ispro}
      />
    );
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const rootId = 'elespare-demo-list';
  const container = document.getElementById(rootId);

  if (container) {
    const root = createRoot(container);
    root.render(<Dashboard />);
  }
});

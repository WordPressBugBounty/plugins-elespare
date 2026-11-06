var n = window.AFTHRAMPES_JS || {};

jQuery(document).ready(function ($) {
  'use strict';

  var is_loading = false;

  //Active plugins
  $(document).on(
    'click',
    '.aft-bulk-active-plugin-installer a.button',
    function (e) {
      e.preventDefault();

      var aft = $(this);
      var install = aft.data('install');
      var activate = aft.data('activate');
      var page = aft.data('page');

      aft.addClass('installing');
      $.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
          action: 'elespare_templatespare_plugin_installer_activation', // function path inc/blockspare-functions.php
          install: install,
          activate: activate,
          page: page,
          nonce: ELELibrary.admin_nonce,
          dataType: 'json',
        },
        success: function (response) {
          if (response.status == 'success') {
            // aft.removeClas('installing')
            window.location.href = response.url;
          }
        },
      });
    }
  );
});

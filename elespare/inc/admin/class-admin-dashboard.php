<?php

defined('ABSPATH') || exit;

if (!class_exists('Elespare_Dashboard')) {
  class Elespare_Dashboard
  {
    private static $instance;

    public static function instance()
    {
      if (! isset(self::$instance)) {
        self::$instance = new self();
      }
      return self::$instance;
    }

    public function __construct()
    {
      add_action('admin_menu', array($this, 'elespare_register_menu'));
      add_action('admin_enqueue_scripts', array($this, 'load_admin_style'));
      
      // Early activation handler to execute headers/redirects before HTML output
      add_action('admin_init', array($this, 'elespare_handle_elementor_activation'));

      include_once ELESPARE_DIR_PATH . 'inc/admin/widgets-list.php';
      include_once ELESPARE_DIR_PATH . 'inc/admin/class-dashboard.php';
      include_once ELESPARE_DIR_PATH . 'inc/admin/notice-upgrade.php';
      include_once ELESPARE_DIR_PATH . 'inc/admin/create-page.php';
    }

    /**
     * Handle silent Elementor activation cleanly on the admin_init hook.
     */
    public function elespare_handle_elementor_activation()
    {
      if (
        isset($_GET['page']) && 
        $_GET['page'] === 'elespare_dashboard' && 
        isset($_GET['action']) && 
        $_GET['action'] === 'elespare_activate_elementor'
      ) {
        if (current_user_can('activate_plugins') && check_admin_referer('elespare_activate_elementor_nonce')) {
          if (!function_exists('activate_plugin')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
          }

          // Suppress Elementor's onboarding wizard redirect
          delete_transient('elementor_activation_redirect');

          $result = activate_plugin('elementor/elementor.php');

          if (!is_wp_error($result)) {
            wp_safe_redirect(admin_url('admin.php?page=elespare_dashboard'));
            exit;
          }
        }
      }
    }

    public function load_admin_style()
    {
      wp_enqueue_style(
        'elespare-hf-admin',
        ELESPARE_DIR_URL . 'inc/admin/css/admin.css',
        array(),
        ELESPARE_VERSION
      );
    }

    public function elespare_register_menu()
    {
      $elespare_icon = <<< SVG
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">
<path d="M0,0v200h200V0H0z M33.8,50.9c19.5,0,38.8,0,58.7,0c0,6.7,0,12.8,0,19.2c-19.6,0-39,0-58.7,0C33.8,63.7,33.8,57.5,33.8,50.9
  z M33.7,90.6c19.7,0,39,0,58.7,0c0,6.5,0,12.7,0,19.2c-19.7,0-39,0-58.7,0C33.7,103.4,33.7,97.3,33.7,90.6z M166.3,70.1
  c-13.3,0-26.4,0-39.7,0c0,6.8,0,13.6,0,20.5c13.2,0,26.3,0,39.6,0c0,5,0,9.9,0,14.8c0,1.5,0,2.9,0,4.4c0,6.8,0,13.6,0,20.5
  c0,2.2,0,4.4,0,6.6c0,4,0,8,0,12.3c-24.5,0-48.9,0-73.8,0c-2.8,0-5.7,0-8.5,0c-16.6,0-33.3,0-50.2,0c0-6.2,0-12.3,0-18.9
  c16.6,0,33.3,0,50.2,0c2.8,0,5.7,0,8.5,0c18.1,0,36.3,0,54.7,0c0-6.8,0-13.6,0-20.5c-13.2,0-26.3,0-39.6,0c0-4.5,0-8.9,0-13.5
  c0-1.9,0-3.8,0-5.7c0-6.8,0-13.6,0-20.5c0-1.8,0-3.5,0-5.3c0-4.6,0-9.1,0-13.9c19.5,0,38.8,0,58.7,0
  C166.3,57.6,166.3,63.7,166.3,70.1z"/>
</svg>
SVG;

      add_menu_page(
        __('Elespare', 'elespare'), // Page Title.
        __('Elespare', 'elespare'), // Menu Title.
        'edit_posts', // Capability.
        'elespare_dashboard', // Menu slug.
        array($this, 'elespare_render_starter_page'),
        'data:image/svg+xml;base64,' . base64_encode($elespare_icon),
        50
      );

      // Check if Elementor installed and activated.
      if (did_action('elementor/loaded')) {
        add_submenu_page(
          'elespare_dashboard', // Parent slug.
          __('Templates Kits', 'elespare'), // Page title.
          __('Templates Kits', 'elespare'), // Menu title.
          'manage_options', // Capability.
          'elespare_dashboard', // Menu slug.
          array($this, 'elespare_render_starter_page') // Callback function.
        );

        add_submenu_page(
          'elespare_dashboard', // Parent slug.
          __('Header/Footer Builder', 'elespare'), // Page title.
          __('Header/Footer Builder', 'elespare'), // Menu title.
          'manage_options', // Capability.
          'elespare_header_footer', // Menu slug.
          array($this, 'elespare_header_footer_dashboard') // Callback function.
        );
      }

      $badge_demo = __('Import', 'elespare'); // Dynamic count variable
      add_submenu_page(
        'elespare_dashboard', // Parent slug.
        __('Import Starter Demo Sites', 'elespare'), // Page title.
        sprintf(
          __('Demo Sites %s', 'elespare'),
          '<span class="update-plugins count-' . esc_attr($badge_demo) . '"><span class="plugin-count">' . esc_html($badge_demo) . '</span></span>'
        ),
        'manage_options', // Capability.
        'elespare-demo-import', // Menu slug.
        array($this, 'elespare_admin_demo_import'), // Callback function.
        2 // Position
      );

      add_submenu_page(
        'elespare_dashboard', // Parent slug.
        __('Dashboard', 'elespare'), // Page title.
        __('Dashboard', 'elespare'), // Menu title.
        'manage_options', // Capability.
        'elespare_explore_more', // Menu slug.
        array($this, 'elespare_render_menu_page') // Callback function.
      );

      $badge_free = __('Free', 'elespare'); // Dynamic count variable
      add_submenu_page(
        'elespare_dashboard',
        __('Themes', 'elespare'),
        sprintf(
          __('Themes %s', 'elespare'),
          '<span class="update-plugins count-' . esc_attr($badge_free) . '"><span class="plugin-count">' . esc_html($badge_free) . '</span></span>'
        ),
        'manage_options',
        esc_url('https://afthemes.com/free-wordpress-themes/')
      );

      $badge_free = __('New', 'elespare'); // Dynamic count variable
      add_submenu_page(
        'elespare_dashboard',
        __('Reviews', 'elespare'),
        sprintf(
          __('Reviews %s', 'elespare'),
          '<span class="update-plugins count-' . esc_attr($badge_free) . '"><span class="plugin-count">' . esc_html($badge_free) . '</span></span>'
        ),
        'manage_options',
        esc_url('https://wordpress.org/support/plugin/elespare/reviews/?filter=5')
      );

      if (ELESPARE_SHOW_PRO_NOTICES) {
        add_submenu_page(
          'elespare_dashboard', // Parent slug.
          __('Upgrade', 'elespare'), // Page title.
          __("<span class='dashicons dashicons-star-filled' style='font-size: 17px'></span> Upgrade Pro ", 'elespare'), // Menu title.
          'manage_options', // Capability.
          esc_url('https://afthemes.com/plugins/elespare/') // Callback function.
        );
      }

      add_action('admin_head', array($this, 'elespare_correct_current_menu'), 50);
    }

    public function elespare_render_menu_page()
    {
      Elespare_General_Dashboard::elespare_render_menu_page();
    }

    public function elespare_render_starter_page()
    { 
      if (!did_action('elementor/loaded')) {
        if (!function_exists('get_plugins')) {
          require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $installed_plugins = get_plugins();
        $is_installed = isset($installed_plugins['elementor/elementor.php']);

        if ($is_installed) {
          $action_url = wp_nonce_url(
            admin_url('admin.php?page=elespare_dashboard&action=elespare_activate_elementor'),
            'elespare_activate_elementor_nonce'
          );
          $button_text = __('Activate Elementor Now', 'elespare');
        } else {
          $action_url = self_admin_url('plugin-install.php?s=elementor&tab=search&type=term');
          $button_text = __('Install Elementor', 'elespare');
        }
        ?>
        <div class="wrap" style="margin: 40px auto; max-width: 900px;">
          <div style="background: #fff; border: 1px solid #c3c4c7; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 50px 40px; text-align: center;">
            
            <!-- Top Icon Header -->
            <div style="width: 70px; height: 70px; background: #fdf2f4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
              <span class="dashicons dashicons-admin-plugins" style="font-size: 36px; width: 36px; height: 36px; color: #d63638;"></span>
            </div>

            <!-- Main Title & Description -->
            <h2 style="font-size: 26px; font-weight: 600; color: #1d2327; margin-top: 0; margin-bottom: 12px;">
              <?php esc_html_e('Elementor Page Builder Required', 'elespare'); ?>
            </h2>
            <p style="font-size: 15px; color: #646970; line-height: 1.6; max-width: 680px; margin: 0 auto 35px auto;">
              <?php esc_html_e('To unlock the full power of EleSpare and access stunning Template Kits, a visual Header/Footer Builder, and advanced news widgets, please install and activate the Elementor plugin.', 'elespare'); ?>
            </p>

            <!-- Feature Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; text-align: left; margin: 0 auto 35px auto; max-width: 760px;">
              
              <!-- Card 1 -->
              <div style="background: #f8f9fa; border: 1px solid #dcdcde; border-radius: 6px; padding: 16px 18px; display: flex; gap: 14px; align-items: flex-start;">
                <span class="dashicons dashicons-layout" style="font-size: 22px; width: 22px; height: 22px; color: #2271b1; margin-top: 2px;"></span>
                <div>
                  <h4 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 600; color: #1d2327;"><?php esc_html_e('Professional Template Kits', 'elespare'); ?></h4>
                  <p style="margin: 0; font-size: 12px; color: #646970; line-height: 1.4;"><?php esc_html_e('Ready-to-import layouts for modern websites.', 'elespare'); ?></p>
                </div>
              </div>

              <!-- Card 2 -->
              <div style="background: #f8f9fa; border: 1px solid #dcdcde; border-radius: 6px; padding: 16px 18px; display: flex; gap: 14px; align-items: flex-start;">
                <span class="dashicons dashicons-editor-kitchensink" style="font-size: 22px; width: 22px; height: 22px; color: #2271b1; margin-top: 2px;"></span>
                <div>
                  <h4 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 600; color: #1d2327;"><?php esc_html_e('Header & Footer Builder', 'elespare'); ?></h4>
                  <p style="margin: 0; font-size: 12px; color: #646970; line-height: 1.4;"><?php esc_html_e('Design custom site navigation visually.', 'elespare'); ?></p>
                </div>
              </div>

              <!-- Card 3 -->
              <div style="background: #f8f9fa; border: 1px solid #dcdcde; border-radius: 6px; padding: 16px 18px; display: flex; gap: 14px; align-items: flex-start;">
                <span class="dashicons dashicons-grid-view" style="font-size: 22px; width: 22px; height: 22px; color: #2271b1; margin-top: 2px;"></span>
                <div>
                  <h4 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 600; color: #1d2327;"><?php esc_html_e('Advanced News Widgets', 'elespare'); ?></h4>
                  <p style="margin: 0; font-size: 12px; color: #646970; line-height: 1.4;"><?php esc_html_e('Tailored blocks for magazines and portals.', 'elespare'); ?></p>
                </div>
              </div>

              <!-- Card 4 -->
              <div style="background: #f8f9fa; border: 1px solid #dcdcde; border-radius: 6px; padding: 16px 18px; display: flex; gap: 14px; align-items: flex-start;">
                <span class="dashicons dashicons-art" style="font-size: 22px; width: 22px; height: 22px; color: #2271b1; margin-top: 2px;"></span>
                <div>
                  <h4 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 600; color: #1d2327;"><?php esc_html_e('Zero Coding Required', 'elespare'); ?></h4>
                  <p style="margin: 0; font-size: 12px; color: #646970; line-height: 1.4;"><?php esc_html_e('Full drag-and-drop visual customization.', 'elespare'); ?></p>
                </div>
              </div>

            </div>

            <!-- Action Button -->
            <p style="margin: 0;">
              <a href="<?php echo esc_url($action_url); ?>" class="button button-primary button-hero" style="font-size: 15px; padding: 10px 28px; height: auto; box-shadow: 0 2px 5px rgba(34,113,177,0.3);">
                <?php echo esc_html($button_text); ?>
              </a>
            </p>

          </div>
        </div>
        <?php
        return;
      }
      ?>
      <div id="elespare-demo-list"></div>
    <?php }

    public function elespare_header_footer_dashboard()
    {
      $url = admin_url() . 'edit.php?post_type=elespare_builder';
    ?>
      <script>
        location.href = '<?php echo esc_url($url); ?>';
      </script>
      <?php
    }

    public function elespare_admin_demo_import()
    {
      include_once ELESPARE_DIR_PATH . 'inc/admin/templatespare-demo.php';
      new Templatespare_Starter_Sites();
    }

    /**
     * Add/Remove appropriate CSS classes to Menu so Submenu displays open and the Menu link is styled appropriately.
     */
    public function elespare_correct_current_menu()
    {
      $screen = get_current_screen();

      if ($screen->id == 'elespare_builder' || $screen->id == 'edit-elespare_builder') {
      ?>
        <script type="text/javascript">
          jQuery(document).ready(function($) {
            $('#toplevel_page_elespare_dashboard').addClass('wp-has-current-submenu wp-menu-open menu-top menu-top-first').removeClass('wp-not-current-submenu');
            $('#toplevel_page_elespare_dashboard > a').addClass('wp-has-current-submenu').removeClass('wp-not-current-submenu');
          });
        </script>
      <?php
      }

      if ($screen->id == 'elespare_builder') {
      ?>
        <script type="text/javascript">
          jQuery(document).ready(function($) {
            $('a[href$="elespare_header_footer"]').parent().addClass('current');
            $('a[href$="elespare_header_footer"]').addClass('current');
          });
        </script>
      <?php
      }

      if ($screen->id == 'edit-elespare_builder') {
      ?>
        <script type="text/javascript">
          jQuery(document).ready(function($) {
            $('a[href$="elespare_header_footer"]').parent().addClass('current');
            $('a[href$="elespare_header_footer"]').addClass('current');
          });
        </script>
<?php
      }
    }
  }
  Elespare_Dashboard::instance();
}
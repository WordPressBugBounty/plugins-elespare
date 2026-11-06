<?php

defined('ABSPATH') || exit;

if (!class_exists('Templatespare_Starter_Sites')) {

  class Templatespare_Starter_Sites
  {
    const templatespare_old_version = '2.3.0';
    private $theme_slug;
    private $theme_name;
    public function __construct()
    {
      $theme = wp_get_theme();
      $this->theme_name = $theme->get('Name');
      $this->theme_slug = $theme->get_template();
      $this->templatespare_render_starter_sites();
    }

    public function templatespare_render_starter_sites()
    {
      $templatespare_installed = $this->templatespare_get_plugin_file('templatespare');
      $templatespare_version = '';

      if (!empty($templatespare_installed)) {
        $plugin_data = get_plugin_data(
          WP_PLUGIN_DIR . '/' . $templatespare_installed
        );

        $templatespare_version = $plugin_data['Version'] ?? '';
      }

      $templatespare_active = is_plugin_active('templatespare/templatespare.php');

      $install = [];
      $activate = [];

      if (empty($templatespare_installed)) {
        $install = ['templatespare'];
      } elseif (!$templatespare_active) {
        $activate = ['templatespare'];
      }

      $plugin_update = (
        !empty($templatespare_version) &&
        version_compare($templatespare_version, self::templatespare_old_version, '<')
      );

      // Templatespare is installed, active, and up to date.
      if (!empty($templatespare_installed) && $templatespare_active && !$plugin_update) {
?>
        <div id="elespare-templatespare-template-collcetion">


          <?php $this->elespare_render_header();
          ?>

          <div id="templatespare-template-collcetion-dashboard" selectedLanguage=""
            selectedBuilder="elementor">

          </div>




        <?php
        return;
      }

      wp_enqueue_style('templatespare');

      if ($templatespare_active && $plugin_update) {
        $class = admin_url('plugins.php');

        $message = __(
          'The Templatespare plugin should be updated to the latest version',
          'elespare'
        );
      } else {
        $class = 'false';

        $message = __(
          'Import a Starter Site, Personalize, and Live it in 3 Easy Steps!',
          'elespare'
        );
      }
      wp_enqueue_script('block_admin_plugin_install');
      // Starter site notice.
        ?>

        <div id="templatespare-plugin-install-activate" data-class=<?php echo $class; ?> current-theme=<?php echo esc_attr($this->theme_slug) ?> install=<?php echo json_encode($install); ?> activate=<?php echo json_encode($activate); ?> data-plugin-page='elespare-demo-import' message='<?php echo $message; ?>' ispro=''></div>

      <?php
    }


    public function templatespare_get_plugin_file($plugin_slug)
    {
      require_once(ABSPATH . '/wp-admin/includes/plugin.php'); // Load plugin lib
      $plugins = get_plugins();

      foreach ($plugins as $plugin_file => $plugin_info) {

        // Get the basename of the plugin e.g. [askismet]/askismet.php
        $slug = dirname(plugin_basename($plugin_file));

        if ($slug) {
          if ($slug == $plugin_slug) {
            return $plugin_file; // If $slug = $plugin_name
          }
        }
      }
      return null;
    }



    /**
     * Get header tabs data.
     *
     * @return array
     */
    private function elespare_get_header_data()
    {
      $tabs = array();

      // Check if Elementor is active to conditionally include internal builder menus
      if (did_action('elementor/loaded')) {
        $tabs[] = array(
          'label' => __('Templates', 'elespare'),
          'id'    => 'templates',
          'url'   => admin_url('admin.php?page=elespare_dashboard'),
          'page'  => 'elespare_dashboard',
        );
        $tabs[] = array(
          'label' => __('Header/Footer Builder', 'elespare'),
          'id'    => 'header_footer_builder',
          'url'   => admin_url('admin.php?page=elespare_header_footer'),
          'page'  => 'elespare_header_footer',
        );
      }

      // Append remaining primary navigation tabs
      $tabs[] = array(
        'label' => __('Dashboard', 'elespare'),
        'id'    => 'home',
        'url'   => admin_url('admin.php?page=elespare_explore_more'),
        'page'  => 'elespare_explore_more',
      );
      $tabs[] = array(
        'label' => __('Free Themes', 'elespare'),
        'id'    => 'free_themes',
        'url'   => 'https://afthemes.com/products/category/free/',
        'external' => true,
      );
      $tabs[] = array(
        'label' => __('Premium Themes', 'elespare'),
        'id'    => 'pro_themes',
        'url'   => 'https://afthemes.com/products/category/pro/',
        'external' => true,
      );
      $tabs[] = array(
        'label' => __('Support', 'elespare'),
        'id'    => 'support',
        'url'   => 'https://afthemes.com/suports/',
        'external' => true,
      );

      $header_data = array(
        'logo' => array(
          'src'    => ELESPARE_DIR_URL . 'inc/admin/svg/elespare.png',
          'height' => 100,
          'width'  => 100,
          'alt'    => __('Elespare Logo', 'elespare'),
        ),
        'tabs' => $tabs,
        'actions' => array(
          array(
            'label'    => __('Upgrade', 'elespare'),
            'url'      => isset($ELELibrary['pricingURL']) ? $ELELibrary['pricingURL'] : 'https://afthemes.com/plugins/elespare/',
            'class'    => 'ele-upgrade',
            'external' => true,
          ),
          array(
            'label'    => __('Access All Demos', 'elespare'),
            'url'      => 'https://afthemes.com/all-themes-plan/',
            'class'    => 'ele-all-themes-plan',
            'external' => true,
          ),
        ),
      );

      /**
       * Allow other code to modify the header data.
       */
      return apply_filters('elespare_header_data', $header_data);
    }

    function elespare_is_active_tab($tab)
    {
      if (! empty($tab['external'])) {
        return false;
      }

      $current_page      = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : '';
      $current_post_type = isset($_GET['post_type']) ? sanitize_key(wp_unslash($_GET['post_type'])) : '';

      if (! empty($tab['page']) && $tab['page'] === $current_page) {
        return true;
      }

      if (! empty($tab['post_type']) && $tab['post_type'] === $current_post_type) {
        return true;
      }

      return false;
    }

    /**
     * Render the header.
     */
    function elespare_render_header()
    {
      $header_data = $this->elespare_get_header_data();
      ?>
        <div id="ele-templates-demo-lists" class="ele-templates-demo-lists">
          <div class="ele-templates-demo-lists-inner ele-container">
            <div class="ele-templates-demo-lists-header ele-row">
              <div class="ele-library-templates-header">
                <div class="ele-logo-area">
                  <div class="brand-logo">
                    <?php if (!empty($header_data['logo']['src'])) : ?>
                      <img
                        class="elespare-logo"
                        src="<?php echo esc_url($header_data['logo']['src']); ?>"
                        height="<?php echo esc_attr($header_data['logo']['height']); ?>"
                        width="<?php echo esc_attr($header_data['logo']['width']); ?>"
                        alt="<?php echo esc_attr($header_data['logo']['alt']); ?>" />
                    <?php endif; ?>
                  </div>
                </div>
                <div class="ele-menu-area">
                  <div class="ele-templates-demo-lists-header-top-tabs">
                    <ul>
                      <?php foreach ($header_data['tabs'] as $tab) : ?>
                        <?php
                        $is_active = $this->elespare_is_active_tab($tab);
                        $state_class = $is_active ? 'active' : 'inactive';
                        $tab_url = !empty($tab['url']) ? $tab['url'] : '#';
                        $tab_url_target = !empty($tab['external']) ? "_blank" : '_self';
                        ?>
                        <li class="navbar-item settings <?php echo esc_attr($state_class); ?>">
                          <a href="<?php echo esc_url($tab_url); ?>" target="<?php echo esc_attr($tab_url_target); ?>">
                            <?php echo esc_html($tab['label']); ?>
                          </a>
                        </li>
                      <?php endforeach; ?>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="ele-upgrade">
                <?php foreach ($header_data['actions'] as $action) : ?>
                  <?php
                  $target = !empty($action['external']) ? '_blank' : '_self';
                  $rel = ('_blank' === $target) ? 'rel="noopener noreferrer"' : '';
                  ?>
                  <a
                    href="<?php echo esc_url($action['url']); ?>"
                    class="<?php echo esc_attr($action['class']); ?>"
                    target="<?php echo esc_attr($target); ?>"
                    <?php echo $rel; ?>>
                    <?php echo esc_html($action['label']); ?>
                  </a>
                <?php endforeach; ?>
              </div>
            </div>
          </div>

    <?php
    }
  }
}

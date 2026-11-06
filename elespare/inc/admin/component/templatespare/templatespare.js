const { __ } = wp.i18n;
const Templatesparedemo = ({
  templatespare_install,
  templatespare_active,
  page,
  message,
  currentTheme,
  pluginversion,
}) => {
  let hreflink = '#';
  let buttonText = __('Get Started', 'elespare');
  let targetLnik = '_self';
  if (pluginversion !== 'false') {
    hreflink = pluginversion;
    buttonText = __('Update Templatespare', 'elespare');
    targetLnik = '_blank';
  }

  return (
    <div className="templatespare-demo templatespare-main-demo">
      <div className="templatespare-demo-lists-wrapper">
        <div className="templatespare-section-all-demos">
          <div className="bs-top-notice">
            <div className="notice-detils-wrapper">
              <h3 className="bs-title">
                {__('Create Your Dream Website in Minutes!', 'elespare')}
              </h3>

              <p className="bs-title">
                {__(
                  'No coding needed. One-click import of expert-made starter sites with customizer, widgets, Elementor Template Kits, and Gutenberg Patterns. Start now with Templatespare Plugin!',
                  'elespare'
                )}
              </p>

              <a
                href={hreflink}
                target={targetLnik}
                data-install={templatespare_install}
                data-activate={templatespare_active}
                data-page={page}
                className="button button-primary"
              >
                <strong>{buttonText}</strong>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#ffffff"
                >
                  <g strokeWidth="0"></g>
                  <g strokeLinecap="round" strokeLinejoin="round"></g>
                  <g>
                    {' '}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.6492 11.2501L12.7904 6.53852L13.8346 5.46167L20.5774 12.0001L13.8346 18.5385L12.7904 17.4617L17.6492 12.7501H3V11.2501H17.6492Z"
                      fill="#ffffff"
                    ></path>{' '}
                  </g>
                </svg>
              </a>
              <span> {message}</span>
            </div>
            <div className="notice-img-wrapper">
              <img src={ELELibrary.starter_sites} alt="elespare"></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Templatesparedemo;

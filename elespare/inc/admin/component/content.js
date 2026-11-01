import { useState, useEffect } from "react";
const { apiFetch } = wp;
const { __ } = wp.i18n;
import Loader from "./../../../src/components/loader";
import Masonry from 'react-masonry-component';

const imagepath = ELELibrary.externalUrl;

const themeItems = [
  {
    slug: 'covernews',
    title: __('CoverNews', 'elespare'),
    description: __(
      'A high-density news and magazine theme. Fully compatible with EleSpare Elementor template kits, custom header/footer layouts, and news widgets.',
      'elespare'
    ),
    badge: __('News Portals & Digital Publications', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/covernews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/CoverNews.jpg',
  },
  {
    slug: 'chromenews',
    title: __('ChromeNews', 'elespare'),
    description: __(
      'Designed for modern online newspapers featuring light and dark modes. Enhanced by EleSpare Elementor post grids and ticker widgets.',
      'elespare'
    ),
    badge: __('Newspaper-Style Websites', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/chromenews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/ChromeNews.jpg',
  },
  {
    slug: 'morenews',
    title: __('MoreNews', 'elespare'),
    description: __(
      'A versatile magazine theme with flexible layout controls. Easily build custom magazine homepages using EleSpare Elementor blocks.',
      'elespare'
    ),
    badge: __('Modern Online Magazines', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/morenews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/MoreNews.jpg',
  },
  {
    slug: 'darknews',
    title: __('DarkNews', 'elespare'),
    description: __(
      'A dark-styled editorial theme built for impact. Combine with EleSpare high-contrast Elementor widgets for sleek news portals.',
      'elespare'
    ),
    badge: __('Dark News & Magazine Websites', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/darknews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/DarkNews.jpg',
  },
  {
    slug: 'newsphere',
    title: __('Newsphere', 'elespare'),
    description: __(
      'Flexible editorial theme built for fast content delivery. Import pre-designed EleSpare site kits to construct rich editorial layouts.',
      'elespare'
    ),
    badge: __('News Portals & Editorial Blogs', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/newsphere/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/Newsphere.jpg',
  },
  {
    slug: 'elegant-magazine',
    title: __('Elegant Magazine', 'elespare'),
    description: __(
      'Clean, typography-driven theme for blogs and digital magazines. Customize section layouts and archives with EleSpare Elementor tools.',
      'elespare'
    ),
    badge: __('Editorial & Magazine Sites', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/elegant-magazine/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/Elegant-Magazine.jpg',
  },
  {
    slug: 'enternews',
    title: __('EnterNews', 'elespare'),
    description: __(
      'An engaging publication theme designed for newspapers and blogs. Drag and drop EleSpare news blocks directly onto your Elementor pages.',
      'elespare'
    ),
    badge: __('Digital Newspapers & Magazines', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/enternews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/EnterNews.jpg',
  },
  {
    slug: 'newsever',
    title: __('Newsever', 'elespare'),
    description: __(
      'RTL-supported magazine theme optimized for global publishing. Pairs effortlessly with EleSpare header and footer templates.',
      'elespare'
    ),
    badge: __('News Websites & Online Magazines', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/newsever/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/Newsever.jpg',
  },
  {
    slug: 'newsium',
    title: __('Newsium', 'elespare'),
    description: __(
      'Content-rich publishing theme designed for news and review portals. Seamlessly extended via EleSpare Elementor layout kits.',
      'elespare'
    ),
    badge: __('News Portals & Digital Publications', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/newsium/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/Newsium.jpg',
  },
  {
    slug: 'newspare',
    title: __('NewSpare', 'elespare'),
    description: __(
      'Modern block and page-builder ready theme. Pair EleSpare Elementor builder elements with clean theme architecture.',
      'elespare'
    ),
    badge: __('Modern Page Builder Ready', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/newspare/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/NewSpare.jpg',
  },
  {
    slug: 'reviewnews',
    title: __('ReviewNews', 'elespare'),
    description: __(
      'Specialized review and news publishing theme. Design custom review grids and post listings using EleSpare drag-and-drop widgets.',
      'elespare'
    ),
    badge: __('News, Reviews & Editorial Publishing', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/reviewnews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/ReviewNews.jpg',
  },
  {
    slug: 'broadnews',
    title: __('BroadNews', 'elespare'),
    description: __(
      'Wide-layout publishing theme built for multi-category editorial portals. Maximize visual impact with EleSpare layout sections.',
      'elespare'
    ),
    badge: __('Publishing & High-Density Content', 'elespare'),
    downloadUrl: 'https://afthemes.com/products/broadnews/',
    preview: (window.ELELibrary?.adminAssetsURL || '') + '/admin/images/themes/BroadNews.jpg',
  },
];

const Content = ({ demosData, blocks, navState }) => {
    const [preState, setPreState] = useState(false);
    const itemsPerPage = 10;
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [tmpl, setTmpl] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const importJsonData = async (e, content, type, folderPath) => {
        setIsLoading(true);

        let tmpl = await apiFetch({
            path: 'elespare/v1/import-template?elepsapre_templates_kit=' + content + '&type=' + type + '&folder_path=' + folderPath,
            method: "POST"
        }).then((tmpl) => {
            setTmpl(tmpl);
            window.aftModal.hide();
            elementor.previewView.addChildModel(tmpl.data.template.content);
            $e.run('document/save/default');

            elementor.notifications.showToast({
                message: elementor.translate('Template Imported!')
            });

            setIsLoading(false);
        });
    }

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    const masonryOptions = {
        transitionDuration: 0,
        percentPosition: true,
    };

    const handleBtnStateChange = (e, preState) => {
        e.preventDefault();
        setPreState(preState);
    }

    const adminThemeInstallUrl = ELELibrary?.wpAdminUrl 
        ? `${ELELibrary.wpAdminUrl}theme-install.php?search=` 
        : 'theme-install.php?search=';

    return (
        <>
            <Masonry
                elementType={'ul'}
                className={`ele-templates-container`}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
            >
                {navState === 'themes' ? (
                    <div className="themes-panel news-panel" style={{ width: '100%', gridColumn: '1 / -1' }}>
                        <div className="panel-header">
                            <h2>{__('Recommended Free WordPress Themes for News, Magazines & Blogs', 'elespare')}</h2>
                            <p className="panel-subtitle">
                                {__(
                                    'Power your news, magazine, and blog sites with free WordPress themes designed to work out-of-the-box with Elementor and EleSpare template kits.',
                                    'elespare'
                                )}
                            </p>
                        </div>

                        <div className="themes-item bs-themes-grid">
                            {themeItems.map((theme) => {
                                const installUrl = `${adminThemeInstallUrl}${theme.slug}`;

                                return (
                                    <div className="bs-card theme-card" key={theme.slug}>
                                        <div className="bs-content">
                                            <div className="bs-preview">
                                                <div className="bs-image-placeholder">
                                                    <img
                                                        src={theme.preview}
                                                        alt={theme.title}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bs-info">
                                                {theme.badge && <span className="bs-tag">{theme.badge}</span>}
                                                <h3 className="bs-title">{theme.title}</h3>
                                                <p className="bs-description">{theme.description}</p>

                                                <div className="bs-card-actions">
                                                    <a
                                                        href={installUrl}
                                                        className="button button-primary bs-btn-install"
                                                    >
                                                        {__('Install Now', 'elespare')}
                                                    </a>
                                                    <a
                                                        href={theme.downloadUrl}
                                                        className="button button-secondary bs-btn-download"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {__('View Details', 'elespare')}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            isLoading ? <Loader /> : demosData && demosData.map((data, i) => {
                                let otherFolder = data.image.split('/');

                                const isProExists = data.hasOwnProperty('ispro');
                                const isFlexLayout = data.hasOwnProperty('flex');

                                let proUrl = '';
                                if (isProExists === true) {
                                    proUrl = imagepath.replace('/free', '/');
                                } else {
                                    proUrl = imagepath;
                                }

                                return (
                                    <React.Fragment key={i}>
                                        {
                                            navState === 'home' && data.type === 'homepage' && <li>
                                                <div className="template-item-figure">
                                                    <div className="ele-library-template-body">
                                                        <img src={`${proUrl}/${data.type}/${data.image}/${data.content}.png`} alt="template-thumbnail" />
                                                        <a onClick={(e) => handleBtnStateChange(e, true)} data-src={data.url} data-name={data.title} className="elespare-immport-btn elespare-open-iframe" >
                                                            <i className="eicon-zoom-in-bold" aria-hidden="true"></i><span>{__('View', 'elespare')}</span>
                                                        </a>
                                                    </div>
                                                    <div className="ele-library-template-footer">
                                                        <h3>{data.title}</h3>
                                                        {(isProExists !== true) ? (
                                                            <a href={ELELibrary.newPageUrl + "=" + data.content + "&page_title=" + data.title + "&action=elementor" + "&type=" + data.type + "&folder_path="} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-admin-appearance">{__('Use Template', 'elespare')}</span>
                                                            </a>
                                                        ) : ''}
                                                        {isProExists === true &&
                                                            <a href={ELELibrary.pricingURL} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-superhero-alt">{__('Upgrade', 'elespare')}</span>
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                        {
                                            navState === 'header' && data.type === 'header' && <li>
                                                <div className="template-item-figure">
                                                    <div className="ele-library-template-body">
                                                        <img src={`${proUrl}/${data.type}/${data.image}/${data.content}.png`} alt="template-thumbnail" />
                                                        <a onClick={(e) => handleBtnStateChange(e, true)} data-src={data.url} data-name={data.title} className="elespare-immport-btn elespare-open-iframe" >
                                                            <i className="eicon-zoom-in-bold" aria-hidden="true"></i><span>{__('View', 'elespare')}</span>
                                                        </a>
                                                    </div>
                                                    <div className="ele-library-template-footer">
                                                        <h3>{data.title}</h3>
                                                        {(isProExists !== true) ? (
                                                            <a href={ELELibrary.newPageUrl + "=" + data.content + "&page_title=" + data.title + "&action=elementor" + "&type=" + data.type + "&folder_path="} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-admin-appearance">{__('Use Template', 'elespare')}</span>
                                                            </a>
                                                        ) : ""}
                                                        {isProExists === true &&
                                                            <a href={ELELibrary.pricingURL} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-superhero-alt">{__('Upgrade', 'elespare')}</span>
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                        {
                                            navState === 'footer' && data.type === 'footer' && <li>
                                                <div className="template-item-figure">
                                                    <div className="ele-library-template-body">
                                                        <img src={`${proUrl}/${data.type}/${data.image}/${data.content}.png`} alt="template-thumbnail" />
                                                        <a onClick={(e) => handleBtnStateChange(e, true)} data-src={data.url} data-name={data.title} className="elespare-immport-btn elespare-open-iframe" >
                                                            <i className="eicon-zoom-in-bold" aria-hidden="true"></i><span>{__('View', 'elespare')}</span>
                                                        </a>
                                                    </div>
                                                    <div className="ele-library-template-footer">
                                                        <h3>{data.title}</h3>
                                                        {(isProExists !== true) ? (
                                                            <a href={ELELibrary.newPageUrl + "=" + data.content + "&page_title=" + data.title + "&action=elementor" + "&type=" + data.type + "&folder_path="} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-admin-appearance">{__('Use Template', 'elespare')}</span>
                                                            </a>
                                                        ) : ""}
                                                        {isProExists === true &&
                                                            <a href={ELELibrary.pricingURL} target="_blank" className="elespare-immport-btn">
                                                                <span className="dashicons dashicons-superhero-alt">{__('Upgrade', 'elespare')}</span>
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                        {
                            isLoading ? <Loader /> : blocks && blocks.slice(0, visibleItems).map((block, i) => {
                                let blockFolder = block.image.split('/');
                                const isProExists = block.hasOwnProperty('ispro');

                                let proUrl = '';
                                if (isProExists === true) {
                                    proUrl = imagepath.replace('/free', '/');
                                } else {
                                    proUrl = imagepath;
                                }

                                return (
                                    navState === 'blocks' && block.type === 'blocks' && <li key={i}>
                                        <div className="template-item-figure">
                                            <div className="ele-library-template-body">
                                                <img src={`${proUrl}/${block.type}/${block.image}/${block.content}.png`} alt="template-thumbnail" />
                                                <a onClick={(e) => handleBtnStateChange(e, true)} data-src={block.url} data-name={block.title} className="elespare-immport-btn elespare-open-iframe" >
                                                    <i className="eicon-zoom-in-bold" aria-hidden="true"></i><span>{__('View', 'elespare')}</span>
                                                </a>
                                            </div>
                                            <div className="ele-library-template-footer">
                                                <h3>{block.title}</h3>
                                                {(isProExists !== true) ? (
                                                    <a href={ELELibrary.newPageUrl + "=" + block.content + "&page_title=" + block.title + "&type=" + block.type + "&action=elementor&folder_path=" + blockFolder[0]} target="_blank" className="elespare-immport-btn">
                                                        <span className="dashicons dashicons-admin-appearance">{__('Use Template', 'elespare')}</span>
                                                    </a>
                                                ) : ""}
                                                {isProExists === true &&
                                                    <a href={ELELibrary.pricingURL} target="_blank" className="elespare-immport-btn">
                                                        <span className="dashicons dashicons-superhero-alt">{__('Upgrade', 'elespare')}</span>
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </>
                )}
            </Masonry>
            <>
                {navState === 'blocks' && visibleItems < blocks.length && (
                    <button onClick={loadMore} className="ele-load-more">Load More</button>
                )}
            </>
        </>
    );
};

export default Content;
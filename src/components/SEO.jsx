import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
  title = 'Rodella Composites - Premium Carbon Fiber & Composite Materials',
  description = 'Leading supplier of high-performance carbon fiber, glass fiber, aramid fabrics, composite tubes, plates, epoxy resins, and adhesives. Professional-grade materials for aerospace, automotive, and industrial applications.',
  canonical = 'https://rodella.shop',
  keywords = 'carbon fiber, glass fiber, aramid, composite materials, epoxy resin, carbon kevlar, composite tubes, composite plates, aerospace materials, automotive composites',
  type = 'website',
  image = 'https://rodella.shop/assets/logo.jpg',
  imageAlt = 'Rodella Composites Logo',
  structuredData = null,
  noindex = false,
  breadcrumbs = null
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rodella Composites",
    "url": "https://rodella.shop",
    "logo": "https://rodella.shop/assets/logo.jpg",
    "description": "Leading supplier of premium composite materials including carbon fiber, glass fiber, aramid fabrics, and epoxy systems.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://rodella.shop/contact"
    },
    "sameAs": [
      "https://www.rodella.shop"
    ]
  };

  // Merge default structured data with any additional structured data
  const finalStructuredData = structuredData 
    ? Array.isArray(structuredData) 
      ? [defaultStructuredData, ...structuredData]
      : [defaultStructuredData, structuredData]
    : defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Rodella Composites" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Rodella Composites" />
      <meta name="theme-color" content="#000000" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData, null, 2)}
      </script>
      
      {/* Breadcrumbs Structured Data */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": breadcrumb.name,
              "item": breadcrumb.url
            }))
          }, null, 2)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  keywords: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noindex: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }))
};

export default SEO; 
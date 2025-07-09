// Structured Data Components for Rodella Composites

export const createProductStructuredData = (product, category, baseUrl = 'https://rodella.shop') => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": `High-quality ${category} - ${product.title}. Professional-grade composite material suitable for aerospace, automotive, and industrial applications.`,
    "image": product.images?.map(img => `${baseUrl}${img}`) || [`${baseUrl}/assets/logo.jpg`],
    "brand": {
      "@type": "Brand",
      "name": "Rodella Composites"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Rodella Composites",
      "url": baseUrl
    },
    "offers": {
      "@type": "Offer",
      "price": product.mrp || product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Rodella Composites"
      }
    },
    "category": category,
    "additionalProperty": product.details ? Object.entries(product.details).map(([key, value]) => ({
      "@type": "PropertyValue",
      "name": key,
      "value": value
    })) : []
  };
};

export const createWebSiteStructuredData = (baseUrl = 'https://rodella.shop') => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rodella Composites",
    "url": baseUrl,
    "description": "Premium supplier of carbon fiber, glass fiber, aramid fabrics, composite tubes, plates, epoxy resins, and adhesives for professional applications.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rodella Composites",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/assets/logo.jpg`
      }
    }
  };
};

export const createStoreStructuredData = (baseUrl = 'https://rodella.shop') => {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Rodella Composites",
    "url": baseUrl,
    "description": "Leading online store for premium composite materials including carbon fiber, glass fiber, aramid fabrics, and professional-grade epoxy systems.",
    "image": `${baseUrl}/assets/logo.jpg`,
    "priceRange": "₹250 - ₹5000",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Online Payment",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Composite Materials Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Carbon Fiber Materials",
            "category": "Composite Materials"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Glass Fiber Materials",
            "category": "Composite Materials"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Epoxy Resins & Adhesives",
            "category": "Chemical Products"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Composite Tubes & Plates",
            "category": "Structural Components"
          }
        }
      ]
    }
  };
};

export const createCollectionPageStructuredData = (collectionName, products, baseUrl = 'https://rodella.shop') => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${collectionName} - Rodella Composites`,
    "description": `Browse our premium ${collectionName.toLowerCase()} collection. High-quality composite materials for professional applications.`,
    "url": `${baseUrl}/${collectionName.toLowerCase().replace(/\s+/g, '-')}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${collectionName} Products`,
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.title,
        "url": `${baseUrl}/${collectionName.toLowerCase().replace(/\s+/g, '-')}#${product.id}`,
        "image": product.images?.[0] ? `${baseUrl}${product.images[0]}` : `${baseUrl}/assets/logo.jpg`,
        "offers": {
          "@type": "Offer",
          "price": product.mrp || product.price,
          "priceCurrency": "INR"
        }
      }))
    }
  };
};

export const createContactPageStructuredData = (baseUrl = 'https://rodella.shop') => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Rodella Composites",
    "description": "Get in touch with Rodella Composites for premium composite materials, custom solutions, and technical support.",
    "url": `${baseUrl}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": "Rodella Composites",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "IN"
      }
    }
  };
};

export const createFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Common FAQ data for composite materials
export const compositeMaterialsFAQs = [
  {
    question: "What is carbon fiber and what are its applications?",
    answer: "Carbon fiber is a high-strength, lightweight composite material made from carbon atoms. It's widely used in aerospace, automotive, sports equipment, and industrial applications due to its excellent strength-to-weight ratio and stiffness."
  },
  {
    question: "What's the difference between carbon fiber and glass fiber?",
    answer: "Carbon fiber is stronger, lighter, and more expensive than glass fiber. Glass fiber is more cost-effective and offers good strength for many applications. Carbon fiber is preferred for high-performance applications, while glass fiber is ideal for general-purpose use."
  },
  {
    question: "How do I choose the right epoxy resin for my project?",
    answer: "Choose epoxy resin based on your application requirements: service temperature, cure time, viscosity, and mechanical properties. Our technical team can help you select the right compound for your specific needs."
  },
  {
    question: "Do you provide technical support for composite applications?",
    answer: "Yes, we provide comprehensive technical support including material selection guidance, application techniques, and troubleshooting for all our composite materials and epoxy systems."
  },
  {
    question: "What is the minimum order quantity for composite materials?",
    answer: "We cater to both small-scale prototyping and large-scale production needs. Contact us for specific minimum order quantities as they vary by product type and customization requirements."
  }
]; 
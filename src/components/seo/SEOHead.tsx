import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '@/constants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  keywords?: string;
  structuredData?: Record<string, any>;
}

export function SEOHead({
  title,
  description = SITE_CONFIG.description,
  canonicalUrl = window.location.href,
  ogType = 'website',
  ogImage = `${SITE_CONFIG.url}/og-image.png`,
  keywords = SITE_CONFIG.keywords,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

const tenantMiddleware = (req, res, next) => {
  const host = req.headers.host;
  
  if (!host) {
    return next();
  }

  // Handle localhost and production domains
  const parts = host.split('.');
  
  // If we have at least 3 parts (e.g., client.uzafo.uz) or 2 parts on localhost (client.localhost:5000)
  let subdomain = null;
  
  if (parts.length >= 3) {
    subdomain = parts[0];
  } else if (host.includes('localhost') && parts.length >= 2) {
    subdomain = parts[0];
  }

  // Filter out common non-tenant subdomains
  const reservedSubdomains = ['www', 'uzafo', 'admin', 'api', 'mail'];
  
  if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
    req.tenantId = subdomain.toLowerCase();
  } else if (subdomain === 'admin') {
    req.isAdminDomain = true;
  }

  next();
};

module.exports = tenantMiddleware;

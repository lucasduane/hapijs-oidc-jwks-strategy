'use strict';

const formatCertificate = function (cert) {
  const beginCert = '-----BEGIN CERTIFICATE-----';
  const endCert = '-----END CERTIFICATE-----';

  cert = cert.replace('\n', '');
  cert = cert.replace(beginCert, '');
  cert = cert.replace(endCert, '');

  let result = beginCert;

  while (cert.length > 0) {
    if (cert.length > 64) {
      result += `\n${cert.substring(0, 64)}`;
      cert = cert.substring(64, cert.length);
    } else {
      result += `\n${cert}`;
      cert = '';
    }
  }

  result += `\n${endCert}\n`;

  return result;
};

module.exports = formatCertificate;

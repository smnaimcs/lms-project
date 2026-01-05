const generateTransactionId = () => {
	return 'TXN' + Date.now() + Math.random().toString(36).substr(2,9);
};

const generateCertificateId = () => {
	return 'CERT' + Date.now() + Math.random().toString(36).substr(2,9);
};

module.exports = { generateTransactionId, generateCertificateId };
const dev = {
  API_ENDPOINT_URL: 'https://mom-app-ad61901f627b.herokuapp.com'
};

const prod = {
  API_ENDPOINT_URL: 'https://mom-app-ad61901f627b.herokuapp.com'
};

const test = {
  API_ENDPOINT_URL: 'https://mom-app-ad61901f627b.herokuapp.com'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()

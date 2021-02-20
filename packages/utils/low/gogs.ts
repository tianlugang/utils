const { URL, URLSearchParams } = require('url'),
	fetch = require('node-fetch'),
	chalk = require('chalk'),
	{ Headers } = fetch,
	{ isObject } = require('./helper'),
	Logger = require('./Logger'),
	logger = new Logger('gogs-api');

class UserClient {
	constructor(serv) {

		this.serv = null;
		this.URL = null;
		if (serv) {
			this.use(serv);
		}
	}

	use(serv) {
		this.serv = serv;
		this.URL = new URL(serv);

		return this;
	}

	get url() {
		if (this.URL) {

			return this.URL.href;
		}

		return '';
	}
	set url(pathname) {
		this.URL = new URL(this.serv);
		this.URL.pathname += pathname;
	}

	setSecret(username, password) {

		return 'Basic ' + Buffer.from(username + ':' + password, 'UTF-8').toString('base64');
	}

	getSecret(secret) {
		secret = secret.split('Basic ').filter(Boolean).join('');
		const info = Buffer.from(secret, 'base64').toString().split(':');

		return {
			username: info[0],
			password: info[1]
		};
	}

	async request(param = {}) {
		if (!isObject(param)) {
			return;
		}
		const options = {}, headers = new Headers({ 'Content-Type': 'application/json' });

		options.method = param.method.toUpperCase() || 'GET';
		this.url = param.url;

		if (isObject(param.body)) {
			if (options.method !== 'GET') {
				options.body = JSON.stringify(param.body);
			} else {
				this.URL.search = new URLSearchParams(param.body);
			}
		}

		if (param.username && param.password) {
			this.URL.username = param.username;
			this.URL.password = param.password;
		} else if (param.token) {
			headers.append('Authorization', 'token ' + (isObject(param.token) ? param.token.sha1 : param.token));
		} else if (param.secret) {
			headers.append('Authorization', param.secret);
		}

		options.headers = headers;

		return await fetch(this.url, options).then((res) => {
			let data = null;

			if (res.status === 200) {
				data = res.json();
			}

			return {
				ok: res.ok,
				status: res.status,
				message: res.statusText,
				data: data
			};
		}).then(data => data).catch(err => {
			logger.erro(chalk.red(param.url) + ' 请求出错, 错误类型 ' + chalk.red(err.name) + ', 错误信息 ' + chalk.red(err.message));
			logger.log('错误调用堆栈', err.stack);
		});
	}

	async getUserInfo(auth) {

		return await this.request({
			url: 'users/' + auth.username,
			method: 'GET',
			...auth
		});
	}

	async searchUsers(auth, query, limit) {

		return await this.request({
			url: 'users/search',
			method: 'GET',
			body: {
				q: query,
				limit: limit || 10
			},
			...auth
		});
	}

	// 不能通过传递token实现
	async getUserToken(auth) {

		return await this.request({
			url: 'users/' + auth.username + '/tokens',
			method: 'GET',
			...auth
		});
	}

	// 不能通过传递token实现
	async createUserToken(auth, name = 'test') {

		return await this.request({
			url: 'users/' + auth.username + '/tokens',
			method: 'POST',
			body: {
				name: name
			},
			...auth
		});
	}

	async getUserPublicKeys(auth) {
		return await this.request({
			url: 'users/' + auth.username + '/keys',
			method: 'GET',
			...auth
		});
	}

	// 422 请求格式良好，但由于语义错误而无法继续。
	async createUserPublicKey(auth, key) {
		return await this.request({
			url: 'user/keys',
			method: 'POST',
			body: {
				title: key.title,
				key: key.key
			},
			...auth
		});
	}

	async searchUserPublicKey(auth, key) {
		return await this.request({
			url: 'user/keys/' + key.id,
			method: 'GET',
			...auth
		});
	}

	async deletePublicKey(auth, key) {
		return await this.request({
			url: 'user/keys/' + key.id,
			method: 'DELETE',
			...auth
		});
	}

	async createRepo(auth, repo) {
		return await this.request({
			url: 'user/repos',
			method: 'POST',
			body: {
				name: repo.name,
				description: repo.description,
				private: repo.private
			},
			...auth
		});
	}

	async	deleteRepo(user, repo) {
		return await this.request({
			method: 'DELETE',
			url: 'repos/' + user.username + '/' + repo.name,
			...user
		});
	}

	async searchRepos(auth, { query, uid, limit }) {

		return await this.request({
			method: 'GET',
			url: 'repos/search',
			body: {
				q: query || '',
				uid: uid || 10,
				limit: limit || 10
			},
			...auth
		});
	}

	async getRepo(auth, repoFullname) {
		return await this.request({
			method: 'GET',
			url: 'repos/' + repoFullname,
			...auth
		});
	}

	async	listRepos(user) {
		return await this.request({
			method: 'GET',
			url: 'user/repos',
			...user
		}, user);
	}


	async createUser(auth, user) {
		return await this.request({
			method: 'POST',
			url: 'admin/users',
			body: {
				'username': user.username,
				'password': user.password,
				'email': user.email,
				'send_notify': user.notify === true
			},
			...auth
		});
	}

	async editUser(auth, user) {
		return await this.request({
			method: 'PATCH',
			url: 'admin/users/' + auth.username,
			body: {
				...user
			},
			...auth
		});
	}

	async deleteUser(auth, user) {
		if (auth.username === user.username) {
			return Promise.reject('用户不能自己删除自己');
		}

		return await this.request({
			method: 'DELETE',
			url: 'admin/users/' + user.username,
			...auth
		});
	}
}

module.exports = UserClient;

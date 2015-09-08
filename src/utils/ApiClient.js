import superagent from 'superagent';

const API_ROOT = 'http://bifrost.tw.appier:2341'

class ApiClient {
  constructor(req) {
    ['get', 'post', 'put', 'patch', 'del'].
      forEach((method) => {
        this[method] = (path, options) => {
          return new Promise((resolve, reject) => {
            const request = superagent[method](this.formatUrl(path));
            if (options && options.params) {
              request.query(options.params);
            }
            if (options && options.data) {
              request.type('form').send(options.data);
            }
            const {schema} = options;
            request.withCredentials().end((err, res) => {
              if (err) {
                reject(JSON.parse(res.text)|| err);
              } else {
                resolve(JSON.parse(res.text));
              }
            });
          });
        };
      });
  }

  /* This was originally a standalone function outside of this class, but babel kept breaking, and this fixes it  */
  formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    // Prepend `/api` to relative URL, to proxy to API server.
    return API_ROOT + adjustedPath;
  }
}

export default ApiClient;

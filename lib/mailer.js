import Nodemailer from 'nodemailer';
import { dedent } from './utils';


export default class Mailer {

    constructor(options = {}) {
        let { host, port = 25, sender, recipient } = options;

        this.transport = Nodemailer.createTransport({ host, port });
        this.message = {
            from: sender,
            to: recipient
        };
    }

    send(pkg, cb) {
        let { id: name, doc } = pkg;
        let { 'dist-tags': tags } = doc;
        let version = ('latest' in tags) ? tags.latest : 'unknown';
        let { repository: repo = 'Not found.' } = doc.versions[version];
        repo = (typeof repo === 'object') ? repo.url : repo;

        let subject = `npm publish notification - ${name}`;
        let text = dedent`
            Module: ${name}
            Version: ${version}
            Repo: ${repo}
        `;

        let message = Object.assign({
            subject,
            text
        }, this.message);

        this.transport.sendMail(message, cb);
    }

}
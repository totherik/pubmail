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
        let { 'dist-tags': { latest: version } } = doc;
        let { homepage = 'n/a', repository = 'Not found.' } = doc.versions[version];

        let subject = `npm publish ${name}@${version}`;
        let text = dedent`
            Module: ${name}
            Version: ${version}
            Homepage: ${homepage}
            Repository: ${(typeof repository === 'object') ? repository.url : repository}
        `;

        let message = Object.assign({
            subject,
            text
        }, this.message);

        this.transport.sendMail(message, cb);
    }

}
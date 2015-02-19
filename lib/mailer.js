import Nodemailer from 'nodemailer';
import { dedent } from './utils';
import template from './template';


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
        let { homepage, repository, description, author, _npmUser: publisher } = doc.versions[version];

        if (typeof repository === 'object') {
            repository = repository.url;
        }

        let subject = `npm publish ${name}@${version}`;
        let text = template({ name, version, homepage, repository, description, author, publisher  });

        let message = Object.assign({
            subject,
            text
        }, this.message);

        this.transport.sendMail(message, cb);
    }

}
import Nodemailer from 'nodemailer';
import template from './template';
import Utils from './utils';


export default class Mailer {

    constructor(options = {}) {
        let { host, port = 25, sender, recipient } = options;

        this.transport = Nodemailer.createTransport({ host, port });
        this.message = {
            from: sender,
            to: recipient
        };
    }

    send({ id: name, doc }, cb) {
        let { 'dist-tags': { latest: version } } = doc;
        let {
            homepage,
            repository = { },
            description,
            author,
            _npmUser: publisher
        } = doc.versions[version];

        let { url: repo } = repository;
        let gitHeads = Utils.gitHeads(version, doc.versions);
        let changes = Utils.link2diff(repository, gitHeads);

        let message = Object.assign({
            subject: `npm publish ${name}@${version}`,
            text: template({ name, version, homepage, repo, description, author, publisher, changes  })
        }, this.message);

        this.transport.sendMail(message, cb);
    }

}
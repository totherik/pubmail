#!/usr/bin/env node
import zmq from 'zmq';
import Util from 'util';
import minimist from 'minimist';
import Disclose from 'disclose';
import Mailer from '../lib/mailer';
import Dbrickashaw from 'dbrickashaw';


const log = Dbrickashaw.createLogger('pubmail');
const argv = minimist(process.argv.slice(2), {
    alias: {
        host:     'h',
        port:     'p',
        sender:   's',
        recipient:'r',
        publisher:'z',
        identity: 'id'
    },
    default: {
        host:      process.env.SMTP_HOST || undefined,
        port:      process.env.SMTP_PORT || undefined,
        sender:    process.env.PUBMAIL_SENDER || undefined,
        recipient: process.env.PUBMAIL_RECIPIENT || undefined,
        publisher: process.env.ZEROMQ_PUBLISHER || 'tcp://127.0.0.1:12345',
        identity:  process.env.ZEROMQ_SOCKET_IDENTITY || 'npm-publish-subscriber-%d'
    }
});

const mailer = new Mailer(argv);

const socket = zmq.socket('sub');
socket.identity = Util.format(argv.identity, process.pid);
socket.connect(argv.publisher);
socket.subscribe(Disclose.EVENT);

socket.on('error', (err) => {
    log.error(['socket'], err);
});

socket.on('message', function(_/*, identity*/, event) {
    event = JSON.parse(event.toString());

    log.info(['publish'], event.id);

    mailer.send(event, (err, res) => {
        if (err) {
            log.error(['mail'], err.stack);
            return;
        }
        log.info(['mail'], res);
    })
});

log.info(['socket'], `Socket ${socket.identity} connected to ${argv.publisher}`);
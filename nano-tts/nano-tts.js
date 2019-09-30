module.exports = function(RED) {

    const tmpdir = require("os").tmpdir;
    const execFile = require("child_process").execFile;

    function NanoTTSNode(n) {
        RED.nodes.createNode(this, n);
        this.action = n.action;
        this.lang = n.lang;
        this.pitch = n.pitch;
        this.speed = n.speed;
        this.volume = n.volume;
        this.outdir = n.outdir;
        var node = this;
        var actions = ["p", "c", "w"];
        var languages = ["en-US","en-GB","de-DE","fr-FR","es-ES","it-IT"];
        var minMax = {"pitch":[0.5,2], "speed":[0.2,5], "volume":[0,5]}
        //var outdirRX = new RegExp(/^[0-9A-Za-Z_-]{3,20}$/);

        this.on("input", function (msg) {
            node.action = (node.action || "p");
            node.lang   = (node.lang   || msg.lang   || "en-US");
            node.pitch  = (node.pitch  || msg.pitch  || 1);
            node.speed  = (node.speed  || msg.speed  || 1);
            node.volume = (node.volume || msg.volume || 1);
            node.outdir = (node.outdir || tmpdir());

            if(actions.indexOf(node.action) == -1) {
                node.error("Invalid action supplied.");
                return;
            }
            if(languages.indexOf(node.lang) == -1) {
                node.error("Invalid language supplied.");
                return;
            } 
            for(var param in minMax) {
                if(isNaN(node[param])) {
                    node.error("Non-numeric value supplied for " + param + ".");
                    return;
                } else if(node[param] < minMax[param][0] || node[param] > minMax[param][1]) {
                    node.error("Parameter " + param + " out of range.");
                    return;
                }
            }
            // TODO: check that outdir is a valid directory

            node.status({fill:"green",shape:"dot"});

            var execOpts = {};
            execOpts.cwd = node.outdir;
            if(node.action == "c") {
                execOpts.encoding = "buffer";
            }

            execFile("/home/ola/Sources/nanotts/nanotts",[
                    "-" + node.action, 
                    "-v", node.lang, 
                    "--pitch", node.pitch, 
                    "--speed", node.speed, 
                    "--volume", node.volume, 
                    msg.payload
                ], execOpts, function (err, stdout, stderr) {
                    if (err) {
                        node.error(err);
                        return;
                    }
                    //var msg = {};
                    switch(node.action) {
                        case "c":
                            msg.payload = stdout;
                            break;
                        case "w":
                            var rePattern = new RegExp(/\"(\S*)\".*\(([0-9]+).*\)/);
                            msg.payload = true; //TODO: "false" if unable to write?
                            msg.filename = node.outdir + "/" + stderr.match(rePattern)[1];
                            msg.filesize = parseInt(stderr.match(rePattern)[2]);
                            break;
                        case "p":
                            msg.payload = true; //TODO: "false" if unable to play?
                    }
                    // TODO: node.error on error + node.status({fill:"red",shape:"dot"})?
                    node.send(msg); // TODO: only send if successful?
                    node.status({});
                }
            );
        });
    }
    RED.nodes.registerType("nano-tts", NanoTTSNode);
}
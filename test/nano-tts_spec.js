
var should = require("should");
var helper = require("node-red-node-test-helper");
var testNode = require("../nano-tts/nano-tts.js");

describe("nano-tts node", function() {
    "use strict";

    beforeEach(function(done) {
        helper.startServer(done);
    });

    afterEach(function(done) {
        helper.unload().then(function() {
            helper.stopServer(done);
        });
    });

    it("should be loaded with correct defaults", function(done) {
        var flow = [{"id":"n1", "type":"nano-tts", "name":"nano-tts", "wires":[[]]}];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            n1.should.have.property("name");
            n1.should.have.property("action");
            n1.should.have.property("lang");
            n1.should.have.property("pitch");
            n1.should.have.property("speed");
            n1.should.have.property("volume");
            n1.should.have.property("outdir");
            done();
        });
    });
    it("should emit a buffer", function(done) {
        var flow = [{"id":"n1", "type":"nano-tts", action:"c", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("payload");
                msg.payload.should.be.an.instanceOf(Buffer);
                msg.payload.should.have.length(20480);
                done();
            });
            n1.emit("input", {payload:"Hello"});
        });
    });
    it("should emit a file", function(done) {
        var flow = [{"id":"n1", "type":"nano-tts", action:"w", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("filename");
                msg.filename.should.be.an.instanceOf(String);
                msg.should.have.a.property("filesize");
                msg.filesize.should.be.an.instanceOf(Number);
                msg.filesize.should.equal(20524);
                done();
            });
            n1.emit("input", {payload:"Hello"});
        });
    });
    it("should switch voice", function(done) {
        var flow = [{"id":"n1", "type":"nano-tts", action:"w", lang: "de-DE", wires:[["n2"]] },
            {id:"n2", type:"helper"} ];
        helper.load(testNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.a.property("filename");
                msg.filename.should.be.an.instanceOf(String);
                msg.should.have.a.property("filesize");
                msg.filesize.should.be.an.instanceOf(Number);
                msg.filesize.should.equal(21292);
                done();
            });
            n1.emit("input", {payload:"Hello"});
        });
    });
    //TODO: How to test playback?
});

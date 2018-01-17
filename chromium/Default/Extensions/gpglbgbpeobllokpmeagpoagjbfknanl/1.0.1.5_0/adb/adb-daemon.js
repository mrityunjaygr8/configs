;
(function() {
  
function AdbDaemon(transport, maxPayload) {
  this.transport = transport;
  this.sockets = {};
  this.currentSocketId = 0;
  this.maxPayload = maxPayload || AdbDevice.MAX_PAYLOAD;
}

AdbDaemon.prototype.start = function(properties) {
  var props = str2ab(properties, undefined, true);
  this.sendMessage(AdbDevice.kCommandCNXN, AdbDevice.ADB_PROTOCOL_VERSION, this.maxPayload, props)
  this.receiveMessages();
}

AdbDaemon.prototype.fatal = function(result) {
  console.log('fatal error', result)
  var cb = this.onClose;
  if (cb) {
    delete this.onClose;
    cb();
  }
}

AdbDaemon.prototype.sendMessage = AdbDevice.prototype.sendMessage;
AdbDaemon.prototype.receiveMessages = AdbDevice.prototype.receiveMessages;
AdbDaemon.prototype.onReceiveMessage = AdbDevice.prototype.onReceiveMessage;
AdbDaemon.prototype.handleMessage = AdbDevice.prototype.handleMessage;
AdbDaemon.prototype.handleUnknown = AdbDevice.prototype.handleUnknown;
AdbDaemon.prototype.newAdbSocket = AdbDevice.prototype.newAdbSocket;
AdbDaemon.prototype.destroy = AdbDevice.prototype.destroy;

AdbDaemon.prototype.onOpenSocket = function(payload, remoteSocketId) {
  if (this.openSocket) {
    var socketId = ++this.currentSocketId;
    // console.log('daemon', ab2str(payload), socketId, remoteSocketId)
    var socket = this.newAdbSocket(socketId);
    socket.remoteId = remoteSocketId;
    this.sockets[socketId] = socket;
    this.sendMessage(AdbDevice.kCommandOKAY, socketId, remoteSocketId);
    this.openSocket(ab2str(payload), socket);
  }
}

window.AdbDaemon = AdbDaemon;
})();
